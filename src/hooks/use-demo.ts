"use client";

import { useMemo } from "react";
import { useAppStore } from "@/lib/store";

export function useCurrentUser() {
  const currentUserId = useAppStore((s) => s.currentUserId);
  const users = useAppStore((s) => s.users);
  return useMemo(
    () => users.find((u) => u.id === currentUserId) ?? null,
    [users, currentUserId]
  );
}

export function useParentData() {
  const userId = useAppStore((s) => s.currentUserId);
  const childrenAll = useAppStore((s) => s.children);
  const bookingsAll = useAppStore((s) => s.bookings);
  const enrolmentsAll = useAppStore((s) => s.enrolments);
  const paymentsAll = useAppStore((s) => s.payments);
  const notificationsAll = useAppStore((s) => s.notifications);
  const classes = useAppStore((s) => s.classes);
  const locations = useAppStore((s) => s.locations);
  const trainers = useAppStore((s) => s.trainers);
  const packages = useAppStore((s) => s.packages);

  const children = useMemo(
    () => childrenAll.filter((c) => c.parentId === userId),
    [childrenAll, userId]
  );
  const bookings = useMemo(
    () => bookingsAll.filter((b) => b.parentId === userId),
    [bookingsAll, userId]
  );
  const enrolments = useMemo(
    () => enrolmentsAll.filter((e) => e.parentId === userId),
    [enrolmentsAll, userId]
  );
  const payments = useMemo(
    () => paymentsAll.filter((p) => p.parentId === userId),
    [paymentsAll, userId]
  );
  const notifications = useMemo(
    () => notificationsAll.filter((n) => n.userId === userId),
    [notificationsAll, userId]
  );

  return {
    userId: userId!,
    children,
    bookings,
    enrolments,
    payments,
    notifications,
    classes,
    locations,
    trainers,
    packages,
  };
}
