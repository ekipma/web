import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminFetch } from "@/lib/admin-api";

export async function GET(request: Request) {
  const token = (await cookies()).get("ekipma_admin_access")?.value;
  if (!token) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  const query = new URL(request.url).searchParams;
  const response = await adminFetch(`/memberships?${query.toString() || "limit=50"}`, token);
  const data = await response.json().catch(() => ({ error: "Unable to load memberships." }));
  return NextResponse.json(data, { status: response.status });
}
