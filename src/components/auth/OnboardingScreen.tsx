"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { profileRepo } from "@/repositories/profile/profileRepo";
import { companyRepo } from "@/repositories/company/companyRepo";
import type { Company } from "@/lib/company/models";
import { setOnboardedCookie } from "@/lib/auth/session";

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

export function OnboardingScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [legalName, setLegalName] = useState("");
  const [tradeName, setTradeName] = useState("");
  const [country, setCountry] = useState("NL");
  const [city, setCity] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [vatId, setVatId] = useState("");
  const [kvk, setKvk] = useState("");
  const [iban, setIban] = useState("");
  const [termDays, setTermDays] = useState(14);

  const progress = useMemo(() => {
    const fields = [legalName, country, city, addressLine1, postalCode];
    const filled = fields.filter((x) => String(x).trim().length > 0).length;
    return Math.round((filled / fields.length) * 100);
  }, [legalName, country, city, addressLine1, postalCode]);

  useEffect(() => {
    (async () => {
      const p = await profileRepo.get();
      if (!p) {
        router.replace("/sign-in");
        return;
      }
      if (p.onboardingCompleted) {
        router.replace("/dashboard");
        return;
      }

      const c = await companyRepo.get();
      if (c) {
        setLegalName(c.legalName ?? "");
        setTradeName(c.tradeName ?? "");
        setCountry(c.country ?? "NL");
        setCity(c.city ?? "");
        setAddressLine1(c.addressLine1 ?? "");
        setPostalCode(c.postalCode ?? "");
        setVatId(c.vatId ?? "");
        setKvk(c.kvk ?? "");
        setIban(c.iban ?? "");
        setTermDays(c.defaultPaymentTermDays ?? 14);
      }

      setLoading(false);
    })();
  }, [router]);

  async function onSave() {
    setError(null);

    if (!legalName.trim()) return setError("Legal company name is required.");
    if (!city.trim()) return setError("City is required.");
    if (!addressLine1.trim()) return setError("Address is required.");
    if (!postalCode.trim()) return setError("Postal code is required.");

    setSaving(true);
    try {
      const profile = await profileRepo.get();
      if (!profile) throw new Error("Not authenticated.");

      const company: Company = {
        id: profile.companyId ?? uid("cmp"),
        legalName: legalName.trim(),
        tradeName: tradeName.trim() || undefined,
        country,
        city: city.trim(),
        addressLine1: addressLine1.trim(),
        postalCode: postalCode.trim(),
        vatId: vatId.trim() || undefined,
        kvk: kvk.trim() || undefined,
        iban: iban.trim() || undefined,
        defaultPaymentTermDays: Number(termDays) || 14,
        createdAt: new Date().toISOString(),
      };

      const saved = await companyRepo.upsert(company);
      await profileRepo.update({
        onboardingCompleted: true,
        companyId: saved.id,
      });
      setOnboardedCookie();
;

      router.replace("/dashboard");
      router.refresh();
    } catch (e: any) {
      setError(e?.message ?? "Failed to save onboarding");
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-50">
        <div className="mx-auto max-w-lg px-4 py-16">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            Loading…
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-fuchsia-500/18 blur-3xl" />
        <div className="absolute bottom-[-220px] right-[-140px] h-[620px] w-[620px] rounded-full bg-indigo-500/16 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-2xl px-4 py-14">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold">Set up your business</h1>
              <p className="mt-1 text-sm text-neutral-300">
                Required for EU-style invoices. You can edit later.
              </p>
            </div>

            <div className="min-w-[140px]">
              <div className="text-xs text-neutral-400">Progress</div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full bg-fuchsia-500" style={{ width: `${progress}%` }} />
              </div>
              <div className="mt-1 text-xs text-neutral-400">{progress}%</div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Field label="Legal name *">
              <input value={legalName} onChange={(e) => setLegalName(e.target.value)} className="input" placeholder="e.g. John Smith ZZP" />
            </Field>

            <Field label="Trade name">
              <input value={tradeName} onChange={(e) => setTradeName(e.target.value)} className="input" placeholder="Optional" />
            </Field>

            <Field label="Country *">
              <select value={country} onChange={(e) => setCountry(e.target.value)} className="input">
                <option value="NL">Netherlands</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
                <option value="ES">Spain</option>
              </select>
            </Field>

            <Field label="City *">
              <input value={city} onChange={(e) => setCity(e.target.value)} className="input" placeholder="Amsterdam" />
            </Field>

            <Field label="Address line *" className="md:col-span-2">
              <input value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} className="input" placeholder="123 Business St" />
            </Field>

            <Field label="Postal code *">
              <input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="input" placeholder="1011AB" />
            </Field>

            <Field label="Payment term (days)">
              <input type="number" value={termDays} onChange={(e) => setTermDays(Number(e.target.value))} className="input" />
            </Field>

            <Field label="VAT/BTW ID">
              <input value={vatId} onChange={(e) => setVatId(e.target.value)} className="input" placeholder="Optional" />
            </Field>

            <Field label="KVK (NL)">
              <input value={kvk} onChange={(e) => setKvk(e.target.value)} className="input" placeholder="Optional" />
            </Field>

            <Field label="IBAN">
              <input value={iban} onChange={(e) => setIban(e.target.value)} className="input" placeholder="Optional" />
            </Field>
          </div>

          {error ? (
            <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-xs text-neutral-400">
              * Required fields. You can edit later in Settings.
            </p>

            <button
              onClick={onSave}
              disabled={saving}
              className="rounded-2xl bg-fuchsia-500 px-5 py-3 text-sm font-medium text-white hover:bg-fuchsia-400 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Finish setup"}
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .input {
          margin-top: 0.25rem;
          width: 100%;
          border-radius: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.25);
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          outline: none;
        }
        .input:focus {
          box-shadow: 0 0 0 2px rgba(217, 70, 239, 0.35);
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="text-sm text-neutral-300">{label}</label>
      {children}
    </div>
  );
}
