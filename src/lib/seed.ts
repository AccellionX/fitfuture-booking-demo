import { addDays, format, subDays } from "date-fns";
import type {
  AttendanceRecord,
  Booking,
  Child,
  ClassSession,
  DemoStore,
  Enrolment,
  Location,
  AppNotification,
  Payment,
  ProgrammePackage,
  Trainer,
  User,
} from "./types";

const d = (offset: number) => format(addDays(new Date(), offset), "yyyy-MM-dd");
const past = (offset: number) => format(subDays(new Date(), offset), "yyyy-MM-dd");

export const DEMO_PARENT_EMAIL = "parent@demo.ffta";
export const DEMO_ADMIN_EMAIL = "admin@demo.ffta";
export const DEMO_PASSWORD = "demo1234";

export const locations: Location[] = [
  {
    id: "sports-city",
    name: "Sports City",
    area: "Dubai Sports City",
    address: "Victory Heights, Dubai Sports City",
    mapHint: "Next to the International Cricket Stadium",
  },
  {
    id: "al-safa",
    name: "Al Safa / Jumeirah",
    area: "Al Safa",
    address: "Al Wasl Road, Al Safa, Dubai",
    mapHint: "Near Al Safa Park",
  },
  {
    id: "al-quoz",
    name: "Al Quoz",
    area: "Al Quoz Industrial",
    address: "Al Quoz 1, Dubai",
    mapHint: "Warehouse district training studio",
  },
];

export const trainers: Trainer[] = [
  {
    id: "tr_maya",
    name: "Maya Al Hashimi",
    title: "Head Strength Coach",
    specialties: ["Youth Strength", "Technique", "Mindset"],
    bio: "10+ years coaching young athletes with a focus on safe progression and confidence.",
    image:
      "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=600&h=800&fit=crop",
    locationIds: ["sports-city", "al-safa"],
  },
  {
    id: "tr_james",
    name: "James Okonkwo",
    title: "Athlete Development Coach",
    specialties: ["Athletic Performance", "Power", "Speed"],
    bio: "Former collegiate athlete specialising in long-term athletic development for teens.",
    image:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=800&fit=crop",
    locationIds: ["sports-city", "al-quoz"],
  },
  {
    id: "tr_sara",
    name: "Sara Mendes",
    title: "Foundations Coach",
    specialties: ["Ages 8–12", "Movement Literacy", "Nutrition Education"],
    bio: "Creates playful, structured sessions that teach kids how to move well for life.",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=800&fit=crop",
    locationIds: ["al-safa", "al-quoz"],
  },
  {
    id: "tr_omar",
    name: "Omar Farid",
    title: "Teen Performance Coach",
    specialties: ["Hypertrophy", "Discipline", "Recovery"],
    bio: "Helps teens build strength, habits and ownership of their training journey.",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=800&fit=crop",
    locationIds: ["al-quoz", "sports-city"],
  },
];

export const packages: ProgrammePackage[] = [
  {
    id: "pkg_foundations",
    name: "Foundations 6-Week",
    programmeType: "foundations",
    weeks: 6,
    sessionsPerWeek: 2,
    price: 1200,
    description:
      "Technique-first strength foundations for ages 8–12. Movement quality, confidence and healthy habits.",
    ageMin: 8,
    ageMax: 12,
    highlights: [
      "12 coached sessions",
      "Progress tracking journal",
      "Nutrition & recovery intro",
      "Parent progress summary",
    ],
  },
  {
    id: "pkg_strength",
    name: "Strength Builder 6-Week",
    programmeType: "strength-builder",
    weeks: 6,
    sessionsPerWeek: 2,
    price: 1400,
    description:
      "Progressive strength programming for ages 11–15. Build capacity safely with measurable wins.",
    ageMin: 11,
    ageMax: 15,
    highlights: [
      "12 progressive sessions",
      "Tracked lifts & milestones",
      "Mindset workshops",
      "Renewal pathway",
    ],
  },
  {
    id: "pkg_athlete",
    name: "Athlete Development 6-Week",
    programmeType: "athlete-dev",
    weeks: 6,
    sessionsPerWeek: 3,
    price: 1900,
    description:
      "Sport-transfer strength for competitive young athletes aged 12–16.",
    ageMin: 12,
    ageMax: 16,
    highlights: [
      "18 high-intent sessions",
      "Power & speed focus",
      "Coach check-ins",
      "Performance report",
    ],
  },
  {
    id: "pkg_teen",
    name: "Teen Performance 6-Week",
    programmeType: "teen-performance",
    weeks: 6,
    sessionsPerWeek: 3,
    price: 2100,
    description:
      "Advanced training, education and ownership for teens aged 15–18 preparing for lifelong fitness.",
    ageMin: 15,
    ageMax: 18,
    highlights: [
      "18 performance sessions",
      "Lifestyle education modules",
      "Goal-setting framework",
      "Priority renewal window",
    ],
  },
];

