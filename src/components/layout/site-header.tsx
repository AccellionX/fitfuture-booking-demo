"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { Menu, X, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { useCurrentUser } from "@/hooks/use-demo";
import { cn } from "@/lib/utils";

const links = [
  { href: "/#programmes", label: "Programmes" },
  { href: "/#locations", label: "Locations" },
  { href: "/#why", label: "Why FFTA" },
  { href: "/#testimonials", label: "Families" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const user = useCurrentUser();
  const notifications = useAppStore((s) => s.notifications);
  const unread = useMemo(
    () =>
      user
        ? notifications.filter((n) => n.userId === user.id && !n.read).length
        : 0,
    [user, notifications]
  );

  const portalHref =
    user?.role === "admin" ? "/admin" : user ? "/portal" : "/login";

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[#070809]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent)] font-display text-lg text-[var(--accent-ink)]">
            FF
          </span>
          <span className="leading-tight">
            <span className="block font-display text-lg tracking-wide text-white">
              FFTA
            </span>
            <span className="block text-[10px] uppercase tracking-[0.18em] text-white/45">
              Booking Demo
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "text-sm text-white/60 transition hover:text-white",
                pathname === "/" && "hover:text-[var(--accent)]"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user && (
            <Link href={user.role === "admin" ? "/admin" : "/portal/notifications"}>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                {unread > 0 && (
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[var(--accent)]" />
                )}
              </Button>
            </Link>
          )}
          {user ? (
            <Link href={portalHref}>
              <Button variant="secondary" size="sm">
                {user.role === "admin" ? "Admin" : "Parent"} Portal
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="cta-glow">
                  Book a session
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-white md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/8 md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-sm text-white/75 hover:bg-white/5"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href={user ? portalHref : "/login"}
                onClick={() => setOpen(false)}
                className="mt-2"
              >
                <Button className="w-full">
                  {user ? "Open portal" : "Sign in / Book"}
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
