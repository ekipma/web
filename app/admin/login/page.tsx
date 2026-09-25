import { AdminLogin } from "../_components/admin-login";

import { googleWebClientId } from "@/lib/google-auth-config";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return <AdminLogin googleClientId={googleWebClientId()} />;
}
