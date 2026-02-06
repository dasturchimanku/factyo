"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { useQuery } from "@tanstack/react-query";
import { apiListInvoices, qk } from "@/lib/invoices/api";
import { InvoicesTable } from "@/components/invoices/InvoicesTable";
import { getUser } from "@/lib/auth/fakeAuth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function InvoicesPage() {
    const router = useRouter();
    useEffect(() => {
        if (!getUser()) router.replace("/sign-in");
    }, [router]);

    const { data, isLoading } = useQuery({
        queryKey: qk.invoices,
        queryFn: apiListInvoices,
    });
    const invoices = data ?? [];

    return (
        <AppShell
            title="Invoices"
            subtitle="LocalStorage fake backend"
            right={
                <Link
                    href="/invoices/new"
                    className="rounded-2xl bg-fuchsia-500 px-4 py-2.5 text-sm font-medium hover:bg-fuchsia-400"
                >
                    + New invoice
                </Link>
            }
        >
            {isLoading ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-neutral-300">
                    Loading...
                </div>
            ) : invoices.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <p className="text-neutral-200">No invoices yet.</p>
                    <p className="mt-1 text-sm text-neutral-400">
                        Create your first invoice.
                    </p>
                </div>
            ) : (
                <InvoicesTable invoices={invoices} />
            )}
        </AppShell>
    );
}
