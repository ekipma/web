import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { adminFetch, setAdminAuthCookies } from "@/lib/admin-api";
import { apiBaseUrl } from "@/lib/api-config";
import { googleWebClientId } from "@/lib/google-auth-config";

const nonceCookie = "ekipma_admin_google_nonce";
const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" as const, path: "/api/admin/oauth/google" };

function reply(body: object, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function checkRequest(request: NextRequest) {
  if (request.headers.get("origin") !== new URL(request.url).origin) return reply({ error: "Invalid request origin." }, 403);
  if (!googleWebClientId()) return reply({ error: "Google sign-in is not configured." }, 503);
  return null;
}

export async function googleChallenge(request: NextRequest) {
  const rejected = checkRequest(request);
  if (rejected) return rejected;
  const upstream = await fetch(`${apiBaseUrl}/api/v1/auth/oauth/google/challenge`, {
    method: "POST",
    headers: { "X-Version": "v0.8.1" },
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  }).catch(() => null);
  const data = await upstream?.json().catch(() => null);
  if (!upstream?.ok || typeof data?.nonce !== "string" || !/^[A-Za-z0-9_-]{43}$/.test(data.nonce)) {
    return reply({ error: upstream?.status === 429 ? "Too many sign-in attempts. Wait a moment and try again." : "Google sign-in is temporarily unavailable. You can still use your mobile and password." }, upstream?.status === 429 ? 429 : 503);
  }
  const response = reply({ nonce: data.nonce, expiresIn: 300 });
  response.cookies.set(nonceCookie, data.nonce, { ...cookieOptions, maxAge: 300 });
  return response;
}

export async function googleLogin(request: NextRequest) {
  const rejected = checkRequest(request);
  if (rejected) return rejected;
  if (request.headers.get("content-type")?.split(";")[0] !== "application/json") return reply({ error: "Expected JSON." }, 415);

  // Consume the browser binding on every submitted attempt, including failures.
  const finish = (body: object, status: number) => {
    const response = reply(body, status);
    response.cookies.set(nonceCookie, "", { ...cookieOptions, maxAge: 0 });
    return response;
  };
  const raw = await request.text();
  if (raw.length > 16_384) return finish({ error: "Sign-in request is too large." }, 413);
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return finish({ error: "Invalid sign-in request." }, 400);
  }
  if (!body || typeof body !== "object" || !("idToken" in body) || typeof body.idToken !== "string" || !body.idToken || body.idToken.length > 12_000) return finish({ error: "Missing or invalid Google credential." }, 422);

  const nonce = request.cookies.get(nonceCookie)?.value;
  try {
    const parts = body.idToken.split(".");
    if (parts.length !== 3) throw new Error("Malformed token");
    const claims = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
    // Decoding only binds this attempt to this browser and Web client. The Go
    // server MUST still verify the signature, issuer, expiry and single-use nonce.
    if (!nonce || claims.nonce !== nonce || claims.aud !== googleWebClientId()) return finish({ error: "This sign-in attempt expired or belongs to another browser. Try again." }, 401);
  } catch {
    return finish({ error: "Invalid Google credential." }, 401);
  }

  const upstream = await fetch(`${apiBaseUrl}/api/v1/auth/oauth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Version": "v0.8.1" },
    body: JSON.stringify({ idToken: body.idToken }),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  }).catch(() => null);
  if (!upstream?.ok) {
    const status = upstream?.status === 429 ? 429 : upstream?.status === 401 ? 401 : 503;
    return finish({ error: status === 429 ? "Too many sign-in attempts. Wait a moment and try again." : status === 401 ? "Google sign-in expired or could not be verified. Try again." : "The sign-in service is temporarily unavailable." }, status);
  }
  const data = await upstream.json().catch(() => null);
  if (typeof data?.auth?.accessToken !== "string" || !data.auth.accessToken || typeof data?.auth?.refreshToken !== "string" || !data.auth.refreshToken) return finish({ error: "The sign-in service returned an invalid response." }, 502);
  const admin = await adminFetch("/me", data.auth.accessToken, AbortSignal.timeout(10_000)).catch(() => null);
  if (!admin?.ok) return finish({ error: admin?.status === 403 ? "This Google account is not an Ekipma administrator. Ask an existing admin to grant it access." : "Unable to verify administrator access. Please try again." }, admin?.status === 403 ? 403 : 503);
  const response = finish({ ok: true }, 200);
  setAdminAuthCookies(response, data.auth);
  return response;
}
