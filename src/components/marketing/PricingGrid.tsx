export function PricingGrid() {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-lg font-semibold">Free</h3>
                <p className="mt-1 text-neutral-300">1 invoice</p>
                <p className="mt-6 text-3xl font-semibold">€0</p>
                <p className="mt-2 text-sm text-neutral-400">
                    Perfect to try Factyo.
                </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-lg font-semibold">Credits</h3>
                <p className="mt-1 text-neutral-300">10 invoices</p>
                <p className="mt-6 text-3xl font-semibold">€5</p>
                <p className="mt-2 text-sm text-neutral-400">Pay-as-you-go.</p>
            </div>

            <div className="rounded-2xl border border-fuchsia-500/30 bg-fuchsia-500/10 p-6">
                <h3 className="text-lg font-semibold">Unlimited</h3>
                <p className="mt-1 text-neutral-200">30 days</p>
                <p className="mt-6 text-3xl font-semibold">€29</p>
                <p className="mt-2 text-sm text-neutral-300">
                    For active freelancers.
                </p>
            </div>
        </div>
    );
}
