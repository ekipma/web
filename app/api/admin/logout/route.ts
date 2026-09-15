import { NextResponse } from "next/server";
import { clearAdminAuthCookies } from "@/lib/admin-api";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  clearAdminAuthCookies(response);
  return response;
}
