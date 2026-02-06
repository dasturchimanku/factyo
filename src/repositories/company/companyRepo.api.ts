import type { Company } from "@/lib/company/models";
import { env } from "@/core/env";

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${env.API_BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    cache: "no-store",
    credentials: "include",
  });
  if (!res.ok) throw new Error(`API not available (${res.status}) at ${path}`);
  return (await res.json()) as T;
}

export const companyRepoApi = {
  get: () => http<Company | null>("/v1/company"),
  upsert: (company: Company) =>
    http<Company>("/v1/company", { method: "PUT", body: JSON.stringify(company) }),
  clear: async () => {},
};
