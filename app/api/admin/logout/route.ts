import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set("ekipma_admin_access", "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 });
  return response;
}
