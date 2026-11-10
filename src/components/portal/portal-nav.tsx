"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  CalendarDays,
  CreditCard,
  Home,
  LogOut,
  Package,
  Users,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useCurrentUser } from "@/hooks/use-demo";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";

const items = [
  { href: "/portal", label: "Dashboard", icon: Home },
  { href: "/portal/classes", label: "Classes", icon: CalendarDays },
  { href: "/portal/children", label: "Children", icon: Users },
  { href: "/portal/programmes", label: "Programmes", icon: Package },
  { href: "/portal/history", label: "History", icon: CreditCard },
  { href: "/portal/notifications", label: "Alerts", icon: Bell },
];

export function PortalNav() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useCurrentUser();
  const notifications = useAppStore((s) => s.notifications);
  const logout = useAppStore((s) => s.logout);
  const unread = useMemo(
    () =>
      user
        ? notifications.filter((n) => n.userId === user.id && !n.read).length
        : 0,
    [user, notifications]
  );

  return (
    <aside className="border-b border-white/8 bg-[#0b0d10]/90 lg:sticky lg:top-[7.5rem] lg:h-[calc(100vh-8.5rem)] lg:w-64 lg:border-b-0 lg:border-r lg:pr-4">
      <div className="flex items-center justify-between gap-3 px-4 py-4 lg:flex-col lg:items-stretch">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-white/40">Parent portal</p>
          <p className="font-semibold text-white">{user?.name}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="lg:justify-start"
          onClick={() => {
            logout();
            router.push("/");
          }}
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sign out</span>
        </Button>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-2 pb-3 scrollbar-thin lg:flex-col lg:overflow-visible lg:px-2">
        {items.map((item) => {
          const active =
            item.href === "/portal"
              ? pathname === "/portal"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition",
                active
                  ? "bg-[var(--accent)] text-[var(--accent-ink)]"
                  : "text-white/65 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {item.href.includes("notifications") && unread > 0 && (
                <span className="ml-auto rounded-md bg-black/15 px-1.5 text-[10px] font-bold">
                  {unread}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
