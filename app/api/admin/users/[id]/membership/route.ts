import { adminMutation } from "@/lib/admin-api";
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return adminMutation(request, `/users/${id}/membership`, "PATCH", "Unable to update membership.");
}
