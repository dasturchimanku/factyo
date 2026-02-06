"use client";

import Link from "next/link";
import { StatusPill } from "./StatusPill";
import type { Invoice } from "@/lib/invoices/models";

export function InvoicesTable({ invoices }: { invoices: Invoice[] }) {
    return (
        <div className="overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-xs text-neutral-300">
                    <tr>
                        <th className="px-4 py-3">Invoice</th>
                        <th className="px-4 py-3">Client</th>
                        <th className="px-4 py-3">Issue</th>
                        <th className="px-4 py-3">Due</th>
                        <th className="px-4 py-3">Total</th>
                        <th className="px-4 py-3">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                    {invoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-white/[0.03]">
                            <td className="px-4 py-3">
                                <Link
                                    className="font-medium hover:underline"
                                    href={`/invoices/${inv.id}`}
                                >
                                    {inv.number}
                                </Link>
                            </td>
                            <td className="px-4 py-3">
                                <div className="font-medium">
                                    {inv.clientName}
                                </div>
                                <div className="text-xs text-neutral-400">
                                    {inv.clientEmail}
                                </div>
                            </td>
                            <td className="px-4 py-3 text-neutral-300">
                                {inv.issueDate}
                            </td>
                            <td className="px-4 py-3 text-neutral-300">
                                {inv.dueDate}
                            </td>
                            <td className="px-4 py-3 font-medium">
                                €{inv.total.toFixed(2)}
                            </td>
                            <td className="px-4 py-3">
                                <StatusPill status={inv.status} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
