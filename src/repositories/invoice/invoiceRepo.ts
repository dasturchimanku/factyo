import type { Invoice } from "@/lib/invoices/models";
import { env } from "@/core/env";
import { invoiceRepoLocal } from "./invoiceRepo.local";
import { invoiceRepoApi } from "./invoiceRepo.api";

export type InvoiceRepo = {
  list(): Promise<Invoice[]>;
  get(id: string): Promise<Invoice | null>;
  create(invoice: Invoice): Promise<Invoice>;
  markSent(id: string): Promise<void>;
};

export const invoiceRepo: InvoiceRepo =
  env.DATA_MODE === "api" ? invoiceRepoApi : invoiceRepoLocal;
