import { AdminLogin } from "../_components/admin-login";

import { googleWebClientId } from "@/lib/google-auth-config";
import { appleWebConfig } from "@/lib/apple-auth-config";

export const dynamic = "force-dynamic";

const appleErrors: Record<string, string> = {
  invalid: "Apple sign-in could not be verified. Please try again.",
  expired: "This Apple sign-in attempt expired or belongs to another browser. Please try again.",
  rate: "Too many sign-in attempts. Please try again later.",
  unavailable: "The sign-in service is temporarily unavailable. Please try again.",
  denied: "This Apple account is not an Ekipma administrator. Ask an existing admin to grant it access.",
};

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ appleError?: string | string[] }> }) {
  const { appleError } = await searchParams;
  const initialError = typeof appleError === "string" && Object.hasOwn(appleErrors, appleError) ? appleErrors[appleError] : "";
  return <AdminLogin key={initialError} googleClientId={googleWebClientId()} appleEnabled={Boolean(appleWebConfig())} initialError={initialError} />;
}
