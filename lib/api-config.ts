const configuredApiUrl = process.env.EKIPMA_API_URL;

if (!configuredApiUrl) {
  throw new Error("EKIPMA_API_URL is required");
}

export const apiBaseUrl = configuredApiUrl;
