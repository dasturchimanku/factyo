"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getUser, signOut } from "@/lib/auth/fakeAuth";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";

function NavLink({
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const active = pathname === href;
    return (
        <Link
            className={[
                "rounded-lg px-3 py-1.5 text-sm transition",
                active
                    ? "bg-white/10 text-white"
                    : "text-neutral-300 hover:bg-white/5 hover:text-white",
            ].join(" ")}
            href={href}
        >
            {children}
        </Link>
    );
}

export function TopNav() {
    const [authed, setAuthed] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setAuthed(!!getUser());
    }, []);

    return (
        <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/70 backdrop-blur">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
                <Link
                    href="/"
                    className="flex items-center gap-2 font-semibold"
                >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-fuchsia-500/20 text-fuchsia-200">
                        F
                    </span>
                    <span>Factyo</span>
                </Link>

                <nav className="flex items-center gap-1">
                    <NavLink href="/pricing">Pricing</NavLink>

                    {authed ? (
                        <>
                            <NavLink href="/dashboard">Dashboard</NavLink>
                            <NavLink href="/invoices">Invoices</NavLink>

                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    signOut();
                                    setAuthed(false);
                                    router.push("/");
                                    router.refresh();
                                }}
                                className="ml-2 rounded-lg border border-white/10 px-3 py-1.5 text-sm text-neutral-200 hover:bg-white/5"
                            >
                                Logout
                            </motion.button>
                        </>
                    ) : (
                        <>
                            <NavLink href="/sign-in">Sign in</NavLink>
                            <Link
                                className="ml-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-neutral-100 hover:bg-white/10"
                                href="/sign-up"
                            >
                                Sign up
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
