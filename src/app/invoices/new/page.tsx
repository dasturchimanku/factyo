"use client";

import { AppShell } from "@/components/layout/AppShell";
import { InvoiceForm } from "@/components/invoices/InvoiceForm";
import { getUser } from "@/lib/auth/fakeAuth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewInvoicePage() {
    const router = useRouter();
    useEffect(() => {
        if (!getUser()) router.replace("/sign-in");
    }, [router]);

    return (
        <AppShell
            title="Create invoice"
            subtitle="Form + line items + total calculation"
        >
            <InvoiceForm />
        </AppShell>
    );
}
