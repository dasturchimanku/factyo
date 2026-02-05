// src/lib/fake/storage.ts
import { Invoice, seedInvoices } from "./db";

const KEY = "factyo_invoices_v1";

function isBrowser() {
    return typeof window !== "undefined";
}

export function initStorageOnce() {
    if (!isBrowser()) return;
    const existing = window.localStorage.getItem(KEY);
    if (!existing) {
        window.localStorage.setItem(KEY, JSON.stringify(seedInvoices));
    }
}

export function listInvoices(): Invoice[] {
    if (!isBrowser()) return seedInvoices;
    initStorageOnce();
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Invoice[]) : [];
}

export function getInvoice(id: string): Invoice | undefined {
    return listInvoices().find((x) => x.id === id);
}

export function saveInvoice(invoice: Invoice): void {
    if (!isBrowser()) return;
    initStorageOnce();
    const all = listInvoices();
    const next = [invoice, ...all];
    window.localStorage.setItem(KEY, JSON.stringify(next));
}
