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
    issueDate: string;
    dueDate: string;
    currency: "EUR";
    items: InvoiceItem[];
    total: number;
    status: InvoiceStatus;
    createdAt: string;
};
