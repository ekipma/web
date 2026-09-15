import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { clearAdminAuthCookies, refreshAdminAuth, setAdminAuthCookies } from "@/lib/admin-api";

export async function GET(request: Request) {
  const next = new URL(request.url).searchParams.get("next");
  const destination = next?.startsWith("/admin") && !next.startsWith("/admin/login") ? next : "/admin";
  const refreshToken = (await cookies()).get("ekipma_admin_refresh")?.value;
  const auth = refreshToken ? await refreshAdminAuth(refreshToken) : null;
  if (auth) {
    const response = NextResponse.redirect(new URL(destination, request.url));
    setAdminAuthCookies(response, auth);
    return response;
  }
  const response = NextResponse.redirect(new URL("/admin/login", request.url));
  clearAdminAuthCookies(response);
  return response;
}
