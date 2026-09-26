import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import ts from "typescript";

const runtimeRequire = createRequire(import.meta.url);
const { NextRequest } = runtimeRequire("next/server");

const clientId = "ir.ekipma.admin";
const nonce = "a".repeat(43);
const cookieName = "__Host-ekipma_admin_apple";
const token = (claims = {}) => `header.${Buffer.from(JSON.stringify({ nonce, aud: clientId, ...claims })).toString("base64url")}.signature`;

// Execute the actual TypeScript handlers and cookie helper with NextResponse.
// Only server-only and the upstream HTTP boundary are replaced for Node tests.
function handlers({ fetch: upstream, configured = clientId, redirectUri = "https://ekipma.ir/api/admin/oauth/apple/callback" } = {}) {
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
    vm.runInNewContext(source, { exports, require: localRequire, Buffer, AbortSignal, URL, URLSearchParams, fetch: fakeFetch, process: { env: { NODE_ENV: "production", EKIPMA_API_URL: "https://api.example", APPLE_OAUTH_WEB_CLIENT_ID: configured, APPLE_OAUTH_REDIRECT_URI: redirectUri } } }, { filename: file });
    return exports;
  }
  return { ...load("lib/admin-apple-auth.ts"), calls };
}

const state = "s".repeat(43);
function request({ body, cookie = `${state}.${nonce}`, origin = "https://ekipma.ir", type = "application/x-www-form-urlencoded" } = {}) {
  return new NextRequest("https://ekipma.ir/api/admin/oauth/apple/callback", {
    method: "POST",
    headers: { origin, "content-type": type, cookie: cookie ? `${cookieName}=${cookie}` : "" },
    body: body ?? new URLSearchParams({ state, id_token: token() }).toString(),
  });
}
function noSession(response) {
  assert.equal(response.cookies.has("ekipma_admin_access"), false);
  assert.equal(response.cookies.has("ekipma_admin_refresh"), false);
}
function errorCode(response) {
  assert.equal(response.status, 303);
  const url = new URL(response.headers.get("location"));
  assert.equal(url.origin, "https://ekipma.ir");
  assert.equal(url.pathname, "/admin/login");
  assert.equal(response.cookies.get(cookieName).maxAge, 0);
  noSession(response);
  return url.searchParams.get("appleError");
}

test("start generates independent state and nonce binding for Apple's form POST", async () => {
  const h = handlers();
  const response = await h.appleStart(request());
  assert.equal(response.status, 200);
  const url = new URL((await response.json()).authorizationUrl);
  assert.equal(url.origin, "https://appleid.apple.com");
  assert.equal(url.pathname, "/auth/authorize");
  assert.equal(url.searchParams.get("client_id"), clientId);
  assert.equal(url.searchParams.get("redirect_uri"), "https://ekipma.ir/api/admin/oauth/apple/callback");
  assert.equal(url.searchParams.get("response_type"), "code id_token");
  assert.equal(url.searchParams.get("response_mode"), "form_post");
  assert.equal(url.searchParams.get("nonce"), nonce);
  assert.match(url.searchParams.get("state"), /^[A-Za-z0-9_-]{43}$/);
  assert.notEqual(url.searchParams.get("state"), nonce);
  const cookie = response.cookies.get(cookieName);
  assert.equal(cookie.value, `${url.searchParams.get("state")}.${nonce}`);
  assert.equal(cookie.secure, true);
  assert.equal(cookie.httpOnly, true);
  assert.equal(cookie.sameSite, "none");
  assert.equal(cookie.path, "/");
  assert.equal(cookie.domain, undefined);
  assert.equal(cookie.maxAge, 300);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(h.calls[0].url, "https://api.example/api/v1/auth/oauth/apple/challenge");
});

test("start rejects unconfigured and cross-origin requests without backend calls", async () => {
  for (const options of [{ configured: "" }, { redirectUri: "" }, {}]) {
    const h = handlers(options);
    const response = await h.appleStart(request({ origin: "https://attacker.example" }));
    assert.equal(response.status, Object.keys(options).length ? 503 : 403);
    assert.equal(h.calls.length, 0);
    noSession(response);
  }
});

test("configuration rejects unsafe callback URLs", async () => {
  for (const redirectUri of [
    "http://ekipma.ir/api/admin/oauth/apple/callback",
    "https://127.0.0.1/api/admin/oauth/apple/callback",
    "https://localhost/api/admin/oauth/apple/callback",
    "https://ekipma.ir/wrong",
    "https://ekipma.ir/api/admin/oauth/apple/callback?next=evil",
    "https://user@ekipma.ir/api/admin/oauth/apple/callback",
  ]) {
    const h = handlers({ redirectUri });
    await assert.rejects(() => h.appleStart(request()));
    assert.equal(h.calls.length, 0);
  }
});

