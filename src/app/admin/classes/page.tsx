"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { useAppStore } from "@/lib/store";
import { formatCurrency, formatDate, formatTime, todayISO } from "@/lib/utils";
import type { LocationId, ProgrammeType } from "@/lib/types";

const emptyForm = {
  title: "Foundations Strength",
  programmeType: "foundations" as ProgrammeType,
  locationId: "sports-city" as LocationId,
  trainerId: "tr_sara",
  date: todayISO(),
  startTime: "16:00",
  endTime: "17:00",
  ageMin: 8,
  ageMax: 12,
  capacity: 10,
  price: 120,
  description: "Technique-first youth strength session.",
  level: "Beginner" as const,
};

export default function AdminClassesPage() {
  const classes = useAppStore((s) => s.classes);
  const locations = useAppStore((s) => s.locations);
  const trainers = useAppStore((s) => s.trainers);
  const upsertClass = useAppStore((s) => s.upsertClass);
  const deleteClass = useAppStore((s) => s.deleteClass);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const upcoming = [...classes]
    .filter((c) => c.date >= todayISO())
    .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime))
    .slice(0, 30);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">Schedule</p>
          <h1 className="font-display text-4xl text-white">Classes</h1>
        </div>
        <Button onClick={() => setOpen((v) => !v)}>
          {open ? "Close" : "Add class"}
        </Button>
      </div>

      {open && (
        <Card>
          <CardTitle>Create class session</CardTitle>
          <form
            className="mt-4 grid gap-3 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              upsertClass(form);
              toast.success("Class created");
              setOpen(false);
              setForm(emptyForm);
            }}
          >
            <div className="sm:col-span-2">
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label>Programme</Label>
              <Select
                value={form.programmeType}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    programmeType: e.target.value as ProgrammeType,
                  }))
                }
              >
                <option value="foundations">Foundations</option>
                <option value="strength-builder">Strength Builder</option>
                <option value="athlete-dev">Athlete Development</option>
                <option value="teen-performance">Teen Performance</option>
                <option value="drop-in">Drop-in</option>
              </Select>
            </div>
            <div>
              <Label>Location</Label>
              <Select
                value={form.locationId}
                onChange={(e) =>
                  setForm((f) => ({ ...f, locationId: e.target.value as LocationId }))
                }
              >
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Trainer</Label>
              <Select
                value={form.trainerId}
                onChange={(e) => setForm((f) => ({ ...f, trainerId: e.target.value }))}
              >
                {trainers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              />
            </div>
            <div>
              <Label>Start</Label>
              <Input
                type="time"
                value={form.startTime}
                onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
              />
            </div>
            <div>
              <Label>End</Label>
              <Input
                type="time"
                value={form.endTime}
                onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))}
              />
            </div>
            <div>
              <Label>Capacity</Label>
              <Input
                type="number"
                value={form.capacity}
                onChange={(e) =>
                  setForm((f) => ({ ...f, capacity: Number(e.target.value) }))
                }
              />
            </div>
            <div>
              <Label>Price (AED)</Label>
              <Input
                type="number"
                value={form.price}
                onChange={(e) =>
                  setForm((f) => ({ ...f, price: Number(e.target.value) }))
                }
              />
            </div>
            <div className="sm:col-span-2">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit">Save class</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-3">
        {upcoming.map((c) => {
          const loc = locations.find((l) => l.id === c.locationId);
          const trainer = trainers.find((t) => t.id === c.trainerId);
          return (
            <Card
              key={c.id}
              className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="flex flex-wrap gap-2">
                  <Badge tone="accent">{c.programmeType}</Badge>
                  <Badge tone="mute">
                    {c.enrolled}/{c.capacity}
                  </Badge>
                </div>
                <p className="mt-2 font-semibold text-white">{c.title}</p>
                <p className="text-sm text-white/50">
                  {formatDate(c.date)} · {formatTime(c.startTime)} · {loc?.name} ·{" "}
                  {trainer?.name} · {formatCurrency(c.price)}
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="text-[var(--danger)]"
                onClick={() => {
                  deleteClass(c.id);
                  toast.message("Class removed");
                }}
              >
                Delete
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
