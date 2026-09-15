import { adminProxy } from "@/lib/admin-api";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams;
  return adminProxy(`/activity?${query.toString() || "limit=50"}`, "Unable to load activity.");
}
