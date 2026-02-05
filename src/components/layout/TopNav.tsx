// src/components/layout/TopNav.tsx
import Link from "next/link";

export function TopNav() {
    return (
        <header className="sticky top-0 z-40 border-b border-white/10 bg-neutral-950/70 backdrop-blur">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
                <Link
                    href="/"
                    className="flex items-center gap-2 font-semibold"
                >
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-fuchsia-500/20 text-fuchsia-300">
                        F
                    </span>
                    <span>Factyo</span>
                </Link>

                <nav className="flex items-center gap-3 text-sm text-neutral-300">
                    <Link className="hover:text-white" href="/pricing">
                        Pricing
                    </Link>
                    <Link className="hover:text-white" href="/app">
                        Dashboard
                    </Link>
                    <a
                        className="rounded-lg border border-white/10 px-3 py-1.5 hover:bg-white/5"
                        href="#"
                    >
                        Login
                    </a>
                </nav>
            </div>
        </header>
    );
}
