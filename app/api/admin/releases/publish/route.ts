import { adminMutation } from "@/lib/admin-api";

export async function POST(request: Request) {
  return adminMutation(request, "/releases/publish", "POST", "Unable to publish APK.");
}
