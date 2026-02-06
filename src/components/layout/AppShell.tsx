import { TopNav } from "@/components/layout/TopNav";

export function AppShell({
    title,
    subtitle,
    right,
    children,
}: {
    title: string;
    subtitle?: string;
    right?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div>
            <TopNav />
            <main className="mx-auto w-full max-w-6xl px-4 py-10">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold">{title}</h1>
                        {subtitle ? (
                            <p className="mt-1 text-sm text-neutral-400">
                                {subtitle}
                            </p>
                        ) : null}
                    </div>
                    {right}
                </div>
                <div className="mt-6">{children}</div>
            </main>
        </div>
    );
}
