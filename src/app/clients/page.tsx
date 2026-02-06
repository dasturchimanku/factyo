"use client";

import { useEffect, useMemo, useState } from "react";
import { clientRepo } from "@/repositories/client/clientRepo";
import type { Client } from "@/lib/clients/models";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm text-neutral-300">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

export default function ClientsPage() {
  const [items, setItems] = useState<Client[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("NL");
  const [vatId, setVatId] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const count = useMemo(() => items.length, [items.length]);

  async function refresh() {
    const list = await clientRepo.list();
    setItems(list);
  }

  useEffect(() => {
    refresh();
  }, []);

  function openCreate() {
    setEditing(null);
    setName("");
    setEmail("");
    setAddress("");
    setCountry("NL");
    setVatId("");
    setError(null);
    setOpen(true);
  }

  function openEdit(c: Client) {
    setEditing(c);
    setName(c.name ?? "");
    setEmail(c.email ?? "");
    setAddress(c.address ?? "");
    setCountry(c.country ?? "NL");
    setVatId(c.vatId ?? "");
    setError(null);
    setOpen(true);
  }

  async function onSave() {
    setError(null);
    if (!name.trim()) return setError("Client name is required.");

    setSaving(true);
    try {
      await clientRepo.upsert({
        id: editing?.id,
        name: name.trim(),
        email: email.trim() || undefined,
        address: address.trim() || undefined,
        country,
        vatId: vatId.trim() || undefined,
      });
      setOpen(false);
      await refresh();
    } catch (e: any) {
      setError(e?.message ?? "Failed to save");
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    await clientRepo.remove(id);
    await refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Clients</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Manage your client list. ({count})
          </p>
        </div>

        <button
          onClick={openCreate}
          className="rounded-2xl bg-fuchsia-500 px-5 py-3 text-sm font-medium text-white hover:bg-fuchsia-400"
        >
          Add client
        </button>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5">
        <div className="grid grid-cols-12 gap-2 border-b border-white/10 px-5 py-3 text-xs text-neutral-400">
          <div className="col-span-5">Client</div>
          <div className="col-span-4">Email</div>
          <div className="col-span-2">Country</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {items.length === 0 ? (
          <div className="px-5 py-10 text-sm text-neutral-300">
            No clients yet. Add your first client.
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {items.map((c) => (
              <div key={c.id} className="grid grid-cols-12 items-center gap-2 px-5 py-4">
                <div className="col-span-5">
                  <div className="text-sm font-medium">{c.name}</div>
                  {c.address ? <div className="mt-1 text-xs text-neutral-400 line-clamp-1">{c.address}</div> : null}
                </div>
                <div className="col-span-4 text-sm text-neutral-200">{c.email ?? "-"}</div>
                <div className="col-span-2 text-sm text-neutral-200">{c.country ?? "-"}</div>
                <div className="col-span-1 flex justify-end gap-2">
                  <button
                    onClick={() => openEdit(c)}
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(c.id)}
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10"
                  >
                    Del
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {open ? (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />
          <div className="absolute left-1/2 top-1/2 w-[92%] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/10 bg-neutral-950 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-semibold">{editing ? "Edit client" : "Add client"}</div>
                <div className="mt-1 text-sm text-neutral-400">Client details used in invoices.</div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Field label="Name *">
                <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Acme Corp" />
              </Field>
              <Field label="Email">
                <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="billing@acme.com" />
              </Field>
              <Field label="Country">
                <select className="input" value={country} onChange={(e) => setCountry(e.target.value)}>
                  <option value="NL">Netherlands</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="ES">Spain</option>
                </select>
              </Field>
              <Field label="VAT ID">
                <input className="input" value={vatId} onChange={(e) => setVatId(e.target.value)} placeholder="Optional" />
              </Field>

              <div className="md:col-span-2">
                <Field label="Address">
                  <input className="input" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Business St, Amsterdam" />
                </Field>
              </div>
            </div>

            {error ? (
              <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            ) : null}

            <div className="mt-6 flex justify-end">
              <button
                onClick={onSave}
                disabled={saving}
                className="rounded-2xl bg-fuchsia-500 px-5 py-3 text-sm font-medium text-white hover:bg-fuchsia-400 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save"}
              </button>
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
        </div>
      ) : null}
    </div>
  );
}
