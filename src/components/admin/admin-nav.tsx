"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  CalendarDays,
  ClipboardCheck,
  LogOut,
  MapPin,
  Ticket,
  UserRound,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { useCurrentUser } from "@/hooks/use-demo";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Analytics", icon: BarChart3 },
  { href: "/admin/classes", label: "Classes", icon: CalendarDays },
  { href: "/admin/trainers", label: "Trainers", icon: UserRound },
  { href: "/admin/locations", label: "Locations", icon: MapPin },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/attendance", label: "Attendance", icon: ClipboardCheck },
  { href: "/admin/bookings", label: "Bookings", icon: Ticket },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useCurrentUser();
  const logout = useAppStore((s) => s.logout);

  return (
    <aside className="border-b border-white/8 bg-[#0b0d10]/90 lg:sticky lg:top-[7.5rem] lg:h-[calc(100vh-8.5rem)] lg:w-64 lg:border-b-0 lg:border-r lg:pr-4">
      <div className="flex items-center justify-between gap-3 px-4 py-4 lg:flex-col lg:items-stretch">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-white/40">Admin</p>
          <p className="font-semibold text-white">{user?.name}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            logout();
            router.push("/");
          }}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-2 pb-3 scrollbar-thin lg:flex-col">
        {items.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
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
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
