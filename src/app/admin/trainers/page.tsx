"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";

export default function AdminTrainersPage() {
  const trainers = useAppStore((s) => s.trainers);
  const locations = useAppStore((s) => s.locations);
  const classes = useAppStore((s) => s.classes);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">Coaching team</p>
        <h1 className="font-display text-4xl text-white">Trainers</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {trainers.map((t) => (
          <Card key={t.id} className="overflow-hidden p-0">
            <div className="grid sm:grid-cols-[140px_1fr]">
              <img src={t.image} alt={t.name} className="h-40 w-full object-cover sm:h-full" />
              <div className="p-5">
                <h3 className="font-display text-3xl text-white">{t.name}</h3>
                <p className="text-sm text-[var(--accent)]">{t.title}</p>
                <p className="mt-2 text-sm text-white/55">{t.bio}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {t.specialties.map((s) => (
                    <Badge key={s} tone="mute">
                      {s}
                    </Badge>
                  ))}
                </div>
                <p className="mt-3 text-xs text-white/40">
                  Sites:{" "}
                  {t.locationIds
                    .map((id) => locations.find((l) => l.id === id)?.name)
                    .join(" · ")}
                </p>
                <p className="text-xs text-white/40">
                  Upcoming classes:{" "}
                  {classes.filter((c) => c.trainerId === t.id).length}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
