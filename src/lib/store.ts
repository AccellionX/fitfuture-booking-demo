"use client";

import { create } from "zustand";
import { addDays, format } from "date-fns";
import type {
  AttendanceStatus,
  Booking,
  Child,
  ClassSession,
  DemoStore,
  Enrolment,
  LocationId,
  Payment,
  User,
  UserRole,
} from "./types";
import { createSeedStore, DEMO_ADMIN_EMAIL, DEMO_PARENT_EMAIL, DEMO_PASSWORD } from "./seed";
import { uid } from "./utils";

const STORAGE_KEY = "ffta-booking-demo-v1";

type RegisterInput = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

type ChildInput = Omit<Child, "id" | "parentId">;

type BookingInput = {
  classId: string;
  childId: string;
  cardLast4?: string;
};

type EnrolInput = {
  packageId: string;
  childId: string;
  locationId: LocationId;
  cardLast4?: string;
};

type StoreActions = {
  hydrate: () => void;
  resetDemo: () => void;
  persist: () => void;
  login: (email: string, password: string) => { ok: boolean; error?: string; user?: User };
  loginAsDemo: (role: UserRole) => void;
  logout: () => void;
  register: (input: RegisterInput) => { ok: boolean; error?: string };
  addChild: (input: ChildInput) => Child | null;
  updateChild: (id: string, input: Partial<ChildInput>) => void;
  removeChild: (id: string) => void;
  createBooking: (input: BookingInput) => { ok: boolean; error?: string; booking?: Booking; payment?: Payment };
  cancelBooking: (bookingId: string) => void;
  enrolProgramme: (input: EnrolInput) => { ok: boolean; error?: string; enrolment?: Enrolment };
  renewEnrolment: (enrolmentId: string) => { ok: boolean; error?: string };
  markAttendance: (classId: string, childId: string, status: AttendanceStatus, enrolmentId?: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (userId: string) => void;
  upsertClass: (session: Partial<ClassSession> & Pick<ClassSession, "title" | "locationId" | "trainerId" | "date" | "startTime" | "endTime" | "ageMin" | "ageMax" | "capacity" | "price" | "programmeType" | "description" | "level">) => void;
  deleteClass: (id: string) => void;
  currentUser: () => User | null;
};

type AppStore = DemoStore & StoreActions;

function load(): DemoStore | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DemoStore;
  } catch {
    return null;
  }
}

function save(state: DemoStore) {
  if (typeof window === "undefined") return;
  const { hydrated: _h, ...rest } = state;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
}

const seed = createSeedStore();

