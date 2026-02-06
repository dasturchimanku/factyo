import Image from "next/image";
import Link from "next/link";

function Glow() {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-fuchsia-500/25 blur-3xl" />
            <div className="absolute top-20 left-[-160px] h-[520px] w-[520px] rounded-full bg-indigo-500/20 blur-3xl" />
            <div className="absolute bottom-[-220px] right-[-140px] h-[620px] w-[620px] rounded-full bg-purple-500/20 blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)]" />
        </div>
    );
}

function Container({ children }: { children: React.ReactNode }) {
    return <div className="mx-auto w-full max-w-6xl px-4">{children}</div>;
}

function Pill({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-300">
            {children}
        </span>
    );
}

function ButtonPrimary({
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}) {
    return (
        <Link
            href={href}
            className="rounded-2xl bg-fuchsia-500 px-5 py-3 text-sm font-medium text-white hover:bg-fuchsia-400"
        >
            {children}
        </Link>
    );
}

function ButtonSecondary({
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}) {
    return (
        <Link
            href={href}
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-neutral-200 hover:bg-white/10"
        >
            {children}
        </Link>
    );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-base font-semibold">{title}</div>
            <div className="mt-2 text-sm text-neutral-300">{desc}</div>
        </div>
    );
}

function PriceCard({
    name,
    price,
    tagline,
    features,
    highlighted,
}: {
    name: string;
    price: string;
    tagline: string;
    features: string[];
    highlighted?: boolean;
}) {
    return (
        <div
            className={[
                "rounded-3xl border p-6",
                highlighted
                    ? "border-fuchsia-500/30 bg-fuchsia-500/10"
                    : "border-white/10 bg-white/5",
            ].join(" ")}
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="text-lg font-semibold">{name}</div>
                    <div className="mt-1 text-sm text-neutral-300">
                        {tagline}
                    </div>
                </div>
                {highlighted ? (
                    <span className="rounded-full border border-fuchsia-500/30 bg-fuchsia-500/15 px-3 py-1 text-xs text-fuchsia-200">
                        Best value
                    </span>
                ) : null}
            </div>

            <div className="mt-6 text-4xl font-semibold">{price}</div>
            <div className="mt-1 text-xs text-neutral-400">excl. VAT</div>

            <ul className="mt-6 space-y-2 text-sm text-neutral-200">
                {features.map((f) => (
                    <li key={f} className="flex gap-2">
                        <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-fuchsia-300/80" />
                        <span className="text-neutral-200">{f}</span>
                    </li>
                ))}
            </ul>

            <button
                className={[
                    "mt-7 w-full rounded-2xl px-4 py-3 text-sm font-medium transition",
                    highlighted
                        ? "bg-fuchsia-500 text-white hover:bg-fuchsia-400"
                        : "border border-white/10 bg-white/5 text-neutral-100 hover:bg-white/10",
                ].join(" ")}
            >
                Choose plan
            </button>
        </div>
    );
}

function TopNav() {
    return (
        <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/70 backdrop-blur">
            <Container>
                <div className="flex items-center justify-between py-3">
                    <Link
                        href="/"
                        className="flex items-center gap-2 font-semibold"
                    >
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-fuchsia-500/20 text-fuchsia-200">
                            F
                        </span>
                        <span>Factyo</span>
                    </Link>

                    <nav className="hidden items-center gap-4 text-sm text-neutral-300 md:flex">
                        <a className="hover:text-white" href="#product">
                            Product
                        </a>
                        <a className="hover:text-white" href="#pricing">
                            Pricing
                        </a>
                        <a className="hover:text-white" href="#faq">
                            Resources
                        </a>
                    </nav>

                    <div className="flex items-center gap-2">
                        <Link
                            href="/sign-in"
                            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-neutral-100 hover:bg-white/10"
                        >
                            Login
                        </Link>
                        <Link
                            href="/sign-up"
                            className="hidden rounded-xl bg-fuchsia-500 px-4 py-2 text-sm font-medium text-white hover:bg-fuchsia-400 md:inline-flex"
                        >
                            Get started
                        </Link>
                    </div>
                </div>
            </Container>
        </header>
    );
}

