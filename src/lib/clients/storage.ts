import type { Client } from "./models";

const KEY = "factyo_clients_v1";

function isBrowser() {
  return typeof window !== "undefined";
}

export function listClients(): Client[] {
  if (!isBrowser()) return [];
  const raw = localStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as Client[]) : [];
}

export function saveClients(items: Client[]) {
  if (!isBrowser()) return;
  localStorage.setItem(KEY, JSON.stringify(items));
}
