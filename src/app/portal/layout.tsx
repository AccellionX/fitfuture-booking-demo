"use client";

import Link from "next/link";
import { AuthGuard } from "@/components/shared/auth-guard";
import { PortalNav } from "@/components/portal/portal-nav";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard role="parent">
      <div className="min-h-screen">
        <div className="border-b border-white/8 bg-[#070809]/90">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent)] font-display text-lg text-[var(--accent-ink)]">
                FF
              </span>
              <div>
                <p className="font-display text-xl text-white">FFTA Parent</p>
                <p className="text-[10px] uppercase tracking-[0.16em] text-white/40">
                  Booking demo
                </p>
              </div>
            </Link>
            <Link href="/portal/classes" className="text-sm text-[var(--accent)]">
              Browse classes →
            </Link>
          </div>
        </div>
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:px-8">
          <PortalNav />
          <div className="min-w-0 flex-1 pb-10">{children}</div>
        </div>
      </div>
    </AuthGuard>
  );
}
