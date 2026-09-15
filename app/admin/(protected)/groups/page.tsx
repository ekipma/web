import { GroupsTable } from "../../_components/admin-dashboard";
import { getAdminGroups, getAdminSession } from "@/lib/admin-api";

export default async function GroupsPage() {
  const session = await getAdminSession();
  if (!session) return null;
  const page = await getAdminGroups(session.token);
  return <GroupsTable groups={page?.groups ?? []} total={page?.total ?? 0} />;
}
