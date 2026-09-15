import { SystemPanel } from "../../_components/admin-dashboard";
import { getAdminSession, getAdminSystem } from "@/lib/admin-api";

export default async function SystemPage() {
  const session = await getAdminSession();
  if (!session) return null;
  return <SystemPanel initial={await getAdminSystem(session.token)} />;
}
