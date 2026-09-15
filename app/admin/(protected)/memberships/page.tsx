import { MembershipsPanel } from "../../_components/admin-dashboard";
import { getAdminMemberships, getAdminSession } from "@/lib/admin-api";

export default async function MembershipsPage() {
  const session = await getAdminSession();
  if (!session) return null;
  return <MembershipsPanel initial={await getAdminMemberships(session.token)} />;
}
