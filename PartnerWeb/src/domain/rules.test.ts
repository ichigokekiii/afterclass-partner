import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  Availability,
  BookingTransition,
  CafePhotoAccess,
  HostedStats,
  NotificationSchedule,
  ReportClock,
} from "./rules";
import { Seed } from "./seed";
import { isMobileOrTabletRequest } from "./device-gate";
import { BusyBlock, PhotoSubmission, SafetyReport } from "./types";

describe("Partner domain rules parity with Swift RulesTests", () => {
  it("starts with ten customers from five completed dates", () => {
    const snapshot = Seed.snapshot(new Date());
    assert.equal(HostedStats.customers(snapshot.bookings), 10);
  });

  it("computes notification instants seven days before and 9 AM on the day", () => {
    const start = new Date(2026, 9, 22, 13, 0, 0, 0);
    const instants = NotificationSchedule.instants(start);
    const weekAhead = new Date(2026, 9, 15, 13, 0, 0, 0);
    const dayOf = new Date(2026, 9, 22, 9, 0, 0, 0);
    assert.equal(instants.weekAhead.getTime(), weekAhead.getTime());
    assert.equal(instants.dayOf.getTime(), dayOf.getTime());
  });

  it("reveals location for 24 hours after report confirmation", () => {
    const now = new Date(1_700_000_000 * 1000);
    const report: SafetyReport = {
      id: "r",
      bookingID: "b",
      reporterID: "aria",
      placeInCafe: "Counter",
      status: { kind: "reported", at: now },
      audit: [],
    };
    const confirmed = ReportClock.confirm(report, now, 14.6, 120.9, "Maria");
    assert.ok(confirmed);
    const pin23h = ReportClock.pin(
      confirmed,
      new Date(now.getTime() + 23 * 60 * 60 * 1000)
    );
    assert.equal(pin23h?.latitude, 14.6);
    assert.equal(pin23h?.longitude, 120.9);
    const pin24h = ReportClock.pin(
      confirmed,
      new Date(now.getTime() + 24 * 60 * 60 * 1000)
    );
    assert.equal(pin24h, null);
  });

  it("rejects overlapping busy blocks and allows touching windows", () => {
    const start = new Date(1_700_000_000 * 1000);
    const busy: BusyBlock[] = [
      {
        id: "b",
        start: new Date(start.getTime() + 2 * 3600 * 1000),
        end: new Date(start.getTime() + 4 * 3600 * 1000),
      },
    ];
    assert.equal(
      Availability.allows(
        new Date(start.getTime() + 3 * 3600 * 1000),
        new Date(start.getTime() + 4 * 3600 * 1000),
        busy
      ),
      false
    );
    assert.equal(
      Availability.allows(
        new Date(start.getTime() + 4 * 3600 * 1000),
        new Date(start.getTime() + 5 * 3600 * 1000),
        busy
      ),
      true
    );
    assert.equal(
      Availability.allows(
        start,
        new Date(start.getTime() + 2 * 3600 * 1000),
        busy
      ),
      true
    );
  });

  it("hides photos without consent", () => {
    const now = new Date(1_700_000_000 * 1000);
    const hidden: PhotoSubmission = {
      id: "h",
      bookingID: "date",
      taskID: "together",
      imageLabels: ["Hidden"],
      consent: null,
    };
    const shown: PhotoSubmission = {
      id: "s",
      bookingID: "date",
      taskID: "orders",
      imageLabels: ["Cups"],
      consent: { grantedAt: now },
    };
    const other: PhotoSubmission = {
      id: "o",
      bookingID: "other",
      taskID: "together",
      imageLabels: ["Other"],
      consent: { grantedAt: now },
    };
    const visible = CafePhotoAccess.visible([hidden, shown, other], "date");
    assert.deepEqual(
      visible.map((v) => v.id),
      ["s"]
    );
    assert.deepEqual(visible[0]?.imageLabels, ["Cups"]);
  });

  it("requires both students inside before completing a booking", () => {
    const snapshot = Seed.snapshot(new Date());
    const jennie = snapshot.bookings.find((b) => b.id === "today-jennie")!;
    const aria = snapshot.bookings.find((b) => b.id === "today-aria")!;
    assert.ok(BookingTransition.complete(jennie, new Date()));
    assert.equal(BookingTransition.complete(aria, new Date()), null);
  });

  it("allows phones and tablets and blocks desktop user-agents", () => {
    assert.equal(
      isMobileOrTabletRequest({
        userAgent:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
      }),
      true
    );
    assert.equal(
      isMobileOrTabletRequest({
        userAgent:
          "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
      }),
      true
    );
    assert.equal(
      isMobileOrTabletRequest({
        userAgent:
          "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36",
      }),
      true
    );
    assert.equal(
      isMobileOrTabletRequest({
        userAgent:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      }),
      false
    );
    assert.equal(
      isMobileOrTabletRequest({
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      }),
      false
    );
  });
});
