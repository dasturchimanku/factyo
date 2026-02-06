import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";

export const metadata: Metadata = {
    title: "Factyo — Modern invoicing",
    description:
        "Modern invoicing for freelancers and sole proprietors in Europe.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="min-h-screen bg-neutral-950 text-neutral-50 antialiased">
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
