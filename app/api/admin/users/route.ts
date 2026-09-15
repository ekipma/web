import { adminProxy } from "@/lib/admin-api";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams;
  const suffix = `/users?${query.toString() || "limit=50"}`;
  return adminProxy(suffix, "Unable to load users.");
}
