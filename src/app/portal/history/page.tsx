"use client";

import { toast } from "sonner";
import { Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { useParentData } from "@/hooks/use-demo";
import { useAppStore } from "@/lib/store";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";

export default function HistoryPage() {
  const { bookings, payments, children, classes } = useParentData();
  const cancelBooking = useAppStore((s) => s.cancelBooking);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">Records</p>
        <h1 className="font-display text-4xl text-white">Booking & payments</h1>
      </div>

      <section className="space-y-4">
        <h2 className="font-display text-3xl text-white">Bookings</h2>
        {bookings.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="No bookings yet"
            description="Once you book a class, it will appear here with payment status."
          />
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => {
              const child = children.find((c) => c.id === b.childId);
              const session = classes.find((c) => c.id === b.classId);
              return (
                <Card
                  key={b.id}
                  className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-white">
                      {session?.title ?? "Session"} · {child?.firstName}
                    </p>
                    <p className="text-sm text-white/50">
                      {session
                        ? `${formatDate(session.date)} · ${formatTime(session.startTime)}`
                        : "Class removed"}{" "}
                      · {formatCurrency(b.amount)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      tone={
                        b.status === "confirmed"
                          ? "success"
                          : b.status === "cancelled"
                            ? "danger"
                            : "mute"
                      }
                    >
                      {b.status}
                    </Badge>
                    <Badge tone="info">{b.paymentStatus}</Badge>
                    {b.status === "confirmed" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          cancelBooking(b.id);
                          toast.message("Booking cancelled");
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-3xl text-white">Payments</h2>
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/5 text-xs uppercase tracking-[0.12em] text-white/40">
              <tr>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-t border-white/8">
                  <td className="px-4 py-3 text-white">{p.description}</td>
                  <td className="px-4 py-3 text-white/55">
                    {p.method}
                    {p.last4 ? ` ·••• ${p.last4}` : ""}
                  </td>
                  <td className="px-4 py-3 text-white/55">
                    {formatDate(p.createdAt.slice(0, 10))}
                  </td>
                  <td className="px-4 py-3 font-semibold text-white">
                    {formatCurrency(p.amount)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone="success">{p.status}</Badge>
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-white/45">
                    No payments recorded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
