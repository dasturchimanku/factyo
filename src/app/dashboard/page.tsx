"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { getUser } from "@/lib/auth/fakeAuth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const router = useRouter();

    useEffect(() => {
        const u = getUser();
        if (!u) router.replace("/sign-in");
    }, [router]);

    return (
        <AppShell
            title="Dashboard"
            subtitle="Quick actions. Backend later."
            right={
                <Link
                    href="/invoices/new"
                    className="rounded-2xl bg-fuchsia-500 px-4 py-2.5 text-sm font-medium hover:bg-fuchsia-400"
                >
                    + New invoice
                </Link>
            }
        >
            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <p className="text-sm text-neutral-300">Goal</p>
                    <p className="mt-2 text-lg font-semibold">
                        Send first invoice fast
                    </p>
                    <p className="mt-1 text-sm text-neutral-400">
                        UX-first flow
                    </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <p className="text-sm text-neutral-300">Demo</p>
                    <p className="mt-2 text-lg font-semibold">
                        Fake PDF & Email
                    </p>
                    <p className="mt-1 text-sm text-neutral-400">
                        Status updates only
                    </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <p className="text-sm text-neutral-300">Next</p>
                    <p className="mt-2 text-lg font-semibold">
                        NestJS + Fly.io
                    </p>
                    <p className="mt-1 text-sm text-neutral-400">
                        Real invoices + send
                    </p>
                </div>
            </div>
        </AppShell>
    );
}
