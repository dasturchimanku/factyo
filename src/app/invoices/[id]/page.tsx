"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { invoiceRepo } from "@/repositories/invoice/invoiceRepo";

export default function InvoiceDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [inv, setInv] = useState<any | null>(null);

  useEffect(() => {
    invoiceRepo.get(id).then(setInv);
  }, [id]);

  async function markSent() {
    await invoiceRepo.markSent(id);
    const updated = await invoiceRepo.get(id);
    setInv(updated);
  }

  if (!inv) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        Loading…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{inv.invoiceNumber ?? inv.id}</h1>
          <p className="mt-1 text-sm text-neutral-400">{inv.clientName ?? "Client"}</p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/invoices"
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-neutral-100 hover:bg-white/10"
          >
            Back
          </Link>
          <button
            onClick={markSent}
            className="rounded-2xl bg-fuchsia-500 px-5 py-3 text-sm font-medium text-white hover:bg-fuchsia-400"
          >
            Mark as sent
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-neutral-300">Status</div>
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-200">
            {inv.status ?? "draft"}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Info label="Issue date" value={inv.issueDate ?? "-"} />
          <Info label="Due date" value={inv.dueDate ?? "-"} />
          <Info label="Total" value={formatMoney(inv.total ?? 0)} strong />
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="text-sm font-semibold">Items</div>
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
          <div className="grid grid-cols-12 gap-2 bg-white/5 px-4 py-3 text-xs text-neutral-400">
            <div className="col-span-7">Description</div>
            <div className="col-span-2 text-right">Qty</div>
            <div className="col-span-3 text-right">Total</div>
          </div>
          <div className="divide-y divide-white/10">
            {(inv.items ?? []).map((it: any, i: number) => (
              <div key={i} className="grid grid-cols-12 items-center gap-2 px-4 py-3 text-sm">
                <div className="col-span-7 font-medium">{it.description}</div>
                <div className="col-span-2 text-right text-neutral-200">{it.quantity ?? it.hours ?? "-"}</div>
                <div className="col-span-3 text-right font-semibold">
                  {formatMoney(it.total ?? (it.quantity ?? 0) * (it.unitPrice ?? 0))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={() => {
              router.push("/invoices/new");
            }}
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-neutral-100 hover:bg-white/10"
          >
            Duplicate
          </button>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-neutral-950/30 p-4">
      <div className="text-xs text-neutral-400">{label}</div>
      <div className={strong ? "mt-2 text-lg font-semibold" : "mt-2 text-sm text-neutral-200"}>
        {value}
      </div>
    </div>
  );
}

function formatMoney(n: number) {
  try {
    return new Intl.NumberFormat("en-NL", { style: "currency", currency: "EUR" }).format(n || 0);
  } catch {
    return `€${(n || 0).toFixed(2)}`;
  }
}
