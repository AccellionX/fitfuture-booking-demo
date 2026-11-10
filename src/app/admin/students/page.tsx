"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { ageFromDob } from "@/lib/utils";

export default function AdminStudentsPage() {
  const children = useAppStore((s) => s.children);
  const users = useAppStore((s) => s.users);
  const enrolments = useAppStore((s) => s.enrolments);
  const bookings = useAppStore((s) => s.bookings);
  const packages = useAppStore((s) => s.packages);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">Athletes</p>
        <h1 className="font-display text-4xl text-white">Students</h1>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-[0.12em] text-white/40">
            <tr>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Age</th>
              <th className="px-4 py-3">Parent</th>
              <th className="px-4 py-3">Bookings</th>
              <th className="px-4 py-3">Programme</th>
            </tr>
          </thead>
          <tbody>
            {children.map((child) => {
              const parent = users.find((u) => u.id === child.parentId);
              const en = enrolments.find(
                (e) =>
                  e.childId === child.id &&
                  (e.status === "active" || e.status === "renewal-due")
              );
              const pkg = packages.find((p) => p.id === en?.packageId);
              return (
                <tr key={child.id} className="border-t border-white/8">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold text-[var(--accent-ink)]"
                        style={{ background: child.avatarColor }}
                      >
                        {child.firstName[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-white">
                          {child.firstName} {child.lastName}
                        </p>
                        <p className="text-xs text-white/40">{child.notes || "—"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white/70">
                    {ageFromDob(child.dateOfBirth)}
                  </td>
                  <td className="px-4 py-3 text-white/70">{parent?.name}</td>
                  <td className="px-4 py-3 text-white/70">
                    {bookings.filter((b) => b.childId === child.id).length}
                  </td>
                  <td className="px-4 py-3">
                    {pkg ? (
                      <Badge tone={en?.status === "renewal-due" ? "warn" : "accent"}>
                        {pkg.name}
                      </Badge>
                    ) : (
                      <span className="text-white/35">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Card>
        <p className="text-sm text-white/55">
          Student records sync from parent-created profiles in this demo. In production,
          coaches would see medical notes, emergency contacts and progress journals.
        </p>
      </Card>
    </div>
  );
}
