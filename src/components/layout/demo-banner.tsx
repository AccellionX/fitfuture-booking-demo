"use client";

import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";

export function DemoBanner() {
  const resetDemo = useAppStore((s) => s.resetDemo);

  return (
    <div className="relative z-[60] border-b border-[var(--accent)]/25 bg-[var(--accent)] text-[var(--accent-ink)]">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-4 py-2 text-xs font-semibold sm:flex-row sm:items-center sm:px-6 lg:px-8">
        <p>
          Independent concept demo — not an official Fit Future Training Academy
          product. Payments are simulated. Data saves in your browser.
        </p>
        <div className="flex items-center gap-3">
          <Link href="/login" className="underline underline-offset-2">
            Demo access
          </Link>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md bg-black/10 px-2 py-1 hover:bg-black/15"
            onClick={() => {
              resetDemo();
              toast.success("Demo data reset to seed state");
            }}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset data
          </button>
        </div>
      </div>
    </div>
  );
}
