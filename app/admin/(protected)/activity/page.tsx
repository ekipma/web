import { ActivityPanel } from "../../_components/admin-dashboard";
import { getAdminActivity, getAdminSession } from "@/lib/admin-api";

export default async function ActivityPage() {
  const session = await getAdminSession();
  if (!session) return null;
  return <ActivityPanel initial={await getAdminActivity(session.token)} />;
}
