"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Invoice } from "@/lib/invoices/models";
import { apiMarkSent, qk } from "@/lib/invoices/api";
import { motion } from "framer-motion";
import { StatusPill } from "./StatusPill";

export function InvoicePreview({ invoice }: { invoice: Invoice }) {
    const qc = useQueryClient();

    const sendMut = useMutation({
        mutationFn: () => apiMarkSent(invoice.id),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: qk.invoice(invoice.id) });
            await qc.invalidateQueries({ queryKey: qk.invoices });
        },
    });

    return (
        <div className="grid gap-4 md:grid-cols-[1fr_340px]">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-sm font-semibold">
                            Invoice {invoice.number}
                        </p>
                        <p className="mt-1 text-xs text-neutral-400">
                            {invoice.clientName} • {invoice.clientEmail}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-semibold">
                            €{invoice.total.toFixed(2)}
                        </div>
                        <div className="mt-2 flex justify-end">
                            <StatusPill status={invoice.status} />
                        </div>
                    </div>
                </div>

                <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/5 text-xs text-neutral-300">
                            <tr>
                                <th className="px-4 py-3">Item</th>
                                <th className="px-4 py-3 w-24">Hours</th>
                                <th className="px-4 py-3 w-24">Rate</th>
                                <th className="px-4 py-3 w-24">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {invoice.items.map((it) => (
                                <tr key={it.id}>
                                    <td className="px-4 py-3">
                                        {it.description}
                                    </td>
                                    <td className="px-4 py-3 text-neutral-300">
                                        {it.hours}
                                    </td>
                                    <td className="px-4 py-3 text-neutral-300">
                                        €{it.rate.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3 font-medium">
                                        €{it.total.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 flex items-center justify-end gap-6">
                    <div className="text-sm text-neutral-300">Total</div>
                    <div className="text-2xl font-semibold">
                        €{invoice.total.toFixed(2)}
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-sm font-semibold">Actions</h3>
                <p className="mt-1 text-sm text-neutral-400">
                    Backend keyin. Hozir “Send” fake — status sent bo‘ladi.
                </p>

                <motion.button
                    whileTap={{ scale: 0.98 }}
                    disabled={invoice.status !== "draft" || sendMut.isPending}
                    onClick={() => sendMut.mutate()}
                    className="mt-5 w-full rounded-2xl bg-fuchsia-500 px-4 py-3 text-sm font-medium hover:bg-fuchsia-400 disabled:opacity-60"
                >
                    {sendMut.isPending
                        ? "Sending..."
                        : invoice.status === "draft"
                          ? "Send (fake)"
                          : "Already sent"}
                </motion.button>

                <div className="mt-6 rounded-2xl border border-white/10 bg-neutral-950/40 p-4 text-xs text-neutral-300">
                    <div className="flex justify-between">
                        <span>Issue</span>
                        <span>{invoice.issueDate}</span>
                    </div>
                    <div className="mt-2 flex justify-between">
                        <span>Due</span>
                        <span>{invoice.dueDate}</span>
                    </div>
                    <div className="mt-2 flex justify-between">
                        <span>Currency</span>
                        <span>{invoice.currency}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
