// src/lib/fake/api.ts
import { Invoice } from "./db";
import { getInvoice, listInvoices, saveInvoice } from "./storage";

function sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
}

export const qk = {
    invoices: ["invoices"] as const,
    invoice: (id: string) => ["invoice", id] as const,
};

export async function apiListInvoices(): Promise<Invoice[]> {
    await sleep(200);
    return listInvoices();
}

export async function apiGetInvoice(id: string): Promise<Invoice | null> {
    await sleep(120);
    return getInvoice(id) ?? null;
}

export async function apiCreateInvoice(invoice: Invoice): Promise<Invoice> {
    await sleep(250);
    saveInvoice(invoice);
    return invoice;
}
