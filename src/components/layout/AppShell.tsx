"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";

const SIDEBAR_KEY = "factyo_sidebar_state_v1";
// state: "open" | "compact" | "hidden"
type SidebarState = "open" | "compact" | "hidden";

function readState(): SidebarState {
  if (typeof window === "undefined") return "open";
  const v = localStorage.getItem(SIDEBAR_KEY);
  if (v === "compact" || v === "hidden" || v === "open") return v;
  return "open";
}

function writeState(v: SidebarState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SIDEBAR_KEY, v);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sidebarState, setSidebarState] = useState<SidebarState>("open");

  useEffect(() => {
    setSidebarState(readState());
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  const desktopWidth = useMemo(() => {
    if (sidebarState === "hidden") return 0;
    if (sidebarState === "compact") return 76;
    return 280;
  }, [sidebarState]);

  function cycleDesktopState() {
    setSidebarState((prev) => {
      const next: SidebarState =
        prev === "open" ? "compact" : prev === "compact" ? "hidden" : "open";
      writeState(next);
      return next;
    });
  }

  function openSidebarFromHidden() {
    setSidebarState("open");
    writeState("open");
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50">
      {/* Desktop: sidebar (fixed) */}
      <div className="hidden md:block">
        {sidebarState === "hidden" ? null : (
          <Sidebar
            mode="desktop"
            variant={sidebarState === "compact" ? "compact" : "full"}
            onToggle={cycleDesktopState}
          />
        )}

        {/* Desktop floating open button when hidden */}
        {sidebarState === "hidden" ? (
          <button
            onClick={openSidebarFromHidden}
            className="fixed left-4 top-4 z-50 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-neutral-950/80 backdrop-blur hover:bg-white/10"
            aria-label="Open sidebar"
            title="Open sidebar"
          >
            {/* hamburger */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 6h16M4 12h16M4 18h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        ) : null}
      </div>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-neutral-950/75 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <button
            onClick={() => setDrawerOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/10"
            aria-label="Open menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <div className="flex items-center gap-2 font-semibold">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-fuchsia-500/20 text-fuchsia-200">
              F
            </span>
            <span>Factyo</span>
          </div>

          <div className="h-10 w-10 rounded-xl border border-white/10 bg-white/5" />
        </div>
      </header>

      {/* Main content */}
      <div
        className="mx-auto max-w-7xl px-4 py-6 md:px-6"
        style={{
          // IMPORTANT: paddingLeft faqat md+ da ishlasin
          paddingLeft: undefined,
        }}
      >
        <div
          className="min-w-0"
          style={{
            // md+ da sidebar joy tashlab ketadi
            marginLeft: 0,
          }}
        >
          {/* md+ margin-left dynamic */}
          <div className="md:hidden">{children}</div>

          <div
            className="hidden md:block"
            style={{
              marginLeft: desktopWidth ? desktopWidth + 24 : 0,
            }}
          >
            {children}
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {drawerOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[86%] max-w-[340px] border-r border-white/10 bg-neutral-950">
            <Sidebar
              mode="mobile"
              variant="full"
              onClose={() => setDrawerOpen(false)}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
