import "server-only";

// This is a public identifier, never the Google client secret.
export function googleWebClientId(): string {
  const value = process.env.GOOGLE_OAUTH_WEB_CLIENT_ID?.trim() ?? "";
  if (value && !/^[A-Za-z0-9_-]+\.apps\.googleusercontent\.com$/.test(value)) {
    throw new Error("GOOGLE_OAUTH_WEB_CLIENT_ID must be a Google Web OAuth client ID");
  }
  return value;
}
