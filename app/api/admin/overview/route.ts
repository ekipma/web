import { NextResponse } from "next/server";
import { adminProxy } from "@/lib/admin-api";

export async function GET(request: Request) {
  const days = new URL(request.url).searchParams.get("days") ?? "30";
  if (!["7", "30", "90"].includes(days)) return NextResponse.json({ error: "Invalid period" }, { status: 422 });
  return adminProxy(`/overview?days=${days}`, "Unable to load overview.");
}
