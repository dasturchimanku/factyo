"use client";

import Link from "next/link";
import { TopNav } from "@/components/layout/TopNav";
import { useQuery } from "@tanstack/react-query";
import { apiListInvoices, qk } from "@/lib/fake/api";

function StatusPill({ status }: { status: string }) {
    const styles: Record<string, string> = {
        draft: "bg-white/5 text-neutral-300 border-white/10",
        sent: "bg-blue-500/10 text-blue-200 border-blue-500/20",
        paid: "bg-emerald-500/10 text-emerald-200 border-emerald-500/20",
    };
    return (
        <span
            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs ${
                styles[status] ?? "bg-white/5 text-neutral-300 border-white/10"
            }`}
        >
            {status.toUpperCase()}
        </span>
    );
}

export default function AppDashboardPage() {
    const { data, isLoading } = useQuery({
        queryKey: qk.invoices,
        queryFn: apiListInvoices,
    });

    const invoices = data ?? [];

    return (
        <div>
            <TopNav />

            <main className="mx-auto w-full max-w-6xl px-4 py-10">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-2xl font-semibold">Invoices</h2>
                        <p className="mt-1 text-sm text-neutral-400">
                            LocalStorage-based fake backend.
                        </p>
                    </div>

                    <Link
                        href="/app/new"
                        className="rounded-xl bg-fuchsia-500 px-4 py-2.5 text-sm font-medium hover:bg-fuchsia-400"
                    >
                        + New Invoice
                    </Link>
                </div>

                <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
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
                            {isLoading ? (
                                <tr>
                                    <td
                                        className="px-4 py-6 text-neutral-400"
                                        colSpan={6}
                                    >
                                        Loading...
                                    </td>
                                </tr>
                            ) : invoices.length === 0 ? (
                                <tr>
                                    <td
                                        className="px-4 py-6 text-neutral-400"
                                        colSpan={6}
                                    >
                                        No invoices yet. Create your first one.
                                    </td>
                                </tr>
                            ) : (
                                invoices.map((inv) => (
                                    <tr
                                        key={inv.id}
                                        className="hover:bg-white/[0.03]"
                                    >
                                        <td className="px-4 py-3">
                                            <Link
                                                className="font-medium hover:underline"
                                                href={`/app/invoices/${inv.id}`}
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
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
