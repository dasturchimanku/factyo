export function uid(prefix: string) {
    return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

export function makeInvoiceNumber() {
    return `#${Math.floor(1000 + Math.random() * 9000)}`;
}

export function round2(n: number) {
    return Math.round(n * 100) / 100;
}
