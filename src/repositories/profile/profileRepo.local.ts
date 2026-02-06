import type { UserProfile } from "@/lib/auth/models";

const KEY = "factyo_profile_v1";

function isBrowser() {
  return typeof window !== "undefined";
}

function load(): UserProfile | null {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as UserProfile) : null;
}

function save(p: UserProfile) {
  if (!isBrowser()) return;
  localStorage.setItem(KEY, JSON.stringify(p));
}

export const profileRepoLocal = {
  async get(): Promise<UserProfile | null> {
    return load();
  },

  async create(params: { email: string; name: string }): Promise<UserProfile> {
    const existing = load();
    if (existing && existing.email === params.email) return existing;

    const profile: UserProfile = {
      id: crypto.randomUUID(),
      email: params.email.trim().toLowerCase(),
      name: params.name.trim(),
      avatarUrl: undefined,
      emailVerified: false,
      onboardingCompleted: false,
      companyId: undefined,
      createdAt: new Date().toISOString(),
    };

    save(profile);
    return profile;
  },

  async update(patch: Partial<UserProfile>): Promise<UserProfile | null> {
    const p = load();
    if (!p) return null;
    const next = { ...p, ...patch };
    save(next);
    return next;
  },

  async clear() {
    if (!isBrowser()) return;
    localStorage.removeItem(KEY);
  },
};
