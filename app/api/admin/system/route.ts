import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminFetch } from "@/lib/admin-api";

export async function GET() {
  const token = (await cookies()).get("ekipma_admin_access")?.value;
  if (!token) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  const response = await adminFetch("/system", token);
  const data = await response.json().catch(() => ({ error: "Unable to load system health." }));
  return NextResponse.json(data, { status: response.status });
}
