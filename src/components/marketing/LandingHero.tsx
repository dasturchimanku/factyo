"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function LandingHero() {
    return (
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-fuchsia-500/20 blur-3xl" />
                <div className="absolute -bottom-48 right-[-120px] h-[520px] w-[520px] rounded-full bg-indigo-500/20 blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="relative"
            >
                <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-300">
                    🇪🇺 Built for EU freelancers • ZZP friendly
                </p>

                <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
                    Send your first invoice in{" "}
                    <span className="text-fuchsia-200">2 minutes</span>.
                </h1>

                <p className="mt-4 max-w-prose text-neutral-300">
                    A minimal invoicing tool made for freelancers. Create a
                    clean invoice, keep history, and automate sending — without
                    heavy accounting software.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                    <Link
                        href="/sign-up"
                        className="rounded-2xl bg-fuchsia-500 px-5 py-3 text-sm font-medium text-white hover:bg-fuchsia-400"
                    >
                        Get started
                    </Link>
                    <Link
                        href="/invoices"
                        className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-neutral-200 hover:bg-white/10"
                    >
                        Open demo invoices
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
