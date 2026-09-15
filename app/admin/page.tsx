import { AdminDashboard } from "./_components/admin-dashboard";
import { AdminLogin } from "./_components/admin-login";
import { getAdminActivity, getAdminGroups, getAdminMemberships, getAdminOverview, getAdminSession, getAdminSystem, getAdminUsers } from "@/lib/admin-api";

export default async function AdminPage() {
  const session = await getAdminSession();
  if (!session) return <AdminLogin />;
  const [users, groups, overview, activity, memberships, system] = await Promise.all([getAdminUsers(session.token), getAdminGroups(session.token), getAdminOverview(session.token), getAdminActivity(session.token), getAdminMemberships(session.token), getAdminSystem(session.token)]);
  return <AdminDashboard currentUser={session.user} initialUsers={users?.users ?? []} totalUsers={users?.total ?? 0} initialGroups={groups?.groups ?? []} totalGroups={groups?.total ?? 0} newGroupsLast30Days={groups?.newLast30Days ?? 0} initialOverview={overview} initialActivity={activity} initialMemberships={memberships} initialSystem={system} />;
}
