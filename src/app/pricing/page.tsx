import { TopNav } from "@/components/layout/TopNav";
import { PricingGrid } from "@/components/marketing/PricingGrid";

export default function PricingPage() {
    return (
        <div>
            <TopNav />
            <main className="mx-auto w-full max-w-6xl px-4 py-10">
                <h1 className="text-3xl font-semibold">Pricing</h1>
                <p className="mt-2 text-neutral-300">
                    Simple plans. Stripe later.
                </p>
                <div className="mt-8">
                    <PricingGrid />
                </div>
            </main>
        </div>
    );
}