function buildClasses(): ClassSession[] {
  const templates: Omit<ClassSession, "id" | "date" | "enrolled">[] = [
    {
      title: "Foundations Strength",
      programmeType: "foundations",
      locationId: "sports-city",
      trainerId: "tr_sara",
      startTime: "16:00",
      endTime: "17:00",
      ageMin: 8,
      ageMax: 12,
      capacity: 10,
      price: 120,
      description: "Technique-first session covering squat, hinge and push patterns.",
      level: "Beginner",
    },
    {
      title: "Foundations Strength",
      programmeType: "foundations",
      locationId: "al-safa",
      trainerId: "tr_sara",
      startTime: "17:15",
      endTime: "18:15",
      ageMin: 8,
      ageMax: 12,
      capacity: 10,
      price: 120,
      description: "Small-group coaching with individual feedback every set.",
      level: "Beginner",
    },
    {
      title: "Strength Builder",
      programmeType: "strength-builder",
      locationId: "sports-city",
      trainerId: "tr_maya",
      startTime: "17:00",
      endTime: "18:15",
      ageMin: 11,
      ageMax: 15,
      capacity: 12,
      price: 140,
      description: "Progressive loading with tracked personal bests.",
      level: "Intermediate",
    },
    {
      title: "Strength Builder",
      programmeType: "strength-builder",
      locationId: "al-quoz",
      trainerId: "tr_omar",
      startTime: "18:00",
      endTime: "19:15",
      ageMin: 11,
      ageMax: 15,
      capacity: 12,
      price: 140,
      description: "Build strength and confidence through structured progression.",
      level: "Intermediate",
    },
    {
      title: "Athlete Development",
      programmeType: "athlete-dev",
      locationId: "sports-city",
      trainerId: "tr_james",
      startTime: "18:30",
      endTime: "19:45",
      ageMin: 12,
      ageMax: 16,
      capacity: 10,
      price: 160,
      description: "Power, speed and sport-transfer strength work.",
      level: "Intermediate",
    },
    {
      title: "Teen Performance",
      programmeType: "teen-performance",
      locationId: "al-quoz",
      trainerId: "tr_omar",
      startTime: "19:30",
      endTime: "20:45",
      ageMin: 15,
      ageMax: 18,
      capacity: 10,
      price: 175,
      description: "Advanced session with education block on recovery & fuelling.",
      level: "All Levels",
    },
    {
      title: "Drop-in Intro Session",
      programmeType: "drop-in",
      locationId: "al-safa",
      trainerId: "tr_maya",
      startTime: "16:30",
      endTime: "17:30",
      ageMin: 8,
      ageMax: 18,
      capacity: 8,
      price: 100,
      description: "Try FFTA with a coach-led intro — perfect first visit.",
      level: "Beginner",
    },
    {
      title: "Weekend Foundations",
      programmeType: "foundations",
      locationId: "al-quoz",
      trainerId: "tr_sara",
      startTime: "10:00",
      endTime: "11:00",
      ageMin: 8,
      ageMax: 12,
      capacity: 12,
      price: 120,
      description: "Saturday morning foundations with playful skill practice.",
      level: "Beginner",
    },
  ];

  const classes: ClassSession[] = [];
  let n = 1;
  for (let day = 0; day < 21; day++) {
    const date = d(day);
    const dayOfWeek = addDays(new Date(), day).getDay();
    templates.forEach((t, idx) => {
      const isWeekendClass = t.startTime.startsWith("10");
      if (isWeekendClass && dayOfWeek !== 6) return;
      if (!isWeekendClass && (dayOfWeek === 5 || dayOfWeek === 6) && idx % 3 !== 0)
        return;
      if (day % 2 === 1 && idx % 2 === 0 && !isWeekendClass) return;

      classes.push({
        ...t,
        id: `cls_${String(n).padStart(3, "0")}`,
        date,
        enrolled: Math.min(t.capacity - 1, 3 + ((n + day + idx) % (t.capacity - 2))),
      });
      n += 1;
    });
  }
  return classes;
}

