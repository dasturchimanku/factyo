export function StatusPill({ status }: { status: string }) {
    const styles: Record<string, string> = {
        draft: "bg-white/5 text-neutral-300 border-white/10",
        sent: "bg-blue-500/10 text-blue-200 border-blue-500/20",
        paid: "bg-emerald-500/10 text-emerald-200 border-emerald-500/20",
    };
    return (
        <span
            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs ${styles[status] ?? styles.draft}`}
        >
            {status.toUpperCase()}
        </span>
    );
}
