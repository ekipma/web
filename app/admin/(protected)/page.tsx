import { OverviewPanel } from "../_components/admin-dashboard";
import { getAdminGroups, getAdminOverview, getAdminSession, getAdminSystem, getAdminUsers } from "@/lib/admin-api";

export default async function OverviewPage() {
  const session = await getAdminSession();
  if (!session) return null;
  const [users, groups, overview, system] = await Promise.all([
    getAdminUsers(session.token),
    getAdminGroups(session.token),
    getAdminOverview(session.token),
    getAdminSystem(session.token),
  ]);

  return <OverviewPanel overview={overview} adminName={session.user.name} users={users?.users ?? []} total={users?.total ?? 0} groups={groups?.groups ?? []} newGroups={groups?.newLast30Days ?? 0} system={system} />;
}
