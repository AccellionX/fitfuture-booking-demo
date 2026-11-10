"use client";

import { useEffect } from "react";
import { Toaster } from "sonner";
import { useAppStore } from "@/lib/store";

export function Providers({ children }: { children: React.ReactNode }) {
  const hydrate = useAppStore((s) => s.hydrate);
  const hydrated = useAppStore((s) => s.hydrated);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-[var(--accent)]" />
          <p className="font-display text-2xl tracking-wide text-white">FFTA</p>
          <p className="text-sm text-white/45">Preparing booking demo…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {children}
      <Toaster
        theme="dark"
        position="top-right"
        toastOptions={{
          style: {
            background: "#12151a",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#f4f6f5",
          },
        }}
      />
    </>
  );
}
