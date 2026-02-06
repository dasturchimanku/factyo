"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { profileRepo } from "@/repositories/profile/profileRepo";
import { companyRepo } from "@/repositories/company/companyRepo";
import type { UserProfile } from "@/lib/auth/models";

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [hasCompany, setHasCompany] = useState(false);

  useEffect(() => {
    (async () => {
      const p = await profileRepo.get();
      setProfile(p);
      const c = await companyRepo.get();
      setHasCompany(!!c);
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="mt-1 text-sm text-neutral-400">Manage your profile and business details.</p>
      </div>

      {/* Profile card */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="text-sm font-semibold">Account</div>
        <div className="mt-3 text-sm text-neutral-300">
          <div><span className="text-neutral-400">Name:</span> {profile?.name ?? "-"}</div>
          <div className="mt-1"><span className="text-neutral-400">Email:</span> {profile?.email ?? "-"}</div>
        </div>
      </div>

      {/* Activation */}
      {!hasCompany ? (
        <div className="rounded-3xl border border-fuchsia-500/25 bg-fuchsia-500/10 p-6">
          <div className="text-sm font-semibold text-fuchsia-100">Profile activation</div>
          <p className="mt-2 text-sm text-neutral-200">
            Add your company details to generate EU-style invoices with correct headers and payment info.
          </p>
          <div className="mt-4">
            <Link
              href="/settings/company"
              className="inline-flex rounded-2xl bg-fuchsia-500 px-5 py-3 text-sm font-medium text-white hover:bg-fuchsia-400"
            >
              Activate profile
            </Link>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-6">
          <div className="text-sm font-semibold text-emerald-100">Profile active</div>
          <p className="mt-2 text-sm text-neutral-200">Company details are set. You’re ready to invoice.</p>
          <div className="mt-4">
            <Link
              href="/settings/company"
              className="inline-flex rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-neutral-100 hover:bg-white/10"
            >
              Edit company details
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
