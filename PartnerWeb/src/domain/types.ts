export type StudentID = string;

export interface PublicStudent {
  id: StudentID;
  firstName: string;
  school: string;
  isVerified: boolean;
}

export interface StudentPair {
  first: PublicStudent;
  second: PublicStudent;
}

export function bothStudents(pair: StudentPair): [PublicStudent, PublicStudent] {
  return [pair.first, pair.second];
}

export type BookingState =
  | { kind: "scheduled" }
  | { kind: "completed"; at: Date; confirmedByCafe: boolean }
  | { kind: "noShow"; at: Date };

export interface Booking {
  id: string;
  windowStart: Date;
  windowEnd: Date;
  students: StudentPair;
  state: BookingState;
  checkedInStudentIDs: StudentID[];
}

export function isBothInside(booking: Booking): boolean {
  return (
    booking.checkedInStudentIDs.includes(booking.students.first.id) &&
    booking.checkedInStudentIDs.includes(booking.students.second.id)
  );
}

export type PhotoTaskKind = "together" | "orders" | "recreation";

export interface PhotoTaskDefinition {
  id: string;
  title: string;
  kind: PhotoTaskKind;
}

export interface PhotoConsent {
  grantedAt: Date;
}

export interface PhotoSubmission {
  id: string;
  bookingID: string;
  taskID: string;
  imageLabels: string[];
  consent: PhotoConsent | null;
}

export type ReportResolution = "safelyLeft" | "resolved";

export function reportResolutionTitle(outcome: ReportResolution): string {
  switch (outcome) {
    case "safelyLeft":
      return "Student safely left";
    case "resolved":
      return "Resolved";
  }
}

export type ReportStatus =
  | { kind: "reported"; at: Date }
  | {
      kind: "confirmed";
      at: Date;
      latitude: number;
      longitude: number;
      expiresAt: Date;
    }
  | { kind: "resolved"; at: Date; outcome: ReportResolution };

export interface AuditEntry {
  id: string;
  at: Date;
  action: string;
}

export interface SafetyReport {
  id: string;
  bookingID: string;
  reporterID: StudentID;
  placeInCafe: string;
  status: ReportStatus;
  audit: AuditEntry[];
}

export type StaffRole = "owner" | "staff";

export interface StaffAccount {
  id: string;
  name: string;
  role: StaffRole;
}

export type PartnerTier = "freshman" | "senior";

export function tierTitle(tier: PartnerTier): string {
  return tier === "freshman" ? "Freshman" : "Senior";
}

export function tierMonthlyPesos(tier: PartnerTier): number {
  return tier === "freshman" ? 2500 : 5000;
}

export function tierDetail(tier: PartnerTier): string {
  return tier === "freshman"
    ? "Basic listing."
    : "Featured and recommended first near the café.";
}

export interface DayHours {
  weekday: number;
  openHour: number | null;
  closeHour: number | null;
}

export function isDayOpen(day: DayHours): boolean {
  return day.openHour !== null && day.closeHour !== null;
}

export interface BusyBlock {
  id: string;
  start: Date;
  end: Date;
}

export interface MenuItem {
  id: string;
  name: string;
  pricePesos: number;
}

export interface CafePhoto {
  id: string;
  caption: string;
}

export interface Cafe {
  name: string;
  address: string;
  description: string;
  latitude: number;
  longitude: number;
  hours: DayHours[];
  gallery: CafePhoto[];
  menu: MenuItem[];
  busy: BusyBlock[];
  tier: PartnerTier;
}

export type NotificationKind = "weekAhead" | "dayOf" | "report";

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  bookingID: string | null;
  reportID: string | null;
  fireDate: Date;
  title: string;
  body: string;
}

export interface PartnerSnapshot {
  cafe: Cafe;
  bookings: Booking[];
  tasks: PhotoTaskDefinition[];
  submissions: PhotoSubmission[];
  reports: SafetyReport[];
  notifications: AppNotification[];
  accounts: StaffAccount[];
}
