import type { Client } from "@/lib/clients/models";
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

export const clientRepoApi = {
  list: () => http<Client[]>("/v1/clients"),
  get: (id: string) => http<Client | null>(`/v1/clients/${id}`),
  upsert: (payload: any) => http<Client>("/v1/clients", { method: "POST", body: JSON.stringify(payload) }),
  remove: (id: string) => http<void>(`/v1/clients/${id}`, { method: "DELETE" }),
};
