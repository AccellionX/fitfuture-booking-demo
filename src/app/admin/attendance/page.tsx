"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Label, Select } from "@/components/ui/input";
import { useAppStore } from "@/lib/store";
import { formatDate, formatTime, todayISO } from "@/lib/utils";
import type { AttendanceStatus } from "@/lib/types";

export default function AdminAttendancePage() {
  const classes = useAppStore((s) => s.classes);
  const bookings = useAppStore((s) => s.bookings);
  const children = useAppStore((s) => s.children);
  const enrolments = useAppStore((s) => s.enrolments);
  const attendance = useAppStore((s) => s.attendance);
  const markAttendance = useAppStore((s) => s.markAttendance);

  const sessions = useMemo(
    () =>
      [...classes]
        .filter((c) => c.date <= todayISO())
        .sort((a, b) => (b.date + b.startTime).localeCompare(a.date + a.startTime))
        .slice(0, 20),
    [classes]
  );

  const [classId, setClassId] = useState(sessions[0]?.id ?? "");
  const session = classes.find((c) => c.id === classId);
  const roster = bookings.filter(
    (b) => b.classId === classId && b.status !== "cancelled"
  );

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">Floor ops</p>
        <h1 className="font-display text-4xl text-white">Attendance</h1>
      </div>

      <Card>
        <Label>Class session</Label>
        <Select value={classId} onChange={(e) => setClassId(e.target.value)}>
          {sessions.map((c) => (
            <option key={c.id} value={c.id}>
              {c.date} · {c.title} · {c.startTime}
            </option>
          ))}
        </Select>
      </Card>

      {session && (
        <Card>
          <CardTitle>{session.title}</CardTitle>
          <p className="mt-1 text-sm text-white/50">
            {formatDate(session.date)} · {formatTime(session.startTime)}
          </p>
          <div className="mt-5 space-y-3">
            {roster.length === 0 && (
              <p className="text-sm text-white/45">No booked students for this session.</p>
            )}
            {roster.map((b) => {
              const child = children.find((c) => c.id === b.childId);
              const existing = attendance.find(
                (a) => a.classId === classId && a.childId === b.childId
              );
              const enrolment = enrolments.find(
                (e) =>
                  e.childId === b.childId &&
                  (e.status === "active" || e.status === "renewal-due")
              );
              return (
                <div
                  key={b.id}
                  className="flex flex-col gap-3 rounded-xl border border-white/8 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-white">
                      {child?.firstName} {child?.lastName}
                    </p>
                    {existing && (
                      <Badge tone="info" className="mt-1">
                        Marked {existing.status}
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(["present", "late", "absent", "excused"] as AttendanceStatus[]).map(
                      (status) => (
                        <Button
                          key={status}
                          size="sm"
                          variant={existing?.status === status ? "default" : "secondary"}
                          onClick={() => {
                            markAttendance(
                              classId,
                              b.childId,
                              status,
                              enrolment?.id
                            );
                            toast.success(`${child?.firstName}: ${status}`);
                          }}
                        >
                          {status}
                        </Button>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
