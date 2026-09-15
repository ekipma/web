import { AdminDashboard } from "./_components/admin-dashboard";
import { AdminLogin } from "./_components/admin-login";
import { getAdminSession, getAdminSystem, getAdminUsers } from "@/lib/admin-api";

export default async function AdminPage() {
  const session = await getAdminSession();
  if (!session) return <AdminLogin />;
  const [page, system] = await Promise.all([getAdminUsers(session.token), getAdminSystem(session.token)]);
  return <AdminDashboard currentUser={session.user} initialUsers={page?.users ?? []} totalUsers={page?.total ?? 0} initialSystem={system} />;
}
