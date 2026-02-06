 import type { UserProfile } from "@/lib/auth/models";
import { env } from "@/core/env";

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${env.API_BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    cache: "no-store",
    credentials: "include",
  });

  if (!res.ok) {
    // backend hali yo'q — debug uchun
    throw new Error(`API not available (${res.status}) at ${path}`);
  }

  return (await res.json()) as T;
}

/**
 * API mode uchun placeholder.
 * Backend qo'shilganda shu methodlar real endpointlarga ulanadi.
 */
export const profileRepoApi = {
  async get(): Promise<UserProfile | null> {
    return http<UserProfile | null>("/v1/me");
  },

  async create(params: { email: string; name: string }): Promise<UserProfile> {
    return http<UserProfile>("/v1/profile", {
      method: "POST",
      body: JSON.stringify(params),
    });
  },

  async update(patch: Partial<UserProfile>): Promise<UserProfile | null> {
    return http<UserProfile | null>("/v1/profile", {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
  },

  async clear(): Promise<void> {
    // API mode'da logout backendga bog'liq bo'ladi, hozircha no-op
    return;
  },
};
