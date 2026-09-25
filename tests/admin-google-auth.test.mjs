import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import ts from "typescript";

const runtimeRequire = createRequire(import.meta.url);
const { NextRequest } = runtimeRequire("next/server");

const clientId = "fake-web.apps.googleusercontent.com";
const nonce = "a".repeat(43);
const cookieName = "ekipma_admin_google_nonce";
const token = (claims = {}) => `header.${Buffer.from(JSON.stringify({ nonce, aud: clientId, ...claims })).toString("base64url")}.signature`;

// Execute the actual TypeScript handlers and cookie helper with NextResponse.
// Only server-only and the upstream HTTP boundary are replaced for Node tests.
function handlers({ fetch: upstream, configured = clientId } = {}) {
  const calls = [];
  const cache = new Map();
  const fakeFetch = async (url, options) => {
    calls.push({ url, options });
    if (upstream) return upstream(url, options);
    if (url.endsWith("/challenge")) return Response.json({ nonce, expiresIn: 300 });
    if (url.endsWith("/admin/me")) return Response.json({ id: "1", role: 3 });
    return Response.json({ auth: { accessToken: "fake-access", refreshToken: "fake-refresh" } });
  };
  function load(file) {
    if (cache.has(file)) return cache.get(file);
    const exports = {};
    cache.set(file, exports);
    const source = ts.transpileModule(fs.readFileSync(path.join(import.meta.dirname, "..", file), "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    }).outputText;
    const localRequire = (id) => {
      if (id === "server-only") return {};
      if (id.startsWith("@/")) return load(id.slice(2) + ".ts");
      return runtimeRequire(id);
    };
    vm.runInNewContext(source, { exports, require: localRequire, Buffer, AbortSignal, URL, fetch: fakeFetch, process: { env: { NODE_ENV: "production", EKIPMA_API_URL: "https://api.example", GOOGLE_OAUTH_WEB_CLIENT_ID: configured } } }, { filename: file });
    return exports;
  }
  return { ...load("lib/admin-google-auth.ts"), calls };
}
function request({ body = { idToken: token() }, cookie = nonce, origin = "https://ekipma.ir", type = "application/json" } = {}) {
  return new NextRequest("https://ekipma.ir/api/admin/oauth/google", {
    method: "POST",
    headers: { origin, "content-type": type, cookie: cookie ? `${cookieName}=${cookie}` : "" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}
function noSession(response) {
  assert.equal(response.cookies.has("ekipma_admin_access"), false);
  assert.equal(response.cookies.has("ekipma_admin_refresh"), false);
}

test("challenge sets a short-lived secure browser binding", async () => {
  const h = handlers();
  const response = await h.googleChallenge(request());
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { nonce, expiresIn: 300 });
  const cookie = response.cookies.get(cookieName);
  assert.equal(cookie.value, nonce);
  assert.equal(cookie.httpOnly, true);
  assert.equal(cookie.secure, true);
  assert.equal(cookie.sameSite, "strict");
  assert.equal(cookie.maxAge, 300);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(h.calls[0].options.headers["X-Version"], "v0.8.1");
});

test("successful login verifies admin role before setting session cookies", async () => {
  const h = handlers();
  const response = await h.googleLogin(request());
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(h.calls.length, 2);
  assert.equal(h.calls[1].url, "https://api.example/api/v1/admin/me");
  assert.equal(h.calls[1].options.headers.Authorization, "Bearer fake-access");
  assert.equal(response.cookies.get(cookieName).maxAge, 0);
  for (const name of ["ekipma_admin_access", "ekipma_admin_refresh"]) {
    assert.equal(response.cookies.get(name).httpOnly, true);
    assert.equal(response.cookies.get(name).secure, true);
  }
});

test("rejects cross-origin requests and disabled configuration without upstream calls", async () => {
  for (const configured of [clientId, ""]) {
    const h = handlers({ configured });
    for (const action of [h.googleChallenge, h.googleLogin]) {
      const response = await action(request(configured ? { origin: "https://attacker.example" } : {}));
      assert.equal(response.status, configured ? 403 : 503);
      noSession(response);
    }
    assert.equal(h.calls.length, 0);
  }
});

test("requires browser nonce and correct Web audience before trusting upstream", async () => {
  for (const input of [{ cookie: "" }, { cookie: "wrong" }, { body: { idToken: token({ aud: "other-client" }) } }, { body: { idToken: "malformed" } }, { body: "{bad json" }, { body: {} }]) {
    const h = handlers();
    const response = await h.googleLogin(request(input));
    assert.ok([400, 401, 422].includes(response.status));
    assert.equal(h.calls.length, 0);
    noSession(response);
    assert.equal(response.cookies.get(cookieName).maxAge, 0);
  }
});

test("rejects wrong content type and oversized credentials", async () => {
  const h = handlers();
  assert.equal((await h.googleLogin(request({ type: "text/plain" }))).status, 415);
  assert.equal((await h.googleLogin(request({ body: { idToken: "x".repeat(12001) } }))).status, 422);
  assert.equal((await h.googleLogin(request({ body: "x".repeat(17000) }))).status, 413);
  assert.equal(h.calls.length, 0);
});

test("never grants sessions for unverified tokens, non-admins, or unavailable services", async () => {
  for (const failure of ["invalid-token", "non-admin", "network", "invalid-response", "admin-network"]) {
    const h = handlers({
      fetch: async (url) => {
        if (failure === "network" || (url.endsWith("/admin/me") && failure === "admin-network")) throw new Error("offline");
        if (failure === "invalid-token") return Response.json({}, { status: 401 });
        if (failure === "invalid-response") return Response.json({});
        if (url.endsWith("/admin/me")) return Response.json({}, { status: 403 });
        return Response.json({ auth: { accessToken: "fake-access", refreshToken: "fake-refresh" } });
      },
    });
    const response = await h.googleLogin(request());
    assert.ok([401, 403, 502, 503].includes(response.status), failure);
    noSession(response);
    assert.equal(response.cookies.get(cookieName).maxAge, 0);
  }
});

test("challenge errors and backend rate limits are recoverable", async () => {
  for (const status of [429, 503]) {
    const h = handlers({ fetch: async () => Response.json({}, { status }) });
    assert.equal((await h.googleChallenge(request())).status, status);
    const response = await h.googleLogin(request());
    assert.equal(response.status, status);
    noSession(response);
  }
});
