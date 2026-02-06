"use client";

import { usePathname } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";

function isAppRoute(pathname: string) {
  return (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/invoices") ||
    pathname.startsWith("/clients") ||
    pathname.startsWith("/settings")
  );
}

export function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (!isAppRoute(pathname)) return <>{children}</>;
  return <AppShell>{children}</AppShell>;
}
