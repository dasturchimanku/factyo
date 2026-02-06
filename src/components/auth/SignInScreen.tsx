"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { localSignIn } from "@/lib/auth/localAuth";

export function SignInScreen() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") ?? "/dashboard";

  const [email, setEmail] = useState("demo@factyo.com");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (!email.includes("@")) throw new Error("Enter a valid email.");
      await localSignIn({ email });
      router.push(next);
      router.refresh();
    } catch (err: any) {
      setError(err?.message ?? "Sign in failed");
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Welcome back</h1>
      <p className="mt-1 text-sm text-neutral-300">Sign in to manage invoices.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="text-sm text-neutral-300">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-2xl border border-white/10 bg-neutral-950/50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-fuchsia-500/40"
            placeholder="you@company.com"
          />
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        <button
          disabled={loading}
          className="w-full rounded-2xl bg-fuchsia-500 px-4 py-3 text-sm font-medium hover:bg-fuchsia-400 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <p className="text-center text-sm text-neutral-300">
          Don’t have an account?{" "}
          <Link className="text-fuchsia-200 hover:underline" href="/sign-up">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
