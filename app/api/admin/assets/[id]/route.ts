import { adminMutation } from "@/lib/admin-api";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return adminMutation(request, `/assets/${encodeURIComponent(id)}`, "PATCH", "Unable to update asset.");
}
