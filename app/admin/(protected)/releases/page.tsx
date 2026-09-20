import { ReleasesPanel } from "../../_components/releases-panel";
import { adminFetch, getAdminSession } from "@/lib/admin-api";

export default async function ReleasesPage() {
  const session = await getAdminSession();
  if (!session) return null;
  const response = await adminFetch("/releases", session.token).catch(() => null);
  const initial = response?.ok ? await response.json().catch(() => null) : null;
  return <ReleasesPanel initial={initial} />;
}
