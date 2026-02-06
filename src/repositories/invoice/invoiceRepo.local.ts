import type { Invoice } from "@/lib/invoices/models";
import { apiCreateInvoice, apiGetInvoice, apiListInvoices, apiMarkSent } from "@/lib/invoices/api";

export const invoiceRepoLocal = {
  list: apiListInvoices,
  get: apiGetInvoice,
  create: apiCreateInvoice,
  markSent: apiMarkSent,
};
