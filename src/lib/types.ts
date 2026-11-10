export type UserRole = "parent" | "admin";

export type LocationId = "sports-city" | "al-safa" | "al-quoz";

export type ProgrammeType =
  | "foundations"
  | "strength-builder"
  | "athlete-dev"
  | "teen-performance"
  | "drop-in";

export type BookingStatus = "confirmed" | "cancelled" | "completed" | "pending";
export type PaymentStatus = "paid" | "pending" | "failed" | "refunded";
export type AttendanceStatus = "present" | "absent" | "late" | "excused";
export type EnrolmentStatus = "active" | "completed" | "renewal-due" | "cancelled";
export type NotificationType =
  | "booking_confirmation"
  | "renewal_reminder"
  | "class_reminder"
  | "payment"
  | "system";

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  role: UserRole;
  createdAt: string;
}

export interface Child {
  id: string;
  parentId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  notes?: string;
  avatarColor: string;
}

export interface Location {
  id: LocationId;
  name: string;
  area: string;
  address: string;
  mapHint: string;
}

export interface Trainer {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  bio: string;
  image: string;
  locationIds: LocationId[];
}

export interface ClassSession {
  id: string;
  title: string;
  programmeType: ProgrammeType;
  locationId: LocationId;
  trainerId: string;
  date: string;
  startTime: string;
  endTime: string;
  ageMin: number;
  ageMax: number;
  capacity: number;
  enrolled: number;
  price: number;
  description: string;
  level: "Beginner" | "Intermediate" | "All Levels";
}

export interface Booking {
  id: string;
  parentId: string;
  childId: string;
  classId: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  amount: number;
  createdAt: string;
  notes?: string;
}

export interface ProgrammePackage {
  id: string;
  name: string;
  programmeType: ProgrammeType;
  weeks: number;
  sessionsPerWeek: number;
  price: number;
  description: string;
  ageMin: number;
  ageMax: number;
  highlights: string[];
}

export interface Enrolment {
  id: string;
  parentId: string;
  childId: string;
  packageId: string;
  locationId: LocationId;
  status: EnrolmentStatus;
  startDate: string;
  endDate: string;
  sessionsTotal: number;
  sessionsAttended: number;
  progressPercent: number;
  paymentStatus: PaymentStatus;
  amount: number;
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  classId: string;
  childId: string;
  enrolmentId?: string;
  status: AttendanceStatus;
  markedAt: string;
  notes?: string;
}

export interface Payment {
  id: string;
  parentId: string;
  amount: number;
  status: PaymentStatus;
  method: string;
  description: string;
  relatedBookingId?: string;
  relatedEnrolmentId?: string;
  createdAt: string;
  last4?: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  href?: string;
}

export interface DemoStore {
  users: User[];
  children: Child[];
  locations: Location[];
  trainers: Trainer[];
  classes: ClassSession[];
  bookings: Booking[];
  packages: ProgrammePackage[];
  enrolments: Enrolment[];
  attendance: AttendanceRecord[];
  payments: Payment[];
  notifications: AppNotification[];
  currentUserId: string | null;
  hydrated: boolean;
}
