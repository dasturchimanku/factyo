"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { invoiceRepo } from "@/repositories/invoice/invoiceRepo";
import { companyRepo } from "@/repositories/company/companyRepo";
import { clientRepo } from "@/repositories/client/clientRepo";

type Stat = { label: string; value: string; hint?: string };

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
      {children}
    </div>
  );
}

function PrimaryButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-2xl bg-fuchsia-500 px-5 py-3 text-sm font-medium text-white hover:bg-fuchsia-400"
    >
      {children}
    </Link>
  );
}

function SecondaryButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-neutral-100 hover:bg-white/10"
    >
      {children}
    </Link>
  );
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stat[]>([]);
  const [activationNeeded, setActivationNeeded] = useState(false);
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const company = await companyRepo.get();
      setActivationNeeded(!company);

      const invoices = await invoiceRepo.list();
      const clients = await clientRepo.list();

      const totalInvoices = invoices.length;
      const drafts = invoices.filter((x) => x.status === "draft").length;
      const sent = invoices.filter((x) => x.status === "sent").length;

      setStats([
        { label: "Invoices", value: String(totalInvoices), hint: "All time" },
        { label: "Drafts", value: String(drafts), hint: "Not sent yet" },
        { label: "Sent", value: String(sent), hint: "Delivered" },
        { label: "Clients", value: String(clients.length), hint: "Saved" },
      ]);

      setRecent(invoices.slice(0, 5));
      setLoading(false);
    })();
  }, []);

  const headerText = useMemo(() => {
    return activationNeeded
      ? "Activate your profile"
      : "Welcome back";
  }, [activationNeeded]);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-28 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-fuchsia-500/18 blur-3xl" />
          <div className="absolute bottom-[-160px] right-[-120px] h-[420px] w-[420px] rounded-full bg-indigo-500/16 blur-3xl" />
        </div>

        <div className="relative">
          <div className="text-xs uppercase tracking-wider text-neutral-400">
            Factyo workspace
          </div>
          <h1 className="mt-2 text-2xl font-semibold md:text-3xl">{headerText}</h1>
          <p className="mt-2 max-w-2xl text-sm text-neutral-300">
            Create clean EU-style invoices, send faster, and keep everything organized.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <PrimaryButton href="/invoices/new">Create invoice</PrimaryButton>
            <SecondaryButton href="/clients">Manage clients</SecondaryButton>
          </div>

          {activationNeeded ? (
            <div className="mt-6 rounded-2xl border border-fuchsia-500/25 bg-fuchsia-500/10 px-4 py-3 text-sm text-neutral-100">
              Add company details to show correct header and payment info on invoices.
              <Link href="/settings/company" className="ml-2 text-fuchsia-200 hover:underline">
                Activate profile
              </Link>
            </div>
          ) : null}
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <div className="h-4 w-24 rounded bg-white/10" />
                <div className="mt-4 h-8 w-16 rounded bg-white/10" />
                <div className="mt-3 h-3 w-28 rounded bg-white/10" />
              </Card>
            ))
          : stats.map((s) => (
              <Card key={s.label}>
                <div className="text-sm text-neutral-300">{s.label}</div>
                <div className="mt-3 text-3xl font-semibold">{s.value}</div>
                {s.hint ? <div className="mt-2 text-xs text-neutral-500">{s.hint}</div> : null}
              </Card>
            ))}
      </div>

      {/* Recent invoices */}
      <Card>
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-sm font-semibold">Recent invoices</div>
            <div className="mt-1 text-xs text-neutral-400">Quick access to your latest work</div>
          </div>
          <Link href="/invoices" className="text-sm text-fuchsia-200 hover:underline">
            View all
          </Link>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
          <div className="grid grid-cols-12 gap-2 bg-white/5 px-4 py-3 text-xs text-neutral-400">
            <div className="col-span-5">Client</div>
            <div className="col-span-3">Status</div>
            <div className="col-span-4 text-right">Total</div>
          </div>

          {recent.length === 0 ? (
            <div className="px-4 py-10 text-sm text-neutral-300">
              No invoices yet. Create your first invoice.
              <Link href="/invoices/new" className="ml-2 text-fuchsia-200 hover:underline">
                Create invoice
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {recent.map((inv) => (
                <Link
                  key={inv.id}
                  href={`/invoices/${inv.id}`}
                  className="grid grid-cols-12 items-center gap-2 px-4 py-4 hover:bg-white/5"
                >
                  <div className="col-span-5">
                    <div className="text-sm font-medium">{inv.clientName ?? "Client"}</div>
                    <div className="mt-1 text-xs text-neutral-400">
                      {inv.invoiceNumber ?? inv.id}
                    </div>
                  </div>
                  <div className="col-span-3">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-200">
                      {inv.status ?? "draft"}
                    </span>
                  </div>
                  <div className="col-span-4 text-right text-sm font-semibold">
                    {formatMoney(inv.total ?? computeTotal(inv.items))}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

function computeTotal(items: any[] | undefined) {
  const arr = items ?? [];
  return arr.reduce((sum, it) => sum + Number(it.total ?? it.amount ?? (it.quantity ?? 0) * (it.unitPrice ?? 0)), 0);
}

function formatMoney(n: number) {
  try {
    return new Intl.NumberFormat("en-NL", { style: "currency", currency: "EUR" }).format(n || 0);
  } catch {
    return `€${(n || 0).toFixed(2)}`;
  }
}
