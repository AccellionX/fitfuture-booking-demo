"use client";

import { MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { todayISO } from "@/lib/utils";

export default function AdminLocationsPage() {
  const locations = useAppStore((s) => s.locations);
  const classes = useAppStore((s) => s.classes);
  const bookings = useAppStore((s) => s.bookings);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">Dubai sites</p>
        <h1 className="font-display text-4xl text-white">Locations</h1>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {locations.map((loc) => {
          const upcoming = classes.filter(
            (c) => c.locationId === loc.id && c.date >= todayISO()
          ).length;
          const booked = bookings.filter((b) => {
            const cls = classes.find((c) => c.id === b.classId);
            return cls?.locationId === loc.id && b.status !== "cancelled";
          }).length;
          return (
            <Card key={loc.id}>
              <MapPin className="h-6 w-6 text-[var(--accent)]" />
              <h3 className="mt-4 font-display text-3xl text-white">{loc.name}</h3>
              <p className="mt-2 text-sm text-white/55">{loc.address}</p>
              <p className="text-xs text-white/35">{loc.mapHint}</p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/5 p-3">
                  <p className="text-xs text-white/40">Upcoming</p>
                  <p className="font-display text-3xl text-white">{upcoming}</p>
                </div>
                <div className="rounded-xl bg-white/5 p-3">
                  <p className="text-xs text-white/40">Bookings</p>
                  <p className="font-display text-3xl text-white">{booked}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
