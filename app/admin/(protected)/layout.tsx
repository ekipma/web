import { redirect } from "next/navigation";
import { AdminShell } from "../_components/admin-dashboard";
import { getAdminSession } from "@/lib/admin-api";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return <AdminShell currentUser={session.user}>{children}</AdminShell>;
}