const users: User[] = [
  {
    id: "usr_parent",
    email: DEMO_PARENT_EMAIL,
    password: DEMO_PASSWORD,
    name: "Aisha Rahman",
    phone: "+971 50 123 4567",
    role: "parent",
    createdAt: past(90),
  },
  {
    id: "usr_admin",
    email: DEMO_ADMIN_EMAIL,
    password: DEMO_PASSWORD,
    name: "FFTA Demo Admin",
    phone: "+971 50 987 6543",
    role: "admin",
    createdAt: past(120),
  },
  {
    id: "usr_parent2",
    email: "karim@demo.ffta",
    password: DEMO_PASSWORD,
    name: "Karim Hassan",
    phone: "+971 55 222 3344",
    role: "parent",
    createdAt: past(60),
  },
];

const children: Child[] = [
  {
    id: "ch_zayn",
    parentId: "usr_parent",
    firstName: "Zayn",
    lastName: "Rahman",
    dateOfBirth: "2014-05-12",
    gender: "male",
    notes: "Loves football; building confidence in the gym.",
    avatarColor: "#B8FF3C",
  },
  {
    id: "ch_layla",
    parentId: "usr_parent",
    firstName: "Layla",
    lastName: "Rahman",
    dateOfBirth: "2016-09-03",
    gender: "female",
    notes: "New to strength training — foundations focus.",
    avatarColor: "#5AD1E8",
  },
  {
    id: "ch_noah",
    parentId: "usr_parent2",
    firstName: "Noah",
    lastName: "Hassan",
    dateOfBirth: "2011-01-20",
    gender: "male",
    avatarColor: "#FF8A4C",
  },
];

