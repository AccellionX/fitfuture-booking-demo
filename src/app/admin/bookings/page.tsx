"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";

export default function AdminBookingsPage() {
  const bookings = useAppStore((s) => s.bookings);
  const children = useAppStore((s) => s.children);
  const users = useAppStore((s) => s.users);
  const classes = useAppStore((s) => s.classes);
  const payments = useAppStore((s) => s.payments);

  const revenue = payments
    .filter((p) => p.status === "paid")
    .reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
            Reservations
          </p>
          <h1 className="font-display text-4xl text-white">Bookings</h1>
        </div>
        <Card className="py-3">
          <p className="text-xs uppercase tracking-[0.14em] text-white/40">Paid revenue</p>
          <p className="font-display text-3xl text-[var(--accent)]">
            {formatCurrency(revenue)}
          </p>
        </Card>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-[0.12em] text-white/40">
            <tr>
              <th className="px-4 py-3">Session</th>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Parent</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => {
              const child = children.find((c) => c.id === b.childId);
              const parent = users.find((u) => u.id === b.parentId);
              const session = classes.find((c) => c.id === b.classId);
              return (
                <tr key={b.id} className="border-t border-white/8">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-white">{session?.title ?? "—"}</p>
                    <p className="text-xs text-white/40">
                      {session
                        ? `${formatDate(session.date)} · ${formatTime(session.startTime)}`
                        : "Removed"}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-white/70">{child?.firstName}</td>
                  <td className="px-4 py-3 text-white/70">{parent?.name}</td>
                  <td className="px-4 py-3 text-white">{formatCurrency(b.amount)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      <Badge
                        tone={
                          b.status === "cancelled"
                            ? "danger"
                            : b.status === "confirmed"
                              ? "success"
                              : "mute"
                        }
                      >
                        {b.status}
                      </Badge>
                      <Badge tone="info">{b.paymentStatus}</Badge>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
