"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { companyRepo } from "@/repositories/company/companyRepo";
import type { Company } from "@/lib/company/models";

function makeId() {
  return `cmp_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className="text-sm text-neutral-300">{label}</label>
      <div className="mt-1">{children}</div>
      {hint ? <div className="mt-1 text-xs text-neutral-500">{hint}</div> : null}
    </div>
  );
}

export default function CompanySettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [id, setId] = useState<string>(makeId());
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

  const completeness = useMemo(() => {
    const fields = [legalName, city, addressLine1, postalCode];
    const filled = fields.filter((x) => x.trim().length > 0).length;
    return Math.round((filled / fields.length) * 100);
  }, [legalName, city, addressLine1, postalCode]);

  useEffect(() => {
    (async () => {
      const c = await companyRepo.get();
      if (c) {
        setId(c.id);
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
  }, []);

  async function onSave() {
    setError(null);
    setSaved(false);

    if (!legalName.trim()) return setError("Legal name is required.");
    if (!city.trim()) return setError("City is required.");
    if (!addressLine1.trim()) return setError("Address is required.");
    if (!postalCode.trim()) return setError("Postal code is required.");

    setSaving(true);
    try {
      const now = new Date().toISOString();
      const payload: Company = {
        id,
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
        createdAt: now,
        updatedAt: now,
      };

      await companyRepo.upsert(payload);
      setSaved(true);
    } catch (e: any) {
      setError(e?.message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        Loading…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Company details</h1>
          <p className="mt-1 text-sm text-neutral-400">
            These details appear on your invoices.
          </p>
        </div>

        <div className="min-w-[160px]">
          <div className="text-xs text-neutral-400">Completeness</div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full bg-fuchsia-500" style={{ width: `${completeness}%` }} />
          </div>
          <div className="mt-1 text-xs text-neutral-400">{completeness}%</div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Legal name *">
            <input className="input" value={legalName} onChange={(e) => setLegalName(e.target.value)} placeholder="John Smith ZZP" />
          </Field>

          <Field label="Trade name" hint="Optional brand name shown on invoice header">
            <input className="input" value={tradeName} onChange={(e) => setTradeName(e.target.value)} placeholder="Factyo Studio" />
          </Field>

          <Field label="Country *">
            <select className="input" value={country} onChange={(e) => setCountry(e.target.value)}>
              <option value="NL">Netherlands</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="ES">Spain</option>
            </select>
          </Field>

          <Field label="City *">
            <input className="input" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Amsterdam" />
          </Field>

          <Field label="Address line *" hint="Street + number" >
            <input className="input" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} placeholder="123 Business St" />
          </Field>

          <Field label="Postal code *">
            <input className="input" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="1011AB" />
          </Field>

          <Field label="VAT/BTW ID" hint="Optional">
            <input className="input" value={vatId} onChange={(e) => setVatId(e.target.value)} placeholder="NL123..." />
          </Field>

          <Field label="KVK (NL)" hint="Optional">
            <input className="input" value={kvk} onChange={(e) => setKvk(e.target.value)} placeholder="12345678" />
          </Field>

          <Field label="IBAN" hint="Optional, shown in payment section">
            <input className="input" value={iban} onChange={(e) => setIban(e.target.value)} placeholder="NL00BANK..." />
          </Field>

          <Field label="Payment term (days)">
            <input className="input" type="number" value={termDays} onChange={(e) => setTermDays(Number(e.target.value))} />
          </Field>
        </div>

        {error ? (
          <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        {saved ? (
          <div className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
            Saved successfully.
          </div>
        ) : null}

        <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <Link
            href="/settings"
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-neutral-100 hover:bg-white/10"
          >
            Back
          </Link>

          <button
            onClick={onSave}
            disabled={saving}
            className="rounded-2xl bg-fuchsia-500 px-5 py-3 text-sm font-medium text-white hover:bg-fuchsia-400 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>

      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.10);
          background: rgba(0, 0, 0, 0.25);
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          color: white;
          outline: none;
        }
        .input:focus {
          box-shadow: 0 0 0 2px rgba(217, 70, 239, 0.35);
        }
      `}</style>
    </div>
  );
}