export function createSeedStore(): DemoStore {
  const classes = buildClasses();
  const foundationClass = classes.find(
    (c) => c.programmeType === "foundations" && c.date >= d(1)
  )!;
  const strengthClass = classes.find(
    (c) => c.programmeType === "strength-builder" && c.date >= d(2)
  )!;
  const pastClass =
    classes.find((c) => c.date < d(0)) ||
    (() => {
      const clone = { ...classes[0], id: "cls_past_01", date: past(3), enrolled: 8 };
      classes.unshift(clone);
      return clone;
    })();

  const bookings: Booking[] = [
    {
      id: "bk_001",
      parentId: "usr_parent",
      childId: "ch_zayn",
      classId: strengthClass.id,
      status: "confirmed",
      paymentStatus: "paid",
      amount: strengthClass.price,
      createdAt: past(2) + "T10:00:00.000Z",
    },
    {
      id: "bk_002",
      parentId: "usr_parent",
      childId: "ch_layla",
      classId: foundationClass.id,
      status: "confirmed",
      paymentStatus: "paid",
      amount: foundationClass.price,
      createdAt: past(1) + "T14:30:00.000Z",
    },
    {
      id: "bk_003",
      parentId: "usr_parent",
      childId: "ch_zayn",
      classId: pastClass.id,
      status: "completed",
      paymentStatus: "paid",
      amount: pastClass.price,
      createdAt: past(5) + "T09:00:00.000Z",
    },
    {
      id: "bk_004",
      parentId: "usr_parent2",
      childId: "ch_noah",
      classId: strengthClass.id,
      status: "confirmed",
      paymentStatus: "paid",
      amount: strengthClass.price,
      createdAt: past(1) + "T11:00:00.000Z",
    },
  ];

  const enrolments: Enrolment[] = [
    {
      id: "en_001",
      parentId: "usr_parent",
      childId: "ch_zayn",
      packageId: "pkg_strength",
      locationId: "sports-city",
      status: "active",
      startDate: past(21),
      endDate: d(21),
      sessionsTotal: 12,
      sessionsAttended: 7,
      progressPercent: 58,
      paymentStatus: "paid",
      amount: 1400,
      createdAt: past(22) + "T08:00:00.000Z",
    },
    {
      id: "en_002",
      parentId: "usr_parent",
      childId: "ch_layla",
      packageId: "pkg_foundations",
      locationId: "al-safa",
      status: "renewal-due",
      startDate: past(40),
      endDate: d(2),
      sessionsTotal: 12,
      sessionsAttended: 11,
      progressPercent: 92,
      paymentStatus: "paid",
      amount: 1200,
      createdAt: past(41) + "T08:00:00.000Z",
    },
  ];

  const attendance: AttendanceRecord[] = [
    {
      id: "att_001",
      classId: pastClass.id,
      childId: "ch_zayn",
      enrolmentId: "en_001",
      status: "present",
      markedAt: past(3) + "T18:00:00.000Z",
    },
    {
      id: "att_002",
      classId: pastClass.id,
      childId: "ch_noah",
      status: "late",
      markedAt: past(3) + "T18:05:00.000Z",
      notes: "Arrived 5 mins late",
    },
  ];

  const payments: Payment[] = [
    {
      id: "pay_001",
      parentId: "usr_parent",
      amount: 1400,
      status: "paid",
      method: "Card · Demo Visa",
      description: "Strength Builder 6-Week — Zayn",
      relatedEnrolmentId: "en_001",
      createdAt: past(22) + "T08:05:00.000Z",
      last4: "4242",
    },
    {
      id: "pay_002",
      parentId: "usr_parent",
      amount: 1200,
      status: "paid",
      method: "Card · Demo Visa",
      description: "Foundations 6-Week — Layla",
      relatedEnrolmentId: "en_002",
      createdAt: past(41) + "T08:05:00.000Z",
      last4: "4242",
    },
    {
      id: "pay_003",
      parentId: "usr_parent",
      amount: strengthClass.price,
      status: "paid",
      method: "Card · Demo Visa",
      description: `Drop-in / session — ${strengthClass.title}`,
      relatedBookingId: "bk_001",
      createdAt: past(2) + "T10:05:00.000Z",
      last4: "4242",
    },
  ];

  const notifications: AppNotification[] = [
    {
      id: "nt_001",
      userId: "usr_parent",
      type: "booking_confirmation",
      title: "Booking confirmed",
      message: `Zayn is booked into ${strengthClass.title} on ${strengthClass.date}.`,
      read: false,
      createdAt: past(2) + "T10:06:00.000Z",
      href: "/portal/history",
    },
    {
      id: "nt_002",
      userId: "usr_parent",
      type: "renewal_reminder",
      title: "Renewal due soon",
      message:
        "Layla’s Foundations 6-Week ends in 2 days. Renew now to keep her spot.",
      read: false,
      createdAt: past(0) + "T08:00:00.000Z",
      href: "/portal/programmes",
    },
    {
      id: "nt_003",
      userId: "usr_parent",
      type: "class_reminder",
      title: "Session tomorrow",
      message: "Layla has Foundations Strength coming up. Arrive 10 minutes early.",
      read: true,
      createdAt: past(1) + "T16:00:00.000Z",
      href: "/portal",
    },
    {
      id: "nt_004",
      userId: "usr_admin",
      type: "system",
      title: "Demo analytics ready",
      message: "Revenue and attendance dashboards are populated with sample data.",
      read: false,
      createdAt: past(0) + "T07:00:00.000Z",
      href: "/admin",
    },
  ];

  return {
    users,
    children,
    locations,
    trainers,
    classes,
    bookings,
    packages,
    enrolments,
    attendance,
    payments,
    notifications,
    currentUserId: null,
    hydrated: false,
  };
}
