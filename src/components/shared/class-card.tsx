"use client";

import Link from "next/link";
import { Clock, MapPin, Users } from "lucide-react";
import type { ClassSession, Location, Trainer } from "@/lib/types";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ClassCard({
  session,
  location,
  trainer,
  href,
  actionLabel = "Book",
}: {
  session: ClassSession;
  location?: Location;
  trainer?: Trainer;
  href?: string;
  actionLabel?: string;
}) {
  const spots = session.capacity - session.enrolled;
  const full = spots <= 0;

  return (
    <article className="flex flex-col rounded-2xl border border-white/10 bg-[var(--bg-elevated)] p-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="accent">{session.level}</Badge>
        <Badge tone="mute">
          Ages {session.ageMin}–{session.ageMax}
        </Badge>
        {full ? <Badge tone="danger">Full</Badge> : <Badge tone="success">{spots} spots</Badge>}
      </div>
      <h3 className="mt-3 font-display text-2xl text-white">{session.title}</h3>
      <p className="mt-1 text-sm text-white/50">{session.description}</p>
      <div className="mt-4 space-y-2 text-sm text-white/70">
        <p className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-[var(--accent)]" />
          {formatDate(session.date)} · {formatTime(session.startTime)}–{formatTime(session.endTime)}
        </p>
        <p className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-[var(--accent)]" />
          {location?.name ?? session.locationId}
        </p>
        <p className="flex items-center gap-2">
          <Users className="h-4 w-4 text-[var(--accent)]" />
          {trainer?.name ?? "Coach"} · {session.enrolled}/{session.capacity}
        </p>
      </div>
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/8 pt-4">
        <p className="font-display text-2xl text-white">{formatCurrency(session.price)}</p>
        {href ? (
          <Link href={full ? "#" : href}>
            <Button disabled={full} size="sm">
              {full ? "Waitlist soon" : actionLabel}
            </Button>
          </Link>
        ) : null}
      </div>
    </article>
  );
}
