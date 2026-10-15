import { addDays, setHourMinute, startOfDay } from "./calendar";
import { NotificationSchedule } from "./rules";
import {
  AppNotification,
  Booking,
  Cafe,
  DayHours,
  PartnerSnapshot,
  PhotoSubmission,
  PhotoTaskDefinition,
  PublicStudent,
  SafetyReport,
} from "./types";

function student(raw: string, firstName: string, school: string): PublicStudent {
  return {
    id: raw,
    firstName,
    school,
    isVerified: true,
  };
}

function completedBooking(
  id: string,
  start: Date,
  end: Date,
  first: PublicStudent,
  second: PublicStudent
): Booking {
  return {
    id,
    windowStart: start,
    windowEnd: end,
    students: { first, second },
    state: { kind: "completed", at: end, confirmedByCafe: true },
    checkedInStudentIDs: [first.id, second.id],
  };
}

export const Seed = {
  tasks: [
    {
      id: "together",
      title: "A photo together anywhere in the café",
      kind: "together",
    },
    {
      id: "orders",
      title: "A photo with your orders, styled like a story",
      kind: "orders",
    },
    {
      id: "recreation",
      title: "Recreate a photo you choose",
      kind: "recreation",
    },
  ] satisfies PhotoTaskDefinition[],

  snapshot(now: Date = new Date()): PartnerSnapshot {
    function at(dayOffset: number, hour: number, minute = 0): Date {
      const day = addDays(startOfDay(now), dayOffset);
      return setHourMinute(day, hour, minute);
    }

    const jennie = student("jennie", "Jennie", "Ateneo de Manila University");
    const marco = student("marco", "Marco", "De La Salle University");
    const aria = student("aria", "Aria", "University of the Philippines Diliman");
    const luis = student("luis", "Luis", "University of Santo Tomas");
    const sofia = student("sofia", "Sofia", "Ateneo de Manila University");
    const isabel = student("isabel", "Isabel", "De La Salle University");
    const noah = student("noah", "Noah", "Ateneo de Manila University");

    const todayJennie: Booking = {
      id: "today-jennie",
      windowStart: at(0, 13),
      windowEnd: at(0, 15),
      students: { first: jennie, second: marco },
      state: { kind: "scheduled" },
      checkedInStudentIDs: [jennie.id, marco.id],
    };

    const todayAria: Booking = {
      id: "today-aria",
      windowStart: at(0, 17),
      windowEnd: at(0, 18),
      students: { first: aria, second: luis },
      state: { kind: "scheduled" },
      checkedInStudentIDs: [aria.id],
    };

    const weekSofia: Booking = {
      id: "week-sofia",
      windowStart: at(2, 11),
      windowEnd: at(2, 12),
      students: { first: sofia, second: isabel },
      state: { kind: "scheduled" },
      checkedInStudentIDs: [],
    };

    const aheadNoah: Booking = {
      id: "ahead-noah",
      windowStart: at(7, 15),
      windowEnd: at(7, 16),
      students: { first: noah, second: marco },
      state: { kind: "scheduled" },
      checkedInStudentIDs: [],
    };

    const doneRecent = completedBooking(
      "done-recent",
      at(-1, 14),
      at(-1, 15),
      sofia,
      luis
    );
    const doneMonth = completedBooking(
      "done-month",
      at(-4, 10),
      at(-4, 11),
      jennie,
      noah
    );
    const missed: Booking = {
      id: "missed",
      windowStart: at(-2, 12),
      windowEnd: at(-2, 13),
      students: { first: isabel, second: aria },
      state: { kind: "noShow", at: at(-2, 13) },
      checkedInStudentIDs: [],
    };
    const doneLastA = completedBooking(
      "done-last-a",
      at(-22, 13),
      at(-22, 14),
      marco,
      aria
    );
    const doneLastB = completedBooking(
      "done-last-b",
      at(-27, 15),
      at(-27, 16),
      luis,
      sofia
    );
    const doneLastC = completedBooking(
      "done-last-c",
      at(-32, 11),
      at(-32, 12),
      noah,
      isabel
    );

    const bookings: Booking[] = [
      todayJennie,
      todayAria,
      weekSofia,
      aheadNoah,
      doneRecent,
      doneMonth,
      missed,
      doneLastA,
      doneLastB,
      doneLastC,
    ];

    const submissions: PhotoSubmission[] = [
      {
        id: "photo-together",
        bookingID: todayJennie.id,
        taskID: "together",
        imageLabels: ["Together by the window"],
        consent: { grantedAt: now },
      },
      {
        id: "photo-orders",
        bookingID: todayJennie.id,
        taskID: "orders",
        imageLabels: ["Two cups on the table"],
        consent: { grantedAt: now },
      },
      {
        id: "photo-recreation",
        bookingID: todayJennie.id,
        taskID: "recreation",
        imageLabels: ["Reference", "Recreation"],
        consent: { grantedAt: now },
      },
      {
        id: "photo-hidden",
        bookingID: todayAria.id,
        taskID: "together",
        imageLabels: ["Together, not shared"],
        consent: null,
      },
    ];

    const pendingAt = new Date(now.getTime() - 20 * 60 * 1000);
    const liveExpires = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const liveAt = new Date(now.getTime() - 30 * 60 * 1000);
    const expiredAt = new Date(now.getTime() - 26 * 60 * 60 * 1000);
    const closedAt = at(-8, 16);

    const pending: SafetyReport = {
      id: "report-pending",
      bookingID: todayAria.id,
      reporterID: aria.id,
      placeInCafe: "By the counter",
      status: { kind: "reported", at: pendingAt },
      audit: [{ id: "audit-pending", at: pendingAt, action: "Reported" }],
    };

    const live: SafetyReport = {
      id: "report-live",
      bookingID: doneRecent.id,
      reporterID: sofia.id,
      placeInCafe: "Window seats",
      status: {
        kind: "confirmed",
        at: liveAt,
        latitude: 14.6101,
        longitude: 120.9899,
        expiresAt: liveExpires,
      },
      audit: [
        {
          id: "audit-live-reported",
          at: new Date(liveAt.getTime() - 600 * 1000),
          action: "Reported",
        },
        {
          id: "audit-live-confirmed",
          at: liveAt,
          action: "Maria confirmed the report",
        },
      ],
    };

    const expired: SafetyReport = {
      id: "report-expired",
      bookingID: doneMonth.id,
      reporterID: jennie.id,
      placeInCafe: "Patio",
      status: {
        kind: "confirmed",
        at: expiredAt,
        latitude: 14.6101,
        longitude: 120.9899,
        expiresAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      },
      audit: [
        {
          id: "audit-expired",
          at: expiredAt,
          action: "Maria confirmed the report",
        },
      ],
    };

    const closed: SafetyReport = {
      id: "report-closed",
      bookingID: doneLastA.id,
      reporterID: marco.id,
      placeInCafe: "Front table",
      status: { kind: "resolved", at: closedAt, outcome: "safelyLeft" },
      audit: [
        {
          id: "audit-closed-reported",
          at: new Date(closedAt.getTime() - 3600 * 1000),
          action: "Reported",
        },
        {
          id: "audit-closed-confirmed",
          at: new Date(closedAt.getTime() - 1800 * 1000),
          action: "Maria confirmed the report",
        },
        {
          id: "audit-closed-left",
          at: closedAt,
          action: "Student safely left",
        },
      ],
    };

    const notifications: AppNotification[] = [];
    for (const booking of bookings) {
      const instants = NotificationSchedule.instants(booking.windowStart);
      const names = `${booking.students.first.firstName} and ${booking.students.second.firstName}`;
      notifications.push({
        id: `${booking.id}-week`,
        kind: "weekAhead",
        bookingID: booking.id,
        reportID: null,
        fireDate: instants.weekAhead,
        title: "Date in seven days",
        body: `${names} are booked a week from their window.`,
      });
      notifications.push({
        id: `${booking.id}-day`,
        kind: "dayOf",
        bookingID: booking.id,
        reportID: null,
        fireDate: instants.dayOf,
        title: "Date today",
        body: `${names} are booked today.`,
      });
    }
    notifications.push({
      id: "note-report-pending",
      kind: "report",
      bookingID: todayAria.id,
      reportID: pending.id,
      fireDate: pendingAt,
      title: "Safety report",
      body: "Aria reported a concern by the counter.",
    });
    notifications.sort((a, b) => b.fireDate.getTime() - a.fireDate.getTime());

    const hours: DayHours[] = [1, 2, 3, 4, 5, 6, 7].map((weekday) => ({
      weekday,
      openHour: weekday === 1 ? null : 8,
      closeHour: weekday === 1 ? null : 18,
    }));

    const cafe: Cafe = {
      name: "Dear Darling Cafe",
      address: "Katipunan Avenue, Quezon City",
      description: "",
      latitude: 14.6097,
      longitude: 120.9896,
      hours,
      gallery: [
        { id: "exterior", caption: "Exterior" },
        { id: "seating", caption: "Seating" },
      ],
      menu: [
        { id: "latte", name: "Spanish latte", pricePesos: 160 },
        { id: "bread", name: "Spanish bread", pricePesos: 85 },
        { id: "americano", name: "Iced americano", pricePesos: 140 },
      ],
      busy: [
        {
          id: "busy-tomorrow",
          start: at(1, 14),
          end: at(1, 17),
        },
      ],
      tier: "senior",
    };

    return {
      cafe,
      bookings,
      tasks: Seed.tasks,
      submissions,
      reports: [pending, live, expired, closed],
      notifications,
      accounts: [
        { id: "maria", name: "Maria", role: "owner" },
        { id: "paolo", name: "Paolo", role: "staff" },
      ],
    };
  },
};
