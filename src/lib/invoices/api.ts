import type { Invoice } from "./models";
import {
    getInvoice,
    listInvoices,
    saveInvoice,
    updateInvoice,
} from "./storage";

function sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
}

export const qk = {
    invoices: ["invoices"] as const,
    invoice: (id: string) => ["invoice", id] as const,
};

export async function apiListInvoices(): Promise<Invoice[]> {
    await sleep(150);
    return listInvoices();
}

export async function apiGetInvoice(id: string): Promise<Invoice | null> {
    await sleep(120);
    return getInvoice(id);
}

export async function apiCreateInvoice(inv: Invoice): Promise<Invoice> {
    await sleep(200);
    saveInvoice(inv);
    return inv;
}

export async function apiMarkSent(id: string): Promise<void> {
    await sleep(150);
    updateInvoice(id, { status: "sent" });
}
