"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Select, Label } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useParentData } from "@/hooks/use-demo";
import { useAppStore } from "@/lib/store";
import { ageFromDob, formatCurrency, formatDate, formatTime } from "@/lib/utils";

export default function BookClassPage() {
  const params = useParams<{ classId: string }>();
  const router = useRouter();
  const classId = params.classId;
  const { children, locations, trainers } = useParentData();
  const session = useAppStore((s) => s.classes.find((c) => c.id === classId));

  const eligible = useMemo(() => {
    if (!session) return [];
    return children.filter((c) => {
      const age = ageFromDob(c.dateOfBirth);
      return age >= session.ageMin && age <= session.ageMax;
    });
  }, [children, session]);

  const [childId, setChildId] = useState("");
  const selectedChildId = childId || eligible[0]?.id || "";

  if (!session) {
    return (
      <Card>
        <CardTitle>Class not found</CardTitle>
        <p className="mt-2 text-sm text-white/50">This session may have been removed.</p>
        <Link href="/portal/classes" className="mt-4 inline-block">
          <Button>Back to classes</Button>
        </Link>
      </Card>
    );
  }

  const location = locations.find((l) => l.id === session.locationId);
  const trainer = trainers.find((t) => t.id === session.trainerId);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
          Booking · Step 1 of 2
        </p>
        <h1 className="font-display text-4xl text-white">Choose your athlete</h1>
      </div>

      <Card>
        <div className="flex flex-wrap gap-2">
          <Badge tone="accent">{session.level}</Badge>
          <Badge tone="mute">
            Ages {session.ageMin}–{session.ageMax}
          </Badge>
        </div>
        <h2 className="mt-3 font-display text-3xl text-white">{session.title}</h2>
        <p className="mt-2 text-sm text-white/55">
          {formatDate(session.date)} · {formatTime(session.startTime)}–{formatTime(session.endTime)}
          <br />
          {location?.name} · Coach {trainer?.name}
        </p>
        <p className="mt-4 font-display text-3xl text-[var(--accent)]">
          {formatCurrency(session.price)}
        </p>
      </Card>

      <Card>
        <CardTitle>Select child</CardTitle>
        {eligible.length === 0 ? (
          <div className="mt-4 space-y-3">
            <p className="text-sm text-white/55">
              No child profiles match this class age range. Add or update a profile first.
            </p>
            <Link href="/portal/children">
              <Button>Manage children</Button>
            </Link>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            <div>
              <Label>Child</Label>
              <Select
                value={selectedChildId}
                onChange={(e) => setChildId(e.target.value)}
              >
                {eligible.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.firstName} {c.lastName} (age {ageFromDob(c.dateOfBirth)})
                  </option>
                ))}
              </Select>
            </div>
            <Button
              className="w-full"
              disabled={!selectedChildId}
              onClick={() => {
                if (!selectedChildId) {
                  toast.error("Select a child");
                  return;
                }
                router.push(
                  `/portal/checkout?classId=${session.id}&childId=${selectedChildId}`
                );
              }}
            >
              Continue to checkout
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
