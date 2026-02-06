"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { invoiceRepo } from "@/repositories/invoice/invoiceRepo";

function Badge({ value }: { value: string }) {
  const tone =
    value === "sent"
      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-100"
      : "border-white/10 bg-white/5 text-neutral-200";
  return <span className={`rounded-full border px-3 py-1 text-xs ${tone}`}>{value}</span>;
}

export default function InvoicesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    invoiceRepo.list().then(setItems);
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((x) => {
      const a = String(x.clientName ?? "").toLowerCase();
      const b = String(x.invoiceNumber ?? x.id ?? "").toLowerCase();
      return a.includes(s) || b.includes(s);
    });
  }, [items, q]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Invoices</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Create, send, and track invoices.
          </p>
        </div>

        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search client or invoice number"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-fuchsia-500/30 md:w-[320px]"
          />
          <Link
            href="/invoices/new"
            className="rounded-2xl bg-fuchsia-500 px-5 py-3 text-sm font-medium text-white hover:bg-fuchsia-400"
          >
            New invoice
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
        <div className="grid grid-cols-12 gap-2 border-b border-white/10 bg-white/5 px-5 py-3 text-xs text-neutral-400">
          <div className="col-span-5">Client</div>
          <div className="col-span-3">Status</div>
          <div className="col-span-2">Due</div>
          <div className="col-span-2 text-right">Total</div>
        </div>

        {filtered.length === 0 ? (
          <div className="px-5 py-12 text-sm text-neutral-300">
            No invoices found.{" "}
            <Link href="/invoices/new" className="text-fuchsia-200 hover:underline">
              Create one
            </Link>
            .
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {filtered.map((inv) => (
              <Link
                key={inv.id}
                href={`/invoices/${inv.id}`}
                className="grid grid-cols-12 items-center gap-2 px-5 py-4 hover:bg-white/5"
              >
                <div className="col-span-5">
                  <div className="text-sm font-medium">{inv.clientName ?? "Client"}</div>
                  <div className="mt-1 text-xs text-neutral-400">
                    {inv.invoiceNumber ?? inv.id}
                  </div>
                </div>
                <div className="col-span-3">
                  <Badge value={inv.status ?? "draft"} />
                </div>
                <div className="col-span-2 text-sm text-neutral-200">
                  {inv.dueDate ? formatDate(inv.dueDate) : "-"}
                </div>
                <div className="col-span-2 text-right text-sm font-semibold">
                  {formatMoney(inv.total ?? computeTotal(inv.items))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
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

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-NL", { year: "numeric", month: "short", day: "2-digit" }).format(new Date(iso));
  } catch {
    return iso;
  }
}