export function FactyoLanding() {
    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-50">
            <TopNav />

            {/* HERO */}
            <section className="relative">
                <Glow />

                <Container>
                    <div className="grid gap-10 py-14 md:grid-cols-2 md:items-center md:py-20">
                        <div className="relative">
                            <Pill>
                                🇪🇺 Built for EU freelancers • ZZP friendly
                            </Pill>

                            <h1 className="mt-5 text-4xl font-semibold leading-tight md:text-5xl">
                                Effortless{" "}
                                <span className="text-fuchsia-200">
                                    Invoicing
                                </span>
                                <br />
                                for Freelancers
                            </h1>

                            <p className="mt-4 max-w-prose text-neutral-300">
                                Create, send, and manage invoices in minutes.
                                Clean EU-style invoices — no spreadsheets, no
                                stress.
                            </p>

                            <div className="mt-7 flex flex-wrap gap-3">
                                <ButtonPrimary href="/sign-up">
                                    Get Started
                                </ButtonPrimary>
                                <ButtonSecondary href="/invoices">
                                    Watch Demo
                                </ButtonSecondary>
                            </div>

                            <div className="mt-8 flex flex-wrap items-center gap-4 text-xs text-neutral-400">
                                <span>Powered by Stripe (soon)</span>
                                <span className="opacity-50">•</span>
                                <span>PDF + Email automation (soon)</span>
                                <span className="opacity-50">•</span>
                                <span>GDPR-conscious</span>
                            </div>
                        </div>

                        {/* Product preview card */}
                        <div className="relative">
                            <div className="rounded-3xl border border-white/10 bg-white/5 p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
                                <div className="overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/40">
                                    <Image
                                        src="/hero.png"
                                        alt="Factyo product preview"
                                        width={1200}
                                        height={900}
                                        className="h-auto w-full"
                                        priority
                                    />
                                </div>
                            </div>

                            {/* subtle floating glow */}
                            <div className="pointer-events-none absolute -inset-6 rounded-[40px] bg-gradient-to-r from-fuchsia-500/10 via-purple-500/10 to-indigo-500/10 blur-2xl" />
                        </div>
                    </div>
                </Container>
            </section>

            {/* FEATURES */}
            <section
                id="product"
                className="border-t border-white/10 py-14 md:py-20"
            >
                <Container>
                    <div className="text-center">
                        <h2 className="text-3xl font-semibold md:text-4xl">
                            Get paid faster. Stress less.
                        </h2>
                        <p className="mt-3 text-neutral-300">
                            Everything you need to send a professional invoice —
                            nothing you don’t.
                        </p>
                    </div>

                    <div className="mt-10 grid gap-4 md:grid-cols-4">
                        <FeatureCard
                            title="Minimal builder"
                            desc="One screen. Fast typing. Smart totals."
                        />
                        <FeatureCard
                            title="EU-style PDF"
                            desc="Clean template that looks trustworthy."
                        />
                        <FeatureCard
                            title="Email sending"
                            desc="Send invoices with one click (soon)."
                        />
                        <FeatureCard
                            title="History & resend"
                            desc="Find any invoice and resend instantly."
                        />
                    </div>
                </Container>
            </section>

            {/* PRICING */}
            <section id="pricing" className="py-14 md:py-20">
                <Container>
                    <div className="text-center">
                        <h2 className="text-3xl font-semibold md:text-4xl">
                            Pricing
                        </h2>
                        <p className="mt-3 text-neutral-300">
                            Simple plans that scale with you.
                        </p>
                    </div>

                    <div className="mt-10 grid gap-4 md:grid-cols-3">
                        <PriceCard
                            name="Free"
                            price="€0"
                            tagline="Try it today"
                            features={[
                                "1 invoice",
                                "PDF export (soon)",
                                "Invoice history",
                            ]}
                        />
                        <PriceCard
                            name="Credits"
                            price="€5"
                            tagline="Pay as you go"
                            features={[
                                "10 invoice credits",
                                "Email sending (soon)",
                                "History & resend",
                            ]}
                            highlighted
                        />
                        <PriceCard
                            name="Unlimited"
                            price="€29"
                            tagline="For active freelancers"
                            features={[
                                "Unlimited invoices (30 days)",
                                "Priority sending (soon)",
                                "All features",
                            ]}
                        />
                    </div>
                </Container>
            </section>

            {/* CTA */}
            <section className="py-14 md:py-20">
                <Container>
                    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 md:p-12">
                        <div className="pointer-events-none absolute inset-0">
                            <div className="absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-fuchsia-500/20 blur-3xl" />
                            <div className="absolute bottom-[-160px] right-[-120px] h-[420px] w-[420px] rounded-full bg-indigo-500/20 blur-3xl" />
                        </div>

                        <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                            <div>
                                <h3 className="text-2xl font-semibold md:text-3xl">
                                    Send your first invoice in minutes.
                                </h3>
                                <p className="mt-2 text-neutral-300">
                                    Start free — upgrade when you’re ready.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <ButtonPrimary href="/sign-up">
                                    Start free
                                </ButtonPrimary>
                                <ButtonSecondary href="/pricing">
                                    View pricing
                                </ButtonSecondary>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 py-10">
                <Container>
                    <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
                        <div className="text-sm text-neutral-400">
                            © {new Date().getFullYear()} Factyo — Modern
                            invoicing for freelancers.
                        </div>

                        <div className="text-xs text-neutral-500">
                            Powered by Stripe • iDEAL • Resend (soon)
                        </div>
                    </div>
                </Container>
            </footer>
        </div>
    );
}
