import "server-only";
import { isIP } from "node:net";

export function appleWebConfig() {
  const clientId = process.env.APPLE_OAUTH_WEB_CLIENT_ID?.trim();
  const redirectUri = process.env.APPLE_OAUTH_REDIRECT_URI?.trim();
  if (!clientId || !redirectUri) return null;
  const url = new URL(redirectUri);
  if (
    !/^[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/.test(clientId) ||
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    url.pathname !== "/api/admin/oauth/apple/callback" ||
    !url.hostname.includes(".") ||
    url.hostname.endsWith(".localhost") ||
    isIP(url.hostname) ||
    url.hostname.startsWith("[")
  ) {
    throw new Error("Apple sign-in requires a Services ID and an HTTPS domain callback at /api/admin/oauth/apple/callback");
  }
  return { clientId, redirectUri, origin: url.origin };
}
