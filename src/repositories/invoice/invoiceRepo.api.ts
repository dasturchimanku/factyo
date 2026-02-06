import type { Invoice } from "@/lib/invoices/models";
import { env } from "@/core/env";

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${env.API_BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    cache: "no-store",
    credentials: "include",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as T;
}

export const invoiceRepoApi = {
  list: () => http<Invoice[]>("/v1/invoices"),
  get: (id: string) => http<Invoice | null>(`/v1/invoices/${id}`),
  create: (invoice: Invoice) =>
    http<Invoice>("/v1/invoices", { method: "POST", body: JSON.stringify(invoice) }),
  markSent: (id: string) =>
    http<void>(`/v1/invoices/${id}/send`, { method: "POST" }),
};
