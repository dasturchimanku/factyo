import { TopNav } from "@/components/layout/TopNav";
import { InvoiceForm } from "@/components/invoices/InvoiceForm";

export default function NewInvoicePage() {
    return (
        <div>
            <TopNav />
            <main className="mx-auto w-full max-w-4xl px-4 py-10">
                <h1 className="text-2xl font-semibold">Create Invoice</h1>
                <p className="mt-2 text-neutral-400">
                    Fake data + localStorage. Backend later.
                </p>

                <InvoiceForm />
            </main>
        </div>
    );
}
