"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { useParentData } from "@/hooks/use-demo";
import { useAppStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";

export default function NotificationsPage() {
  const { userId, notifications } = useParentData();
  const markRead = useAppStore((s) => s.markNotificationRead);
  const markAll = useAppStore((s) => s.markAllNotificationsRead);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">Inbox</p>
          <h1 className="font-display text-4xl text-white">Notifications</h1>
          <p className="mt-2 text-sm text-white/50">
            Booking confirmations, class reminders and renewal alerts.
          </p>
        </div>
        <Button variant="secondary" onClick={() => markAll(userId)}>
          Mark all read
        </Button>
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="You're all caught up"
          description="Confirmations and renewal reminders will land here."
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <Card
              key={n.id}
              className={n.read ? "opacity-70" : "border-[var(--accent)]/25"}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={n.read ? "mute" : "accent"}>
                      {n.type.split("_").join(" ")}
                    </Badge>
                    {!n.read && <Badge tone="info">New</Badge>}
                  </div>
                  <h3 className="mt-2 font-semibold text-white">{n.title}</h3>
                  <p className="mt-1 text-sm text-white/55">{n.message}</p>
                  <p className="mt-2 text-xs text-white/35">
                    {formatDate(n.createdAt.slice(0, 10), "d MMM yyyy")}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!n.read && (
                    <Button size="sm" variant="ghost" onClick={() => markRead(n.id)}>
                      Mark read
                    </Button>
                  )}
                  {n.href && (
                    <Link href={n.href}>
                      <Button size="sm" variant="secondary" onClick={() => markRead(n.id)}>
                        Open
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
