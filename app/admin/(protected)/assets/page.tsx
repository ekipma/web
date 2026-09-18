import { getAdminAssets, getAdminSession } from "@/lib/admin-api";
import { AssetsPanel } from "../../_components/assets-panel";

export default async function AssetsPage() {
  const session = await getAdminSession();
  if (!session) return null;
  const assets = await getAdminAssets(session.token);
  return <AssetsPanel initial={assets} />;
}
