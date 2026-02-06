export const env = {
  DATA_MODE: process.env.NEXT_PUBLIC_DATA_MODE ?? "local", // "local" | "api"
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000",
};
