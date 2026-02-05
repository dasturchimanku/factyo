// src/app/page.tsx
import Link from "next/link";
import { TopNav } from "@/components/layout/TopNav";

export default function HomePage() {
    return (
        <div>
            <TopNav />

            <main className="mx-auto w-full max-w-6xl px-4 py-14">
                <div className="grid gap-10 md:grid-cols-2 md:items-center">
                    <div>
                        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-300">
                            🇪🇺 Built for EU freelancers • ZZP friendly
                        </p>

                        <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
                            Effortless{" "}
                            <span className="text-fuchsia-300">Invoicing</span>
                            <br />
                            for Freelancers
                        </h1>

                        <p className="mt-4 max-w-prose text-neutral-300">
                            Create, send, and manage invoices in minutes. A
                            minimal, modern invoice builder — designed so new
                            ZZP can send their first invoice fast.
                        </p>

                        <div className="mt-7 flex flex-wrap gap-3">
                            <Link
                                href="/app"
                                className="rounded-xl bg-fuchsia-500 px-5 py-3 text-sm font-medium text-white hover:bg-fuchsia-400"
                            >
                                Get Started
                            </Link>
                            <Link
                                href="/app"
                                className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-neutral-200 hover:bg-white/10"
                            >
                                Watch Demo
                            </Link>
                        </div>

                        <div className="mt-8 flex flex-wrap items-center gap-4 text-xs text-neutral-400">
                            <span>Powered by Stripe (soon)</span>
                            <span className="opacity-50">•</span>
                            <span>PDF + Email automation (soon)</span>
                            <span className="opacity-50">•</span>
                            <span>GDPR-conscious</span>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6">
                        <div className="rounded-xl border border-white/10 bg-neutral-950/60 p-5">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-semibold">
                                        Invoice
                                    </p>
                                    <p className="mt-1 text-xs text-neutral-400">
                                        Acme Corp • Amsterdam, NL
                                    </p>
                                </div>
                                <p className="text-2xl font-semibold">
                                    €750.00
                                </p>
                            </div>

                            <div className="mt-6 space-y-2 text-sm">
                                <div className="flex justify-between border-b border-white/10 pb-2 text-neutral-300">
                                    <span>Service Design Work (15h × €50)</span>
                                    <span>€750</span>
                                </div>
                                <div className="flex justify-between text-neutral-400">
                                    <span>VAT (0%)</span>
                                    <span>€0</span>
                                </div>
                                <div className="flex justify-between pt-2 font-semibold">
                                    <span>Total Due</span>
                                    <span>€750</span>
                                </div>
                            </div>

                            <button className="mt-6 w-full rounded-xl bg-fuchsia-500 px-4 py-3 text-sm font-medium hover:bg-fuchsia-400">
                                Pay Now
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="border-t border-white/10 py-8 text-center text-xs text-neutral-500">
                © {new Date().getFullYear()} Factyo — Get paid faster. Stress
                less.
            </footer>
        </div>
    );
}
