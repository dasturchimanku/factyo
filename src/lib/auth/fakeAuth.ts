export type FakeUser = { id: string; email: string; name?: string };

const KEY = "factyo_auth_v1";

function isBrowser() {
    return typeof window !== "undefined";
}
function uid() {
    return `usr_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

export function getUser(): FakeUser | null {
    if (!isBrowser()) return null;
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as FakeUser) : null;
}

export function signIn(email: string): FakeUser {
    const user: FakeUser = { id: uid(), email };
    if (isBrowser()) window.localStorage.setItem(KEY, JSON.stringify(user));
    return user;
}

export function signUp(name: string, email: string): FakeUser {
    const user: FakeUser = { id: uid(), name, email };
    if (isBrowser()) window.localStorage.setItem(KEY, JSON.stringify(user));
    return user;
}

export function signOut() {
    if (isBrowser()) window.localStorage.removeItem(KEY);
}
