import { adminMutation } from "@/lib/admin-api";

export async function POST(request: Request) {
  return adminMutation(request, "/releases/uploads", "POST", "Unable to start APK upload.");
}