test("callback verifies admin before cookies and redirects with no credentials", async () => {
  const h = handlers();
  const body = new URLSearchParams({ state, id_token: token(), code: "unused-secret-code", user: JSON.stringify({ name: { firstName: " Ada ", lastName: "Lovelace" }, email: "untrusted@example.com" }) });
  const response = await h.appleCallback(request({ body: body.toString(), origin: "https://appleid.apple.com" }));
  assert.equal(response.status, 303);
  assert.equal(response.headers.get("location"), "https://ekipma.ir/admin");
  assert.deepEqual(JSON.parse(h.calls[0].options.body), { idToken: token(), name: "Ada Lovelace" });
  assert.equal(h.calls[0].url, "https://api.example/api/v1/auth/oauth/apple");
  assert.equal(h.calls[1].url, "https://api.example/api/v1/admin/me");
  assert.equal(h.calls[1].options.headers.Authorization, "Bearer fake-access");
  assert.equal(response.cookies.get(cookieName).maxAge, 0);
  for (const name of ["ekipma_admin_access", "ekipma_admin_refresh"]) {
    assert.equal(response.cookies.get(name).httpOnly, true);
    assert.equal(response.cookies.get(name).secure, true);
  }
});

test("callback rejects missing bindings, state swaps, nonce swaps and wrong audiences", async () => {
  const forms = [
    { state: "wrong", id_token: token() },
    { state, id_token: token({ nonce: "wrong" }) },
    { state, id_token: token({ aud: "other-client" }) },
    { state, id_token: "malformed" },
  ];
  const inputs = [{ cookie: "" }, { cookie: "wrong" }, ...forms.map((form) => ({ body: new URLSearchParams(form).toString() })), { body: `state=${state}&state=${state}&id_token=${token()}` }, { type: "text/plain" }, { body: "x".repeat(32769) }];
  for (const input of inputs) {
    const h = handlers();
    assert.ok(["invalid", "expired"].includes(errorCode(await h.appleCallback(request(input)))));
    assert.equal(h.calls.length, 0);
  }
});

test("cancellation requires valid state and does not create an account", async () => {
  for (const error of ["access_denied", "user_cancelled_authorize", "provider_failure"]) {
    const h = handlers();
    const body = new URLSearchParams({ state, error }).toString();
    assert.equal(errorCode(await h.appleCallback(request({ body }))), error === "provider_failure" ? "invalid" : null);
    assert.equal(errorCode(await h.appleCallback(request({ body, cookie: "" }))), "expired");
    assert.equal(h.calls.length, 0);
  }
});

test("optional malformed or oversized UTF-8 names do not block sign-in", async () => {
  for (const user of ["{", JSON.stringify({ name: { firstName: "ع".repeat(101) } })]) {
    const h = handlers();
    const response = await h.appleCallback(request({ body: new URLSearchParams({ state, id_token: token(), user }).toString() }));
    assert.equal(response.headers.get("location"), "https://ekipma.ir/admin");
    assert.deepEqual(JSON.parse(h.calls[0].options.body), { idToken: token() });
  }
});

test("provider verification and admin failures never grant sessions", async () => {
  for (const failure of ["invalid", "rate", "network", "bad-response", "denied", "admin-network"]) {
    const h = handlers({
      fetch: async (url) => {
        if (failure === "network" || (url.endsWith("/admin/me") && failure === "admin-network")) throw new Error("offline");
        if (failure === "invalid" || failure === "rate") return Response.json({}, { status: failure === "invalid" ? 401 : 429 });
        if (failure === "bad-response") return Response.json({ auth: { accessToken: 123 } });
        if (url.endsWith("/admin/me")) return Response.json({}, { status: 403 });
        return Response.json({ auth: { accessToken: "fake-access", refreshToken: "fake-refresh" } });
      },
    });
    const expected = ["invalid", "rate", "denied"].includes(failure) ? failure : "unavailable";
    assert.equal(errorCode(await h.appleCallback(request())), expected);
  }
});

test("challenge rate limits and service failures return recoverable errors", async () => {
  for (const status of [429, 503]) {
    const h = handlers({ fetch: async () => Response.json({}, { status }) });
    const response = await h.appleStart(request());
    assert.equal(response.status, status);
    assert.equal(response.cookies.has(cookieName), false);
  }
});
