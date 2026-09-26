import "server-only";
import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { appleWebConfig } from "@/lib/apple-auth-config";
import { apiBaseUrl } from "@/lib/api-config";
import { adminFetch, setAdminAuthCookies } from "@/lib/admin-api";

const bindingCookie = "__Host-ekipma_admin_apple";
// Apple's cross-site form POST must carry the browser binding. __Host- prevents
// sibling domains from planting this cookie; HTTPS is required even in development.
const cookieOptions = { httpOnly: true, secure: true, sameSite: "none" as const, path: "/" };
const noncePattern = /^[A-Za-z0-9_-]{43}$/;
function reply(error: string, status: number) {
  return NextResponse.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
}

export async function appleStart(request: NextRequest) {
  const config = appleWebConfig();
  if (!config) return reply("Apple sign-in is not configured.", 503);
  if (request.headers.get("origin") !== config.origin) return reply("Invalid request origin.", 403);
  const upstream = await fetch(`${apiBaseUrl}/api/v1/auth/oauth/apple/challenge`, { method: "POST", headers: { "X-Version": "v0.8.1" }, cache: "no-store", signal: AbortSignal.timeout(10_000) }).catch(() => null);
  const data = await upstream?.json().catch(() => null);
  if (!upstream?.ok || typeof data?.nonce !== "string" || !noncePattern.test(data.nonce)) return reply(upstream?.status === 429 ? "Too many sign-in attempts. Please try again later." : "Apple sign-in is temporarily unavailable.", upstream?.status === 429 ? 429 : 503);
  const state = randomBytes(32).toString("base64url");
  const url = new URL("https://appleid.apple.com/auth/authorize");
  url.search = new URLSearchParams({ client_id: config.clientId, redirect_uri: config.redirectUri, response_type: "code id_token", response_mode: "form_post", scope: "name email", state, nonce: data.nonce }).toString();
  const response = NextResponse.json({ authorizationUrl: url.toString() }, { headers: { "Cache-Control": "no-store" } });
  response.cookies.set(bindingCookie, `${state}.${data.nonce}`, { ...cookieOptions, maxAge: 300 });
  return response;
}

export async function appleCallback(request: NextRequest) {
  const config = appleWebConfig();
  if (!config) return reply("Apple sign-in is not configured.", 503);
  const finish = (error?: string, success = false) => {
    const url = new URL(success ? "/admin" : "/admin/login", config.origin);
    if (error) url.searchParams.set("appleError", error);
    // 303 prevents the browser from reposting Apple's credential to the login page.
    const response = NextResponse.redirect(url, 303);
    response.headers.set("Cache-Control", "no-store");
    response.headers.set("Referrer-Policy", "no-referrer");
    response.cookies.set(bindingCookie, "", { ...cookieOptions, maxAge: 0 });
    return response;
  };
  if (request.headers.get("content-type")?.split(";")[0] !== "application/x-www-form-urlencoded") return finish("invalid");
  // Bound the streamed body, including requests without Content-Length.
  const reader = request.body?.getReader();
  if (!reader) return finish("invalid");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 32_768) {
        await reader.cancel();
        return finish("invalid");
      }
      chunks.push(value);
    }
  } catch {
    return finish("invalid");
  } finally {
    reader.releaseLock();
  }
  const form = new URLSearchParams(Buffer.concat(chunks).toString("utf8"));
  if (["state", "id_token", "user", "error"].some((key) => form.getAll(key).length > 1)) return finish("invalid");
  const binding = request.cookies.get(bindingCookie)?.value.split(".");
  if (!binding || binding.length !== 2 || !binding.every((value) => noncePattern.test(value)) || form.get("state") !== binding[0]) return finish("expired");
  const providerError = form.get("error");
  if (providerError) return finish(["access_denied", "user_cancelled_authorize"].includes(providerError) ? undefined : "invalid");
  const idToken = form.get("id_token");
  if (!idToken || idToken.length > 12_000) return finish("invalid");
  try {
    const parts = idToken.split(".");
    if (parts.length !== 3) return finish("invalid");
    const claims = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
    // Only browser/audience binding here. The Go server verifies the signature,
    // issuer, expiry and single-use nonce before returning an Ekipma session.
    if (claims.nonce !== binding[1] || claims.aud !== config.clientId) return finish("expired");
  } catch {
    return finish("invalid");
  }
  let name: string | undefined;
  try {
    const user = JSON.parse(form.get("user") || "null");
    const fullName = [user?.name?.firstName, user?.name?.lastName]
      .filter((part): part is string => typeof part === "string")
      .map((part) => part.trim())
      .filter(Boolean)
      .join(" ");
    // This unsigned display name is optional. Never forward the unsigned email.
    if (fullName && Buffer.byteLength(fullName, "utf8") <= 200) name = fullName;
  } catch {
    /* Optional profile data must not prevent authentication. */
  }
  const upstream = await fetch(`${apiBaseUrl}/api/v1/auth/oauth/apple`, { method: "POST", headers: { "Content-Type": "application/json", "X-Version": "v0.8.1" }, body: JSON.stringify({ idToken, ...(name ? { name } : {}) }), cache: "no-store", signal: AbortSignal.timeout(10_000) }).catch(() => null);
  if (!upstream?.ok) return finish(upstream?.status === 401 ? "invalid" : upstream?.status === 429 ? "rate" : "unavailable");
  const data = await upstream.json().catch(() => null);
  if (typeof data?.auth?.accessToken !== "string" || !data.auth.accessToken || typeof data?.auth?.refreshToken !== "string" || !data.auth.refreshToken) return finish("unavailable");
  const admin = await adminFetch("/me", data.auth.accessToken, AbortSignal.timeout(10_000)).catch(() => null);
  if (!admin?.ok) return finish(admin?.status === 403 ? "denied" : "unavailable");
  const response = finish(undefined, true);
  setAdminAuthCookies(response, data.auth);
  return response;
}
