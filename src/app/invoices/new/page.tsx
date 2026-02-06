"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { invoiceRepo } from "@/repositories/invoice/invoiceRepo";
import { clientRepo } from "@/repositories/client/clientRepo";
import { companyRepo } from "@/repositories/company/companyRepo";

type LineItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
};

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

export default function NewInvoicePage() {
  const router = useRouter();

  const [company, setCompany] = useState<any | null>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [clientId, setClientId] = useState<string>("");

  const [invoiceNumber, setInvoiceNumber] = useState<string>("#" + String(Math.floor(1000 + Math.random() * 9000)));
  const [issueDate, setIssueDate] = useState<string>(todayISO());
  const [dueDate, setDueDate] = useState<string>(addDaysISO(14));

  const [items, setItems] = useState<LineItem[]>([
    { id: uid("li"), description: "Service Design Work", quantity: 15, unitPrice: 50 },
  ]);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const c = await companyRepo.get();
      setCompany(c);
      const list = await clientRepo.list();
      setClients(list);
      if (list[0]?.id) setClientId(list[0].id);
    })();
  }, []);

  const selectedClient = useMemo(() => clients.find((c) => c.id === clientId) ?? null, [clients, clientId]);

  const subtotal = useMemo(() => items.reduce((s, it) => s + it.quantity * it.unitPrice, 0), [items]);
  const vat = 0;
  const total = subtotal + vat;

  function updateItem(id: string, patch: Partial<LineItem>) {
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  }

  function addItem() {
    setItems((prev) => [...prev, { id: uid("li"), description: "New item", quantity: 1, unitPrice: 0 }]);
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((x) => x.id !== id));
  }

  async function saveDraft() {
    if (!selectedClient) return;
    setSaving(true);
    try {
      const payload: any = {
        id: uid("inv"),
        status: "draft",
        clientId: selectedClient.id,
        clientName: selectedClient.name,
        clientEmail: selectedClient.email,
        invoiceNumber,
        issueDate,
        dueDate,
        items: items.map((x) => ({ ...x, total: x.quantity * x.unitPrice })),
        subtotal,
        vat,
        total,
        createdAt: new Date().toISOString(),
      };

      const saved = await invoiceRepo.create(payload);
      router.push(`/invoices/${saved.id}`);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Create invoice</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Build a clean invoice and preview it live.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={saveDraft}
            disabled={saving || !selectedClient}
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-neutral-100 hover:bg-white/10 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save draft"}
          </button>
          <button
            onClick={saveDraft}
            disabled={saving || !selectedClient}
            className="rounded-2xl bg-fuchsia-500 px-5 py-3 text-sm font-medium text-white hover:bg-fuchsia-400 disabled:opacity-60"
          >
            Send invoice
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* LEFT: form */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
          <div className="text-sm font-semibold">Invoice details</div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Field label="Client">
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="input"
              >
                {clients.length === 0 ? <option value="">No clients</option> : null}
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Invoice number">
              <input className="input" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
            </Field>

            <Field label="Issue date">
              <input className="input" type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
            </Field>

            <Field label="Due date">
              <input className="input" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </Field>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <div className="text-sm font-semibold">Line items</div>
            <button
              onClick={addItem}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-neutral-100 hover:bg-white/10"
            >
              Add item
            </button>
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
            <div className="grid grid-cols-12 gap-2 bg-white/5 px-4 py-3 text-xs text-neutral-400">
              <div className="col-span-6">Description</div>
              <div className="col-span-2">Hours</div>
              <div className="col-span-2">Rate</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            <div className="divide-y divide-white/10">
              {items.map((it) => (
                <div key={it.id} className="grid grid-cols-12 items-center gap-2 px-4 py-3">
                  <div className="col-span-6">
                    <input
                      className="input compact"
                      value={it.description}
                      onChange={(e) => updateItem(it.id, { description: e.target.value })}
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      className="input compact"
                      type="number"
                      value={it.quantity}
                      onChange={(e) => updateItem(it.id, { quantity: Number(e.target.value) })}
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      className="input compact"
                      type="number"
                      value={it.unitPrice}
                      onChange={(e) => updateItem(it.id, { unitPrice: Number(e.target.value) })}
                    />
                  </div>
                  <div className="col-span-2 text-right text-sm font-semibold">
                    {formatMoney(it.quantity * it.unitPrice)}
                  </div>

                  <div className="col-span-12 flex justify-end">
                    {items.length > 1 ? (
                      <button
                        onClick={() => removeItem(it.id)}
                        className="text-xs text-neutral-400 hover:text-neutral-200"
                      >
                        Remove
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <div className="w-full max-w-xs space-y-2 text-sm">
              <Row label="Subtotal" value={formatMoney(subtotal)} />
              <Row label="VAT (0%)" value={formatMoney(vat)} />
              <div className="h-px w-full bg-white/10" />
              <Row strong label="Total" value={formatMoney(total)} />
            </div>
          </div>
        </div>

        {/* RIGHT: preview */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
          <InvoicePreview
            company={company}
            client={selectedClient}
            invoiceNumber={invoiceNumber}
            issueDate={issueDate}
            dueDate={dueDate}
            items={items}
            total={total}
          />
        </div>
      </div>

      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 1rem;
          border: 1px solid rgba(255,255,255,0.10);
          background: rgba(0,0,0,0.22);
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          color: white;
          outline: none;
        }
        .input:focus { box-shadow: 0 0 0 2px rgba(217,70,239,0.35); }
        .input.compact { padding: 0.6rem 0.8rem; border-radius: 0.9rem; }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-sm text-neutral-300">{label}</div>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div className={strong ? "font-semibold" : "text-neutral-300"}>{label}</div>
      <div className={strong ? "font-semibold" : "text-neutral-200"}>{value}</div>
    </div>
  );
}

function InvoicePreview({
  company,
  client,
  invoiceNumber,
  issueDate,
  dueDate,
  items,
  total,
}: {
  company: any;
  client: any;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  items: { description: string; quantity: number; unitPrice: number }[];
  total: number;
}) {
  return (
    <div className="mx-auto w-full max-w-[520px] overflow-hidden rounded-2xl border border-white/10 bg-white text-neutral-900">
      <div className="p-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="text-xl font-semibold tracking-wide text-fuchsia-600">FACTYO</div>
            <div className="mt-6 text-sm font-semibold">{client?.name ?? "Client"}</div>
            <div className="text-sm text-neutral-600">{client?.address ?? ""}</div>
          </div>

          <div className="text-right">
            <div className="text-xs text-neutral-500">INVOICE</div>
            <div className="text-sm font-semibold">{invoiceNumber}</div>
            <div className="mt-2 text-xs text-neutral-500">Date</div>
            <div className="text-sm">{prettyDate(issueDate)}</div>
          </div>
        </div>

        <div className="mt-6 h-px w-full bg-neutral-200" />

        <div className="mt-5 grid grid-cols-12 gap-2 text-xs text-neutral-500">
          <div className="col-span-7">Service</div>
          <div className="col-span-2 text-right">Hours</div>
          <div className="col-span-3 text-right">Total</div>
        </div>

        <div className="mt-2 divide-y divide-neutral-200">
          {items.map((it, idx) => (
            <div key={idx} className="grid grid-cols-12 items-center gap-2 py-3 text-sm">
              <div className="col-span-7 font-medium">{it.description}</div>
              <div className="col-span-2 text-right text-neutral-700">{it.quantity}</div>
              <div className="col-span-3 text-right font-semibold">
                {formatMoney(it.quantity * it.unitPrice)}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <div className="w-full max-w-xs">
            <div className="flex items-center justify-between text-sm">
              <div className="text-neutral-600">Total Due</div>
              <div className="text-lg font-semibold">{formatMoney(total)}</div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-xs text-neutral-600">
          <div className="font-semibold">Payment Due: {prettyDate(dueDate)}</div>
          <div className="mt-2">Please make payment to the account details below. Thank you.</div>
        </div>

        <div className="mt-4 rounded-xl bg-fuchsia-50 p-4 text-xs">
          <div className="grid gap-2 md:grid-cols-2">
            <div>
              <div className="text-neutral-500">Billed From</div>
              <div className="mt-1 font-semibold">{company?.legalName ?? "Your company"}</div>
              <div className="text-neutral-600">
                {company ? `${company.addressLine1}, ${company.city}` : "Add company details in Settings"}
              </div>
              {company?.vatId ? <div className="text-neutral-600">VAT: {company.vatId}</div> : null}
            </div>
            <div>
              <div className="text-neutral-500">Payment</div>
              {company?.iban ? <div className="mt-1 text-neutral-700">IBAN: {company.iban}</div> : <div className="mt-1 text-neutral-700">IBAN: -</div>}
              {company?.kvk ? <div className="text-neutral-700">KVK: {company.kvk}</div> : null}
            </div>
          </div>
        </div>

        <div className="mt-4 text-xs text-neutral-500">hello@factyo.com</div>
      </div>
    </div>
  );
}

function todayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function addDaysISO(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function prettyDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-NL", { year: "numeric", month: "short", day: "2-digit" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function formatMoney(n: number) {
  try {
    return new Intl.NumberFormat("en-NL", { style: "currency", currency: "EUR" }).format(n || 0);
  } catch {
    return `€${(n || 0).toFixed(2)}`;
  }
}
