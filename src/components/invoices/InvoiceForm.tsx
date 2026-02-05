"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiCreateInvoice, qk } from "@/lib/fake/api";
import type { Invoice, InvoiceItem } from "@/lib/fake/db";

const itemSchema = z.object({
    description: z.string().min(2, "Description too short"),
    hours: z.coerce.number().min(0.1, "Hours required"),
    rate: z.coerce.number().min(0.01, "Rate required"),
});

const formSchema = z.object({
    clientName: z.string().min(2, "Client name required"),
    clientEmail: z.string().email("Valid email required"),
    issueDate: z.string().min(8),
    dueDate: z.string().min(8),
    items: z.array(itemSchema).min(1, "Add at least 1 item"),
});

type FormValues = z.infer<typeof formSchema>;

function uid(prefix: string) {
    return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

function calcItemTotal(hours: number, rate: number) {
    const total = hours * rate;
    return Math.round(total * 100) / 100;
}

export function InvoiceForm() {
    const router = useRouter();
    const qc = useQueryClient();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            clientName: "Acme Corp",
            clientEmail: "billing@acme.com",
            issueDate: new Date().toISOString().slice(0, 10),
            dueDate: new Date(Date.now() + 7 * 24 * 3600 * 1000)
                .toISOString()
                .slice(0, 10),
            items: [
                { description: "Service Design Work", hours: 15, rate: 50 },
            ],
        },
        mode: "onChange",
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items",
    });

    const values = form.watch();
    const computedItems = React.useMemo(() => {
        return (
            values.items?.map((it) => ({
                ...it,
                total: calcItemTotal(
                    Number(it.hours || 0),
                    Number(it.rate || 0),
                ),
            })) ?? []
        );
    }, [values.items]);

    const total = React.useMemo(() => {
        return computedItems.reduce((acc, it) => acc + (it.total || 0), 0);
    }, [computedItems]);

    const createMut = useMutation({
        mutationFn: (invoice: Invoice) => apiCreateInvoice(invoice),
        onSuccess: (inv) => {
            qc.invalidateQueries({ queryKey: qk.invoices });
            router.push(`/app/invoices/${inv.id}`);
        },
    });

    function onSubmit(v: FormValues) {
        const items: InvoiceItem[] = v.items.map((it) => ({
            id: uid("it"),
            description: it.description,
            hours: Number(it.hours),
            rate: Number(it.rate),
            total: calcItemTotal(Number(it.hours), Number(it.rate)),
        }));

        const inv: Invoice = {
            id: uid("inv"),
            number: `#${Math.floor(1000 + Math.random() * 9000)}`,
            clientName: v.clientName,
            clientEmail: v.clientEmail,
            issueDate: v.issueDate,
            dueDate: v.dueDate,
            currency: "EUR",
            items,
            total: Math.round(total * 100) / 100,
            status: "draft",
            createdAt: new Date().toISOString(),
        };

        createMut.mutate(inv);
    }

    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6"
        >
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="text-sm text-neutral-300">
                        Client name
                    </label>
                    <input
                        className="mt-1 w-full rounded-xl border border-white/10 bg-neutral-950/50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-fuchsia-500/40"
                        {...form.register("clientName")}
                    />
                    {form.formState.errors.clientName && (
                        <p className="mt-1 text-xs text-red-300">
                            {form.formState.errors.clientName.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="text-sm text-neutral-300">
                        Client email
                    </label>
                    <input
                        className="mt-1 w-full rounded-xl border border-white/10 bg-neutral-950/50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-fuchsia-500/40"
                        {...form.register("clientEmail")}
                    />
                    {form.formState.errors.clientEmail && (
                        <p className="mt-1 text-xs text-red-300">
                            {form.formState.errors.clientEmail.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="text-sm text-neutral-300">
                        Issue date
                    </label>
                    <input
                        type="date"
                        className="mt-1 w-full rounded-xl border border-white/10 bg-neutral-950/50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-fuchsia-500/40"
                        {...form.register("issueDate")}
                    />
                </div>

                <div>
                    <label className="text-sm text-neutral-300">Due date</label>
                    <input
                        type="date"
                        className="mt-1 w-full rounded-xl border border-white/10 bg-neutral-950/50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-fuchsia-500/40"
                        {...form.register("dueDate")}
                    />
                </div>
            </div>

            <div className="mt-8">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-neutral-100">
                        Line items
                    </h3>
                    <button
                        type="button"
                        onClick={() =>
                            append({
                                description: "New item",
                                hours: 1,
                                rate: 50,
                            })
                        }
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10"
                    >
                        + Add item
                    </button>
                </div>

                <div className="mt-3 overflow-hidden rounded-2xl border border-white/10">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/5 text-xs text-neutral-300">
                            <tr>
                                <th className="px-4 py-3">Description</th>
                                <th className="px-4 py-3 w-28">Hours</th>
                                <th className="px-4 py-3 w-32">Rate</th>
                                <th className="px-4 py-3 w-28">Total</th>
                                <th className="px-4 py-3 w-16"></th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-white/10">
                            {fields.map((f, idx) => (
                                <tr key={f.id} className="align-top">
                                    <td className="px-4 py-3">
                                        <input
                                            className="w-full rounded-xl border border-white/10 bg-neutral-950/50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-fuchsia-500/40"
                                            {...form.register(
                                                `items.${idx}.description` as const,
                                            )}
                                        />
                                        {form.formState.errors.items?.[idx]
                                            ?.description && (
                                            <p className="mt-1 text-xs text-red-300">
                                                {
                                                    form.formState.errors.items[
                                                        idx
                                                    ]?.description
                                                        ?.message as string
                                                }
                                            </p>
                                        )}
                                    </td>

                                    <td className="px-4 py-3">
                                        <input
                                            type="number"
                                            step="0.25"
                                            className="w-full rounded-xl border border-white/10 bg-neutral-950/50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-fuchsia-500/40"
                                            {...form.register(
                                                `items.${idx}.hours` as const,
                                            )}
                                        />
                                        {form.formState.errors.items?.[idx]
                                            ?.hours && (
                                            <p className="mt-1 text-xs text-red-300">
                                                {
                                                    form.formState.errors.items[
                                                        idx
                                                    ]?.hours?.message as string
                                                }
                                            </p>
                                        )}
                                    </td>

                                    <td className="px-4 py-3">
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="w-full rounded-xl border border-white/10 bg-neutral-950/50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-fuchsia-500/40"
                                            {...form.register(
                                                `items.${idx}.rate` as const,
                                            )}
                                        />
                                        {form.formState.errors.items?.[idx]
                                            ?.rate && (
                                            <p className="mt-1 text-xs text-red-300">
                                                {
                                                    form.formState.errors.items[
                                                        idx
                                                    ]?.rate?.message as string
                                                }
                                            </p>
                                        )}
                                    </td>

                                    <td className="px-4 py-3 font-medium text-neutral-200">
                                        €
                                        {(
                                            computedItems[idx]?.total ?? 0
                                        ).toFixed(2)}
                                    </td>

                                    <td className="px-4 py-3">
                                        <button
                                            type="button"
                                            onClick={() => remove(idx)}
                                            className="rounded-lg border border-white/10 px-2 py-1 text-xs text-neutral-300 hover:bg-white/10"
                                            disabled={fields.length === 1}
                                            title={
                                                fields.length === 1
                                                    ? "At least one item required"
                                                    : "Remove"
                                            }
                                        >
                                            ✕
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {form.formState.errors.items?.message && (
                    <p className="mt-2 text-xs text-red-300">
                        {form.formState.errors.items.message as string}
                    </p>
                )}

                <div className="mt-6 flex items-center justify-end gap-6">
                    <div className="text-sm text-neutral-300">Total</div>
                    <div className="text-2xl font-semibold">
                        €{total.toFixed(2)}
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3">
                    <button
                        type="submit"
                        className="rounded-xl bg-fuchsia-500 px-5 py-3 text-sm font-medium hover:bg-fuchsia-400 disabled:opacity-60"
                        disabled={createMut.isPending}
                    >
                        {createMut.isPending ? "Creating..." : "Create Invoice"}
                    </button>
                </div>
            </div>
        </form>
    );
}
