import type { Client } from "@/lib/clients/models";
import { listClients, saveClients } from "@/lib/clients/storage";

function uid() {
  return `cli_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

export const clientRepoLocal = {
  async list(): Promise<Client[]> {
    return listClients().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async get(id: string): Promise<Client | null> {
    return listClients().find((c) => c.id === id) ?? null;
  },

  async upsert(input: Omit<Client, "id" | "createdAt" | "updatedAt"> & { id?: string }): Promise<Client> {
    const now = new Date().toISOString();
    const all = listClients();
    const existing = input.id ? all.find((x) => x.id === input.id) : null;

    const client: Client = existing
      ? { ...existing, ...input, updatedAt: now }
      : {
          id: uid(),
          name: input.name,
          email: input.email,
          address: input.address,
          country: input.country,
          vatId: input.vatId,
          createdAt: now,
          updatedAt: now,
        };

    const next = existing ? all.map((x) => (x.id === client.id ? client : x)) : [client, ...all];
    saveClients(next);
    return client;
  },

  async remove(id: string): Promise<void> {
    const next = listClients().filter((c) => c.id !== id);
    saveClients(next);
  },
};
