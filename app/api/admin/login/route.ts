import { NextResponse } from "next/server";
import { adminFetch, setAdminAuthCookies } from "@/lib/admin-api";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { mobile?: string; password?: string } | null;
  if (!body?.mobile || !body.password) return NextResponse.json({ error: "Enter your mobile and password." }, { status: 422 });
  const login = await fetch(`${process.env.EKIPMA_API_URL ?? "http://127.0.0.1:8086"}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Version": "v0.8.1" },
    body: JSON.stringify({ mobile: body.mobile, password: body.password }),
    cache: "no-store",
  }).catch(() => null);
  if (!login?.ok) return NextResponse.json({ error: "We couldn’t sign you in with those details." }, { status: login?.status ?? 503 });
  const data = await login.json() as { auth: { accessToken: string; refreshToken: string } };
  const admin = await adminFetch("/me", data.auth.accessToken);
  if (!admin.ok) return NextResponse.json({ error: "This account is not an Ekipma administrator." }, { status: 403 });
  const response = NextResponse.json({ user: await admin.json() });
  setAdminAuthCookies(response, data.auth);
  return response;
}
