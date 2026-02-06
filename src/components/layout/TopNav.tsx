"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { profileRepo } from "@/repositories/profile/profileRepo";
import type { UserProfile } from "@/lib/auth/models";
import { localSignOut } from "@/lib/auth/localAuth";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join("");
}

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/" && pathname.startsWith(href));
  return (
    <Link
      href={href}
      className={[
        "relative rounded-lg px-3 py-2 text-sm transition",
        active ? "text-white" : "text-neutral-300 hover:text-white",
      ].join(" ")}
    >
      {label}
      <span
        className={[
          "pointer-events-none absolute bottom-1 left-3 right-3 h-[2px] rounded-full bg-gradient-to-r from-fuchsia-400 via-purple-400 to-indigo-400 transition-opacity",
          active ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />
    </Link>
  );
}

export function TopNav() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    profileRepo.get().then(setProfile);
  }, []);

  const avatarText = useMemo(() => {
    if (!profile?.name) return "U";
    return initials(profile.name);
  }, [profile?.name]);

  async function logout() {
    await localSignOut();
    setProfile(null);
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-fuchsia-500/20 text-fuchsia-200">
            F
          </span>
          <span>Factyo</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink href="/dashboard" label="Dashboard" />
          <NavLink href="/invoices" label="Invoices" />
          <NavLink href="/pricing" label="Pricing" />
        </nav>

        <div className="relative">
          {profile ? (
            <>
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-sm font-semibold text-neutral-100">
                  {avatarText}
                </span>
                <div className="hidden text-left md:block">
                  <div className="text-sm font-medium">{profile.name}</div>
                  <div className="text-xs text-neutral-400">{profile.email}</div>
                </div>
              </button>

              {open ? (
                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/95 shadow-xl">
                  <Link
                    href="/settings"
                    className="block px-4 py-3 text-sm text-neutral-200 hover:bg-white/5"
                    onClick={() => setOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full px-4 py-3 text-left text-sm text-neutral-200 hover:bg-white/5"
                  >
                    Logout
                  </button>
                </div>
              ) : null}
            </>
          ) : (
            <div className="flex gap-2">
              <Link
                href="/sign-in"
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-neutral-100 hover:bg-white/10"
              >
                Login
              </Link>
              <Link
                href="/sign-up"
                className="rounded-xl bg-fuchsia-500 px-4 py-2 text-sm font-medium text-white hover:bg-fuchsia-400"
              >
                Get started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
