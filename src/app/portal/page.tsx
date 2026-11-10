"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, Package, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { useParentData } from "@/hooks/use-demo";
import { formatCurrency, formatDate, formatTime, isUpcoming } from "@/lib/utils";

export default function PortalDashboard() {
  const {
    children,
    bookings,
    enrolments,
    classes,
    locations,
    payments,
    packages,
    notifications,
  } = useParentData();

  const unread = notifications.filter((n) => !n.read);
  const activeEnrolments = enrolments.filter((e) => e.status !== "cancelled");

  const upcoming = bookings
    .filter((b) => b.status === "confirmed")
    .map((b) => ({ booking: b, session: classes.find((c) => c.id === b.classId) }))
    .filter((x) => x.session && isUpcoming(x.session.date, x.session.startTime))
    .sort((a, b) => (a.session!.date > b.session!.date ? 1 : -1))
    .slice(0, 4);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">Dashboard</p>
        <h1 className="font-display text-4xl text-white sm:text-5xl">Upcoming & overview</h1>
        <p className="mt-2 text-sm text-white/50">
          Manage sessions, packages and payments for your FFTA athletes.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Children", value: children.length, href: "/portal/children" },
          { label: "Upcoming", value: upcoming.length, href: "/portal/classes" },
          {
            label: "Active packages",
            value: activeEnrolments.filter(
              (e) => e.status === "active" || e.status === "renewal-due"
            ).length,
            href: "/portal/programmes",
          },
          {
            label: "Unread alerts",
            value: unread.length,
            href: "/portal/notifications",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link href={stat.href}>
              <Card className="transition hover:border-[var(--accent)]/30">
                <p className="text-xs uppercase tracking-[0.14em] text-white/40">{stat.label}</p>
                <p className="mt-2 font-display text-4xl text-white">{stat.value}</p>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Upcoming sessions</CardTitle>
              <CardDescription>Confirmed bookings across locations</CardDescription>
            </div>
            <Link href="/portal/classes">
              <Button size="sm" variant="secondary">
                Book more
              </Button>
            </Link>
          </CardHeader>
          {upcoming.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title="No upcoming sessions"
              description="Browse classes by age, location and date to book your first session."
              actionLabel="Browse classes"
              onAction={() => {
                window.location.href = "/portal/classes";
              }}
            />
          ) : (
            <div className="space-y-3">
              {upcoming.map(({ booking, session }) => {
                const child = children.find((c) => c.id === booking.childId);
                const loc = locations.find((l) => l.id === session!.locationId);
                return (
                  <div
                    key={booking.id}
                    className="flex flex-col gap-2 rounded-xl border border-white/8 bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-white">{session!.title}</p>
                      <p className="text-sm text-white/50">
                        {child?.firstName} · {formatDate(session!.date)} ·{" "}
                        {formatTime(session!.startTime)} · {loc?.name}
                      </p>
                    </div>
                    <Badge tone="success">Confirmed</Badge>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Active packages</CardTitle>
                <CardDescription>6-week programme progress</CardDescription>
              </div>
            </CardHeader>
            {activeEnrolments.length === 0 ? (
              <EmptyState
                icon={Package}
                title="No packages yet"
                description="Enrol in a structured 6-week programme for consistent progress."
              />
            ) : (
              <div className="space-y-4">
                {activeEnrolments.slice(0, 3).map((en) => {
                  const child = children.find((c) => c.id === en.childId);
                  const pkg = packages.find((p) => p.id === en.packageId);
                  return (
                    <div key={en.id}>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-white">
                          {child?.firstName} · {pkg?.name}
                        </p>
                        <Badge tone={en.status === "renewal-due" ? "warn" : "accent"}>
                          {en.status}
                        </Badge>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-[var(--accent)]"
                          style={{ width: `${en.progressPercent}%` }}
                        />
                      </div>
                      <p className="mt-1 text-xs text-white/45">
                        {en.sessionsAttended}/{en.sessionsTotal} sessions · ends{" "}
                        {formatDate(en.endDate, "d MMM")}
                      </p>
                    </div>
                  );
                })}
                <Link href="/portal/programmes">
                  <Button variant="outline" size="sm" className="w-full">
                    Manage programmes
                  </Button>
                </Link>
              </div>
            )}
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent payments</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              {payments.slice(0, 3).map((p) => (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="text-white">{p.description}</p>
                    <p className="text-xs text-white/40">{formatDate(p.createdAt.slice(0, 10))}</p>
                  </div>
                  <p className="font-semibold text-[var(--accent)]">{formatCurrency(p.amount)}</p>
                </div>
              ))}
              {payments.length === 0 && (
                <p className="text-sm text-white/45">No payments yet.</p>
              )}
            </div>
          </Card>
        </div>
      </div>

      {children.length === 0 && (
        <Card className="border-[var(--accent)]/25 bg-[var(--accent-soft)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-1 h-5 w-5 text-[var(--accent)]" />
              <div>
                <p className="font-display text-2xl text-white">Add a child profile</p>
                <p className="text-sm text-white/60">
                  You’ll need at least one athlete profile before booking classes.
                </p>
              </div>
            </div>
            <Link href="/portal/children">
              <Button>Add child</Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
