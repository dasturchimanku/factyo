// src/lib/fake/db.ts
export type InvoiceStatus = "draft" | "sent" | "paid";

export type InvoiceItem = {
    id: string;
    description: string;
    hours: number;
    rate: number;
    total: number;
};

export type Invoice = {
    id: string;
    number: string;
    clientName: string;
    clientEmail: string;
    issueDate: string; // YYYY-MM-DD
    dueDate: string; // YYYY-MM-DD
    currency: "EUR";
    items: InvoiceItem[];
    total: number;
    status: InvoiceStatus;
    createdAt: string;
};

export const seedInvoices: Invoice[] = [
    {
        id: "inv_1053",
        number: "#1053",
        clientName: "Acme Corp",
        clientEmail: "billing@acme.com",
        issueDate: "2024-04-15",
        dueDate: "2024-04-25",
        currency: "EUR",
        items: [
            {
                id: "it_1",
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
