import { adminMutation } from "@/lib/admin-api";
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return adminMutation(request, `/users/${id}/tokens`, "POST", "Unable to add tokens.");
}
