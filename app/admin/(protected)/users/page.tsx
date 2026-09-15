import { UsersPanel } from "../../_components/admin-dashboard";
import { getAdminSession, getAdminUsers } from "@/lib/admin-api";

export default async function UsersPage() {
  const session = await getAdminSession();
  if (!session) return null;
  const page = await getAdminUsers(session.token);
  return <UsersPanel users={page?.users ?? []} total={page?.total ?? 0} />;
}
