import { adminProxy } from "@/lib/admin-api";

export async function GET() {
  return adminProxy("/releases", "Unable to load app release.");
}