export const useAppStore = create<AppStore>((set, get) => ({
  ...seed,

  hydrate: () => {
    const saved = load();
    if (saved) {
      set({ ...saved, hydrated: true });
    } else {
      const fresh = createSeedStore();
      set({ ...fresh, hydrated: true });
      save(fresh);
    }
  },

  resetDemo: () => {
    const fresh = createSeedStore();
    set({ ...fresh, hydrated: true });
    save({ ...fresh, hydrated: true });
  },

  persist: () => {
    const state = get();
    save(state);
  },

  currentUser: () => {
    const { users, currentUserId } = get();
    return users.find((u) => u.id === currentUserId) ?? null;
  },

  login: (email, password) => {
    const user = get().users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) return { ok: false, error: "Invalid email or password." };
    set({ currentUserId: user.id });
    get().persist();
    return { ok: true, user };
  },

  loginAsDemo: (role) => {
    const email = role === "admin" ? DEMO_ADMIN_EMAIL : DEMO_PARENT_EMAIL;
    get().login(email, DEMO_PASSWORD);
  },

  logout: () => {
    set({ currentUserId: null });
    get().persist();
  },

  register: (input) => {
    const exists = get().users.some(
      (u) => u.email.toLowerCase() === input.email.toLowerCase()
    );
    if (exists) return { ok: false, error: "An account with this email already exists." };
    const user: User = {
      id: uid("usr"),
      email: input.email.toLowerCase(),
      password: input.password,
      name: input.name,
      phone: input.phone,
      role: "parent",
      createdAt: new Date().toISOString(),
    };
    set((s) => ({
      users: [...s.users, user],
      currentUserId: user.id,
      notifications: [
        {
          id: uid("nt"),
          userId: user.id,
          type: "system",
          title: "Welcome to FFTA Booking Demo",
          message: "Add a child profile, then browse classes or enrol in a 6-week programme.",
          read: false,
          createdAt: new Date().toISOString(),
          href: "/portal/children",
        },
        ...s.notifications,
      ],
    }));
    get().persist();
    return { ok: true };
  },

  addChild: (input) => {
    const user = get().currentUser();
    if (!user || user.role !== "parent") return null;
    const child: Child = {
      id: uid("ch"),
      parentId: user.id,
      ...input,
    };
    set((s) => ({ children: [...s.children, child] }));
    get().persist();
    return child;
  },

  updateChild: (id, input) => {
    set((s) => ({
      children: s.children.map((c) => (c.id === id ? { ...c, ...input } : c)),
    }));
    get().persist();
  },

  removeChild: (id) => {
    set((s) => ({ children: s.children.filter((c) => c.id !== id) }));
    get().persist();
  },

  createBooking: ({ classId, childId, cardLast4 = "4242" }) => {
    const user = get().currentUser();
    if (!user) return { ok: false, error: "Please sign in." };
    const session = get().classes.find((c) => c.id === classId);
    if (!session) return { ok: false, error: "Class not found." };
    if (session.enrolled >= session.capacity)
      return { ok: false, error: "This class is full." };
    const child = get().children.find((c) => c.id === childId && c.parentId === user.id);
    if (!child) return { ok: false, error: "Child profile not found." };
    const duplicate = get().bookings.find(
      (b) =>
        b.classId === classId &&
        b.childId === childId &&
        (b.status === "confirmed" || b.status === "pending")
    );
    if (duplicate) return { ok: false, error: "Already booked for this session." };

    const booking: Booking = {
      id: uid("bk"),
      parentId: user.id,
      childId,
      classId,
      status: "confirmed",
      paymentStatus: "paid",
      amount: session.price,
      createdAt: new Date().toISOString(),
    };
    const payment: Payment = {
      id: uid("pay"),
      parentId: user.id,
      amount: session.price,
      status: "paid",
      method: "Card · Demo Visa",
      description: `${session.title} — ${child.firstName}`,
      relatedBookingId: booking.id,
      createdAt: new Date().toISOString(),
      last4: cardLast4,
    };

    set((s) => ({
      bookings: [booking, ...s.bookings],
      payments: [payment, ...s.payments],
      classes: s.classes.map((c) =>
        c.id === classId ? { ...c, enrolled: c.enrolled + 1 } : c
      ),
      notifications: [
        {
          id: uid("nt"),
          userId: user.id,
          type: "booking_confirmation",
          title: "Booking confirmed",
          message: `${child.firstName} is booked into ${session.title} on ${session.date} at ${session.startTime}.`,
          read: false,
          createdAt: new Date().toISOString(),
          href: "/portal/history",
        },
        ...s.notifications,
      ],
    }));
    get().persist();
    return { ok: true, booking, payment };
  },

  cancelBooking: (bookingId) => {
    const booking = get().bookings.find((b) => b.id === bookingId);
    if (!booking || booking.status === "cancelled") return;
    set((s) => ({
      bookings: s.bookings.map((b) =>
        b.id === bookingId ? { ...b, status: "cancelled" } : b
      ),
      classes: s.classes.map((c) =>
        c.id === booking.classId
          ? { ...c, enrolled: Math.max(0, c.enrolled - 1) }
          : c
      ),
    }));
    get().persist();
  },

  enrolProgramme: ({ packageId, childId, locationId, cardLast4 = "4242" }) => {
    const user = get().currentUser();
    if (!user) return { ok: false, error: "Please sign in." };
    const pkg = get().packages.find((p) => p.id === packageId);
    const child = get().children.find((c) => c.id === childId && c.parentId === user.id);
    if (!pkg || !child) return { ok: false, error: "Invalid programme or child." };

    const start = new Date();
    const end = addDays(start, pkg.weeks * 7);
    const sessionsTotal = pkg.weeks * pkg.sessionsPerWeek;
    const enrolment: Enrolment = {
      id: uid("en"),
      parentId: user.id,
      childId,
      packageId,
      locationId,
      status: "active",
      startDate: format(start, "yyyy-MM-dd"),
      endDate: format(end, "yyyy-MM-dd"),
      sessionsTotal,
      sessionsAttended: 0,
      progressPercent: 0,
      paymentStatus: "paid",
      amount: pkg.price,
      createdAt: new Date().toISOString(),
    };
    const payment: Payment = {
      id: uid("pay"),
      parentId: user.id,
      amount: pkg.price,
      status: "paid",
      method: "Card · Demo Visa",
      description: `${pkg.name} — ${child.firstName}`,
      relatedEnrolmentId: enrolment.id,
      createdAt: new Date().toISOString(),
      last4: cardLast4,
    };

    set((s) => ({
      enrolments: [enrolment, ...s.enrolments],
      payments: [payment, ...s.payments],
      notifications: [
        {
          id: uid("nt"),
          userId: user.id,
          type: "booking_confirmation",
          title: "Programme enrolled",
          message: `${child.firstName} is enrolled in ${pkg.name} at ${locationId.replace("-", " ")}.`,
          read: false,
          createdAt: new Date().toISOString(),
          href: "/portal/programmes",
        },
        ...s.notifications,
      ],
    }));
    get().persist();
    return { ok: true, enrolment };
  },

  renewEnrolment: (enrolmentId) => {
    const user = get().currentUser();
    const existing = get().enrolments.find((e) => e.id === enrolmentId);
    if (!user || !existing) return { ok: false, error: "Enrolment not found." };
    const pkg = get().packages.find((p) => p.id === existing.packageId);
    if (!pkg) return { ok: false, error: "Package not found." };

    const start = new Date();
    const end = addDays(start, pkg.weeks * 7);
    const renewed: Enrolment = {
      ...existing,
      id: uid("en"),
      status: "active",
      startDate: format(start, "yyyy-MM-dd"),
      endDate: format(end, "yyyy-MM-dd"),
      sessionsTotal: pkg.weeks * pkg.sessionsPerWeek,
      sessionsAttended: 0,
      progressPercent: 0,
      paymentStatus: "paid",
      amount: pkg.price,
      createdAt: new Date().toISOString(),
    };

    set((s) => ({
      enrolments: [
        renewed,
        ...s.enrolments.map((e) =>
          e.id === enrolmentId ? { ...e, status: "completed" as const } : e
        ),
      ],
      payments: [
        {
          id: uid("pay"),
          parentId: user.id,
          amount: pkg.price,
          status: "paid",
          method: "Card · Demo Visa",
          description: `Renewal — ${pkg.name}`,
          relatedEnrolmentId: renewed.id,
          createdAt: new Date().toISOString(),
          last4: "4242",
        },
        ...s.payments,
      ],
      notifications: [
        {
          id: uid("nt"),
          userId: user.id,
          type: "renewal_reminder",
          title: "Programme renewed",
          message: `${pkg.name} has been renewed for another ${pkg.weeks} weeks.`,
          read: false,
          createdAt: new Date().toISOString(),
          href: "/portal/programmes",
        },
        ...s.notifications,
      ],
    }));
    get().persist();
    return { ok: true };
  },

  markAttendance: (classId, childId, status, enrolmentId) => {
    const existing = get().attendance.find(
      (a) => a.classId === classId && a.childId === childId
    );
    if (existing) {
      set((s) => ({
        attendance: s.attendance.map((a) =>
          a.id === existing.id
            ? { ...a, status, markedAt: new Date().toISOString() }
            : a
        ),
      }));
    } else {
      set((s) => ({
        attendance: [
          {
            id: uid("att"),
            classId,
            childId,
            enrolmentId,
            status,
            markedAt: new Date().toISOString(),
          },
          ...s.attendance,
        ],
      }));
    }

    if (enrolmentId && status === "present") {
      set((s) => ({
        enrolments: s.enrolments.map((e) => {
          if (e.id !== enrolmentId) return e;
          const attended = Math.min(e.sessionsTotal, e.sessionsAttended + 1);
          return {
            ...e,
            sessionsAttended: attended,
            progressPercent: Math.round((attended / e.sessionsTotal) * 100),
          };
        }),
      }));
    }
    get().persist();
  },

  markNotificationRead: (id) => {
    set((s) => ({
      notifications: s.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
    get().persist();
  },

  markAllNotificationsRead: (userId) => {
    set((s) => ({
      notifications: s.notifications.map((n) =>
        n.userId === userId ? { ...n, read: true } : n
      ),
    }));
    get().persist();
  },

  upsertClass: (session) => {
    if (session.id) {
      set((s) => ({
        classes: s.classes.map((c) =>
          c.id === session.id ? { ...c, ...session, id: c.id, enrolled: c.enrolled } : c
        ),
      }));
    } else {
      const created: ClassSession = {
        ...session,
        id: uid("cls"),
        enrolled: 0,
      };
      set((s) => ({ classes: [created, ...s.classes] }));
    }
    get().persist();
  },

  deleteClass: (id) => {
    set((s) => ({ classes: s.classes.filter((c) => c.id !== id) }));
    get().persist();
  },
}));

export { DEMO_ADMIN_EMAIL, DEMO_PARENT_EMAIL, DEMO_PASSWORD };
