const isProduction = process.env.NODE_ENV === "production";
const configuredApiUrl = process.env.EKIPMA_API_URL;

if (isProduction && !configuredApiUrl) {
  throw new Error("EKIPMA_API_URL is required in production");
}

export const apiBaseUrl = isProduction
  ? configuredApiUrl!
  : "http://127.0.0.1:8086";
