import { getUser } from "./fakeAuth";

export function requireUser() {
    const u = getUser();
    return u;
}
