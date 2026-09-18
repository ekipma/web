import { adminMutation, adminProxy } from "@/lib/admin-api";

export async function GET() {
  return adminProxy("/assets", "Unable to load assets.");
}

export async function POST(request: Request) {
  return adminMutation(request, "/assets", "POST", "Unable to create asset.");
}
