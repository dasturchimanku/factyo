import type { Invoice } from "./models";

const KEY = "factyo_invoices_v1";

function isBrowser() {
    return typeof window !== "undefined";
}

const seed: Invoice[] = [
    {
        id: "inv_seed_1",
        number: "#1053",
        clientName: "Acme Corp",
        clientEmail: "billing@acme.com",
        issueDate: "2024-04-15",
        dueDate: "2024-04-25",
        currency: "EUR",
        items: [
            {
                id: "it_seed_1",
                description: "Service Design Work",
                hours: 15,
                rate: 50,
                total: 750,
            },
        ],
        total: 750,
        status: "sent",
        createdAt: new Date().toISOString(),
    },
];

export function initInvoicesOnce() {
    if (!isBrowser()) return;
    const raw = window.localStorage.getItem(KEY);
    if (!raw) window.localStorage.setItem(KEY, JSON.stringify(seed));
}

export function listInvoices(): Invoice[] {
    if (!isBrowser()) return seed;
    initInvoicesOnce();
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Invoice[]) : [];
}

export function getInvoice(id: string): Invoice | null {
    return listInvoices().find((x) => x.id === id) ?? null;
}

export function saveInvoice(invoice: Invoice) {
    if (!isBrowser()) return;
    initInvoicesOnce();
    const all = listInvoices();
    window.localStorage.setItem(KEY, JSON.stringify([invoice, ...all]));
}

export function updateInvoice(id: string, patch: Partial<Invoice>) {
    if (!isBrowser()) return;
    initInvoicesOnce();
    const all = listInvoices();
    const next = all.map((x) => (x.id === id ? { ...x, ...patch } : x));
    window.localStorage.setItem(KEY, JSON.stringify(next));
}
