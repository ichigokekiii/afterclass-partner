import {
  addDays,
  formatShortTime,
  isSameMonth,
  setHourMinute,
} from "./calendar";
import {
  Booking,
  BusyBlock,
  Cafe,
  isBothInside,
  isDayOpen,
  PhotoSubmission,
  ReportResolution,
  reportResolutionTitle,
  SafetyReport,
} from "./types";

export interface NotificationInstants {
  weekAhead: Date;
  dayOf: Date;
}

export const DateWindow = {
  label(start: Date, end: Date): string {
    const day = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(start);
    const open = formatShortTime(start);
    const close = formatShortTime(end);
    return `${day}, ${open} to ${close}`;
  },
};

export const NotificationSchedule = {
  instants(windowStart: Date): NotificationInstants {
    const weekAhead = addDays(windowStart, -7);
    const dayOf = setHourMinute(windowStart, 9, 0);
    return { weekAhead, dayOf };
  },
};

export const Availability = {
  allows(start: Date, end: Date, busy: BusyBlock[]): boolean {
    if (start.getTime() >= end.getTime()) return false;
    return busy.every(
      (block) =>
        end.getTime() <= block.start.getTime() ||
        start.getTime() >= block.end.getTime()
    );
  },
};

export const CafePhotoAccess = {
  visible(submissions: PhotoSubmission[], bookingID: string): PhotoSubmission[] {
    return submissions.filter(
      (sub) => sub.bookingID === bookingID && sub.consent !== null
    );
  },
};

export interface LocationPin {
  latitude: number;
  longitude: number;
  expiresAt: Date;
}

export const LiveLocationCopy = {
  statusTitle: "Live location is on",

  subtitle(cafeName: string): string {
    return `Updates automatically near ${cafeName}. Emergency contacts follow the live pin on the map.`;
  },

  placeLine(cafeName: string, reportPlace: string): string {
    return `${reportPlace} · near ${cafeName}`;
  },
};

export const ReportClock = {
  pin(report: SafetyReport, now: Date): LocationPin | null {
    if (report.status.kind !== "confirmed") return null;
    if (now.getTime() >= report.status.expiresAt.getTime()) return null;
    return {
      latitude: report.status.latitude,
      longitude: report.status.longitude,
      expiresAt: report.status.expiresAt,
    };
  },

  confirm(
    report: SafetyReport,
    now: Date,
    latitude: number,
    longitude: number,
    actor: string
  ): SafetyReport | null {
    if (report.status.kind !== "reported") return null;
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const sec = Math.floor(now.getTime() / 1000);
    return {
      ...report,
      status: {
        kind: "confirmed",
        at: now,
        latitude,
        longitude,
        expiresAt,
      },
      audit: [
        ...report.audit,
        {
          id: `${report.id}-confirmed-${sec}`,
          at: now,
          action: `${actor} confirmed the report`,
        },
      ],
    };
  },

  resolve(
    report: SafetyReport,
    now: Date,
    outcome: ReportResolution,
    actor: string
  ): SafetyReport | null {
    void actor;
    if (report.status.kind !== "confirmed") return null;
    const sec = Math.floor(now.getTime() / 1000);
    return {
      ...report,
      status: {
        kind: "resolved",
        at: now,
        outcome,
      },
      audit: [
        ...report.audit,
        {
          id: `${report.id}-resolved-${sec}`,
          at: now,
          action: reportResolutionTitle(outcome),
        },
      ],
    };
  },
};

export const BookingTransition = {
  complete(booking: Booking, now: Date): Booking | null {
    if (booking.state.kind !== "scheduled" || !isBothInside(booking)) {
      return null;
    }
    return {
      ...booking,
      state: {
        kind: "completed",
        at: now,
        confirmedByCafe: true,
      },
    };
  },

  noShow(booking: Booking, now: Date): Booking | null {
    if (booking.state.kind !== "scheduled") {
      return null;
    }
    return {
      ...booking,
      state: {
        kind: "noShow",
        at: now,
      },
    };
  },
};

export interface MonthStats {
  hosted: number;
  completed: number;
  customers: number;
}

export const HostedStats = {
  isCompleted(booking: Booking): boolean {
    return booking.state.kind === "completed";
  },

  month(bookings: Booking[], containing: Date): MonthStats {
    const inMonth = bookings.filter((b) => isSameMonth(b.windowStart, containing));
    const completed = inMonth.filter(HostedStats.isCompleted).length;
    return {
      hosted: inMonth.length,
      completed,
      customers: completed * 2,
    };
  },

  customers(bookings: Booking[]): number {
    return bookings.filter(HostedStats.isCompleted).length * 2;
  },
};

export const ProfileGaps = {
  unfinished(cafe: Cafe): string[] {
    const items: string[] = [];
    if (cafe.description.trim().length === 0) {
      items.push("Add a description");
    }
    if (cafe.gallery.length === 0) {
      items.push("Add photos");
    }
    if (cafe.menu.length === 0) {
      items.push("Add a menu");
    }
    if (cafe.hours.every((h) => !isDayOpen(h))) {
      items.push("Set opening hours");
    }
    return items;
  },
};

export const Peso = {
  string(amount: number): string {
    return `₱${amount.toLocaleString("en-US")}`;
  },
};
