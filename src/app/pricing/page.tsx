// src/app/pricing/page.tsx
import { TopNav } from "@/components/layout/TopNav";

export default function PricingPage() {
    return (
        <div>
            <TopNav />
            <main className="mx-auto w-full max-w-6xl px-4 py-14">
                <h1 className="text-3xl font-semibold">Pricing</h1>
                <p className="mt-2 text-neutral-300">
                    Simple credits now. Stripe later.
                </p>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                        <h3 className="text-lg font-semibold">Free</h3>
                        <p className="mt-1 text-neutral-300">1 invoice</p>
                        <p className="mt-6 text-3xl font-semibold">€0</p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                        <h3 className="text-lg font-semibold">Credits</h3>
                        <p className="mt-1 text-neutral-300">10 invoices</p>
                        <p className="mt-6 text-3xl font-semibold">€5</p>
                    </div>

                    <div className="rounded-2xl border border-fuchsia-500/30 bg-fuchsia-500/10 p-6">
                        <h3 className="text-lg font-semibold">Unlimited</h3>
                        <p className="mt-1 text-neutral-200">30 days</p>
                        <p className="mt-6 text-3xl font-semibold">€29</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
