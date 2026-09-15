import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminFetch } from "@/lib/admin-api";

export async function GET(request: Request) {
  const token = (await cookies()).get("ekipma_admin_access")?.value;
  if (!token) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  const days = new URL(request.url).searchParams.get("days") ?? "30";
  if (!["7", "30", "90"].includes(days)) return NextResponse.json({ error: "Invalid period" }, { status: 422 });
  const response = await adminFetch(`/overview?days=${days}`, token);
  const data = await response.json().catch(() => ({ error: "Unable to load overview." }));
  return NextResponse.json(data, { status: response.status });
}
