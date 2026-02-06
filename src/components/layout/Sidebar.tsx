"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  LogOut,
  Sparkles,
} from "lucide-react";

import { profileRepo } from "@/repositories/profile/profileRepo";
import type { UserProfile } from "@/lib/auth/models";
import { localSignOut } from "@/lib/auth/localAuth";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join("") || "U";
}

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const nav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { href: "/invoices", label: "Invoices", icon: <FileText size={18} /> },
  { href: "/clients", label: "Clients", icon: <Users size={18} /> },
  { href: "/settings", label: "Settings", icon: <Settings size={18} /> },
];

export function Sidebar({
  mode,
  variant,
  onToggle,
  onClose,
}: {
  mode: "desktop" | "mobile";
  variant: "full" | "compact";
  onToggle?: () => void; // desktop state cycle
  onClose?: () => void;  // mobile close
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    profileRepo.get().then(setProfile);
  }, []);

  const avatar = useMemo(() => initials(profile?.name ?? "User"), [profile?.name]);
  const compact = variant === "compact";
  const width = compact ? 76 : 280;

  async function logout() {
    await localSignOut();
    onClose?.();
    router.push("/");
    router.refresh();
  }

  return (
    <aside
      className={[
        mode === "desktop" ? "fixed left-0 top-0 z-40" : "relative",
        "h-screen border-r border-white/10 bg-neutral-950/80 backdrop-blur",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.03)]",
      ].join(" ")}
      style={{ width }}
    >
      {/* Top row */}
      <div className="flex h-16 items-center justify-between px-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-2xl px-2 py-2 hover:bg-white/5"
          onClick={onClose}
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-fuchsia-500/20 text-fuchsia-200">
            F
          </span>
          {!compact ? (
            <div className="leading-tight">
              <div className="text-sm font-semibold">Factyo</div>
              <div className="text-xs text-neutral-400">Invoicing</div>
            </div>
          ) : null}
        </Link>

        {mode === "desktop" ? (
          <button
            onClick={onToggle}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10"
            aria-label="Toggle sidebar"
            title="Toggle sidebar"
          >
            {compact ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
          </button>
        ) : (
          <button
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10"
            aria-label="Close"
          >
            ✕
          </button>
        )}
      </div>

      {/* Pro pill */}
      <div className="px-3">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="pointer-events-none absolute -inset-10 bg-gradient-to-r from-fuchsia-500/10 via-purple-500/10 to-indigo-500/10 blur-2xl" />
          <div className="relative flex items-center gap-3">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/10">
              <Sparkles size={18} />
            </div>
            {!compact ? (
              <div className="min-w-0">
                <div className="text-sm font-semibold">Pro workspace</div>
                <div className="text-xs text-neutral-400">Cleaner invoices, faster flow</div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="mt-4 px-3">
        <div className="space-y-2">
          {nav.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={[
                  "group flex items-center gap-3 rounded-2xl border px-3 py-3 text-sm transition",
                  active
                    ? "border-fuchsia-500/25 bg-fuchsia-500/10 text-white"
                    : "border-transparent text-neutral-200 hover:bg-white/5 hover:border-white/10",
                ].join(" ")}
                title={compact ? item.label : undefined}
              >
                <span
                  className={[
                    "inline-flex h-10 w-10 items-center justify-center rounded-2xl",
                    active ? "bg-fuchsia-500/15" : "bg-white/5 group-hover:bg-white/10",
                  ].join(" ")}
                >
                  {item.icon}
                </span>

                {!compact ? <span className="font-medium">{item.label}</span> : null}

                {!compact ? (
                  <span
                    className={[
                      "ml-auto h-2 w-2 rounded-full transition",
                      active ? "bg-fuchsia-300" : "bg-white/15 group-hover:bg-white/25",
                    ].join(" ")}
                  />
                ) : null}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom profile */}
      <div className="absolute bottom-0 left-0 w-full border-t border-white/10 p-3">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-sm font-semibold">
            {avatar}
          </div>

          {!compact ? (
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">{profile?.name ?? "User"}</div>
              <div className="truncate text-xs text-neutral-400">{profile?.email ?? ""}</div>
            </div>
          ) : null}

          <button
            onClick={logout}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10"
            aria-label="Logout"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}
