"use client";

import Link from "next/link";
import { useState } from "react";
import { Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Label, Select } from "@/components/ui/input";
import { useParentData } from "@/hooks/use-demo";
import { ageFromDob, formatCurrency, formatDate } from "@/lib/utils";
import type { LocationId } from "@/lib/types";

export default function ProgrammesPage() {
  const { packages, locations, children, enrolments } = useParentData();
  const [childId, setChildId] = useState("");
  const [locationId, setLocationId] = useState<LocationId>("sports-city");
  const selectedChildId = childId || children[0]?.id || "";
  const selectedChild = children.find((c) => c.id === selectedChildId);
  const age = selectedChild ? ageFromDob(selectedChild.dateOfBirth) : null;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">6-week tracks</p>
        <h1 className="font-display text-4xl text-white">Programmes</h1>
        <p className="mt-2 text-sm text-white/50">
          Enrol, track progress, review attendance and renew when a cycle ends.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="font-display text-3xl text-white">Your enrolments</h2>
        {enrolments.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No active programmes"
            description="Choose a 6-week package below to start structured training."
          />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {enrolments.map((en) => {
              const child = children.find((c) => c.id === en.childId);
              const pkg = packages.find((p) => p.id === en.packageId);
              const loc = locations.find((l) => l.id === en.locationId);
              return (
                <Card key={en.id}>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      tone={
                        en.status === "renewal-due"
                          ? "warn"
                          : en.status === "active"
                            ? "accent"
                            : "mute"
                      }
                    >
                      {en.status}
                    </Badge>
                    <Badge tone="info">{loc?.name}</Badge>
                  </div>
                  <CardTitle className="mt-3">{pkg?.name}</CardTitle>
                  <p className="mt-1 text-sm text-white/50">
                    {child?.firstName} · {formatDate(en.startDate)} → {formatDate(en.endDate)}
                  </p>
                  <div className="mt-4">
                    <div className="mb-1 flex justify-between text-xs text-white/45">
                      <span>Progress</span>
                      <span>
                        {en.sessionsAttended}/{en.sessionsTotal} · {en.progressPercent}%
                      </span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-[var(--accent)] transition-all"
                        style={{ width: `${en.progressPercent}%` }}
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(en.status === "renewal-due" || en.status === "completed") && (
                      <Link href={`/portal/checkout?renewId=${en.id}`}>
                        <Button size="sm">Renew now</Button>
                      </Link>
                    )}
                    <Badge tone="success">Attendance tracked</Badge>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-3xl text-white">Enrol in a package</h2>
        <Card className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label>Child</Label>
            <Select
              value={selectedChildId}
              onChange={(e) => setChildId(e.target.value)}
            >
              {children.length === 0 && <option value="">Add a child first</option>}
              {children.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.firstName} (age {ageFromDob(c.dateOfBirth)})
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Preferred location</Label>
            <Select
              value={locationId}
              onChange={(e) => setLocationId(e.target.value as LocationId)}
            >
              {locations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </Select>
          </div>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          {packages
            .filter((p) => (age == null ? true : age >= p.ageMin && age <= p.ageMax))
            .map((pkg) => (
              <Card key={pkg.id}>
                <Badge tone="accent">{pkg.weeks} weeks</Badge>
                <CardTitle className="mt-3">{pkg.name}</CardTitle>
                <p className="mt-2 text-sm text-white/55">{pkg.description}</p>
                <ul className="mt-4 space-y-1 text-sm text-white/70">
                  {pkg.highlights.map((h) => (
                    <li key={h}>▸ {h}</li>
                  ))}
                </ul>
                <div className="mt-5 flex items-center justify-between">
                  <p className="font-display text-3xl text-white">
                    {formatCurrency(pkg.price)}
                  </p>
                  {selectedChildId ? (
                    <Link
                      href={`/portal/checkout?packageId=${pkg.id}&childId=${selectedChildId}&locationId=${locationId}`}
                    >
                      <Button size="sm">Enrol</Button>
                    </Link>
                  ) : (
                    <Link href="/portal/children">
                      <Button size="sm" variant="secondary">
                        Add child
                      </Button>
                    </Link>
                  )}
                </div>
              </Card>
            ))}
        </div>
      </section>
    </div>
  );
}
