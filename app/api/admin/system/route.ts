import { adminProxy } from "@/lib/admin-api";

export async function GET() {
  return adminProxy("/system", "Unable to load system health.");
}
