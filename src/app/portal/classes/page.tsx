"use client";

import { useMemo, useState } from "react";
import { CalendarSearch } from "lucide-react";
import { ClassCard } from "@/components/shared/class-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input, Label, Select } from "@/components/ui/input";
import { useParentData } from "@/hooks/use-demo";
import { ageFromDob, todayISO } from "@/lib/utils";
import type { LocationId, ProgrammeType } from "@/lib/types";

export default function ClassesPage() {
  const { children, classes, locations, trainers } = useParentData();

  const [locationId, setLocationId] = useState<"" | LocationId>("");
  const [programmeType, setProgrammeType] = useState<"" | ProgrammeType>("");
  const [date, setDate] = useState("");
  const [childId, setChildId] = useState(children[0]?.id ?? "");

  const selectedChild = children.find((c) => c.id === childId);
  const age = selectedChild ? ageFromDob(selectedChild.dateOfBirth) : null;

  const filtered = useMemo(() => {
    return classes
      .filter((c) => c.date >= todayISO())
      .filter((c) => (locationId ? c.locationId === locationId : true))
      .filter((c) => (programmeType ? c.programmeType === programmeType : true))
      .filter((c) => (date ? c.date === date : true))
      .filter((c) => (age == null ? true : age >= c.ageMin && age <= c.ageMax))
      .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime))
      .slice(0, 24);
  }, [classes, locationId, programmeType, date, age]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">Browse</p>
        <h1 className="font-display text-4xl text-white">Classes</h1>
        <p className="mt-2 text-sm text-white/50">
          Filter by age, location and date — then book into a session.
        </p>
      </div>

      <div className="grid gap-3 rounded-2xl border border-white/10 bg-[var(--bg-elevated)] p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Label>Child (age filter)</Label>
          <Select value={childId} onChange={(e) => setChildId(e.target.value)}>
            <option value="">All ages</option>
            {children.map((c) => (
              <option key={c.id} value={c.id}>
                {c.firstName} (age {ageFromDob(c.dateOfBirth)})
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label>Location</Label>
          <Select
            value={locationId}
            onChange={(e) => setLocationId(e.target.value as "" | LocationId)}
          >
            <option value="">All locations</option>
            {locations.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label>Programme</Label>
          <Select
            value={programmeType}
            onChange={(e) => setProgrammeType(e.target.value as "" | ProgrammeType)}
          >
            <option value="">All programmes</option>
            <option value="foundations">Foundations</option>
            <option value="strength-builder">Strength Builder</option>
            <option value="athlete-dev">Athlete Development</option>
            <option value="teen-performance">Teen Performance</option>
            <option value="drop-in">Drop-in</option>
          </Select>
        </div>
        <div>
          <Label>Date</Label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={CalendarSearch}
          title="No matching classes"
          description="Try clearing filters or picking another child age band."
          actionLabel="Clear filters"
          onAction={() => {
            setLocationId("");
            setProgrammeType("");
            setDate("");
            setChildId("");
          }}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((session) => (
            <ClassCard
              key={session.id}
              session={session}
              location={locations.find((l) => l.id === session.locationId)}
              trainer={trainers.find((t) => t.id === session.trainerId)}
              href={`/portal/book/${session.id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
