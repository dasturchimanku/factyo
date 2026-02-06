"use client";

import { AppShell } from "@/components/layout/AppShell";
import { InvoicePreview } from "@/components/invoices/InvoicePreview";
import { useQuery } from "@tanstack/react-query";
import { apiGetInvoice, qk } from "@/lib/invoices/api";
import { useParams, useRouter } from "next/navigation";
import { getUser } from "@/lib/auth/fakeAuth";
import { useEffect } from "react";

export default function InvoicePage() {
    const router = useRouter();
    useEffect(() => {
        if (!getUser()) router.replace("/sign-in");
    }, [router]);

    const params = useParams<{ id: string }>();
    const id = params?.id;

    const { data, isLoading } = useQuery({
        queryKey: qk.invoice(String(id)),
        queryFn: () => apiGetInvoice(String(id)),
        enabled: !!id,
    });

    return (
        <AppShell
            title="Invoice preview"
            subtitle="Fake preview — backend later"
        >
            {isLoading ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-neutral-300">
                    Loading...
                </div>
            ) : !data ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <p className="text-neutral-200">Invoice not found.</p>
                    <p className="mt-1 text-sm text-neutral-400">
                        Check the link or create a new invoice.
                    </p>
                </div>
            ) : (
                <InvoicePreview invoice={data} />
            )}
        </AppShell>
    );
}
