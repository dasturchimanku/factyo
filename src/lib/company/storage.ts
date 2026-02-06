import type { Company } from "./models";

const KEY = "factyo_company_v1";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getCompany(): Company | null {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as Company) : null;
}

export function saveCompany(c: Company) {
  if (!isBrowser()) return;
  localStorage.setItem(KEY, JSON.stringify(c));
}

export function clearCompany() {
  if (!isBrowser()) return;
  localStorage.removeItem(KEY);
}
