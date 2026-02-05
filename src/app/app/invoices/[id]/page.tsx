// src/app/app/invoices/[id]/page.tsx
import { TopNav } from "@/components/layout/TopNav";

export default async function InvoicePreviewPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return (
        <div>
            <TopNav />
            <main className="mx-auto w-full max-w-3xl px-4 py-10">
                <h1 className="text-2xl font-semibold">Invoice Preview</h1>
                <p className="mt-2 text-neutral-400">Invoice id: {id}</p>
                <p className="mt-6 text-neutral-300">
                    Step 3 da bu yerda preview UI + “Send (fake)” bo‘ladi.
                </p>
            </main>
        </div>
    );
}
