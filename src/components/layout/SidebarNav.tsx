"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { profileRepo } from "@/repositories/profile/profileRepo";
import type { UserProfile } from "@/lib/auth/models";
import { localSignOut } from "@/lib/auth/localAuth";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join("") || "U";
}

function NavItem({
  href,
  label,
  onNavigate,
}: {
  href: string;
  label: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={[
        "group relative flex items-center justify-between rounded-2xl border px-4 py-3 text-sm transition",
        active
          ? "border-fuchsia-500/30 bg-fuchsia-500/10 text-white"
          : "border-white/10 bg-white/5 text-neutral-200 hover:bg-white/10",
      ].join(" ")}
    >
      <span className="font-medium">{label}</span>
      <span
        className={[
          "h-2 w-2 rounded-full transition",
          active ? "bg-fuchsia-300" : "bg-white/20 group-hover:bg-white/30",
        ].join(" ")}
      />
    </Link>
  );
}

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    profileRepo.get().then(setProfile);
  }, []);

  const avatar = useMemo(() => initials(profile?.name ?? "User"), [profile?.name]);

  async function logout() {
    await localSignOut();
    onNavigate?.();
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="w-[280px] rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
      <Link href="/dashboard" onClick={onNavigate} className="flex items-center gap-2 px-2 py-2">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-fuchsia-500/20 text-fuchsia-200">
          F
        </span>
        <div>
          <div className="text-sm font-semibold">Factyo</div>
          <div className="text-xs text-neutral-400">Invoicing workspace</div>
        </div>
      </Link>

      <div className="mt-4 space-y-2">
        <NavItem href="/dashboard" label="Dashboard" onNavigate={onNavigate} />
        <NavItem href="/invoices" label="Invoices" onNavigate={onNavigate} />
        <NavItem href="/clients" label="Clients" onNavigate={onNavigate} />
        <NavItem href="/settings" label="Settings" onNavigate={onNavigate} />
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-neutral-950/30 p-3">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-sm font-semibold">
            {avatar}
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium">{profile?.name ?? "User"}</div>
            <div className="truncate text-xs text-neutral-400">{profile?.email ?? ""}</div>
          </div>
        </div>

        <button
          onClick={logout}
          className="mt-3 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-neutral-100 hover:bg-white/10"
        >
          Logout
        </button>
      </div>

      {/* subtle glow */}
      <div className="pointer-events-none absolute" />
    </aside>
  );
}
