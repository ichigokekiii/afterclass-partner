import XCTest
@testable import PartnerApp

final class RulesTests: XCTestCase {
    func testSeedStartsWithTenCustomersFromFiveCompletedDates() {
        let calendar = Calendar.current
        let snapshot = Seed.snapshot(now: Date(), calendar: calendar)
        XCTAssertEqual(HostedStats.customers(bookings: snapshot.bookings), 10)
    }

    func testNotificationInstantsAreSevenDaysBeforeAndNineOnTheDay() {
        var calendar = Calendar(identifier: .gregorian)
        calendar.timeZone = TimeZone(secondsFromGMT: 8 * 60 * 60)!
        let start = calendar.date(from: DateComponents(year: 2026, month: 10, day: 22, hour: 13, minute: 0))!
        let instants = NotificationSchedule.instants(windowStart: start, calendar: calendar)
        let weekAhead = calendar.date(from: DateComponents(year: 2026, month: 10, day: 15, hour: 13, minute: 0))!
        let dayOf = calendar.date(from: DateComponents(year: 2026, month: 10, day: 22, hour: 9, minute: 0))!
        XCTAssertEqual(instants.weekAhead, weekAhead)
        XCTAssertEqual(instants.dayOf, dayOf)
    }

    func testConfirmReportRevealsLocationForTwentyFourHours() {
        let now = Date(timeIntervalSince1970: 1_700_000_000)
        let report = SafetyReport(
            id: "r",
            bookingID: "b",
            reporterID: StudentID(raw: "aria"),
            placeInCafe: "Counter",
            status: .reported(at: now),
            audit: []
        )
        let confirmed = ReportClock.confirm(report, now: now, latitude: 14.6, longitude: 120.9, actor: "Maria")
        XCTAssertNotNil(confirmed)
        let pin = ReportClock.pin(for: confirmed!, now: now.addingTimeInterval(23 * 60 * 60))
        XCTAssertEqual(pin?.latitude, 14.6)
        XCTAssertEqual(pin?.longitude, 120.9)
        XCTAssertNil(ReportClock.pin(for: confirmed!, now: now.addingTimeInterval(24 * 60 * 60)))
    }

    func testBusyBlockRejectsOverlapAndAllowsATouchingWindow() {
        let start = Date(timeIntervalSince1970: 1_700_000_000)
        let busy = [BusyBlock(id: "b", start: start.addingTimeInterval(2 * 3600), end: start.addingTimeInterval(4 * 3600))]
        XCTAssertFalse(Availability.allows(start: start.addingTimeInterval(3 * 3600), end: start.addingTimeInterval(4 * 3600), busy: busy))
        XCTAssertTrue(Availability.allows(start: start.addingTimeInterval(4 * 3600), end: start.addingTimeInterval(5 * 3600), busy: busy))
        XCTAssertTrue(Availability.allows(start: start, end: start.addingTimeInterval(2 * 3600), busy: busy))
    }

    func testCafeCannotSeePhotosWithoutConsent() {
        let now = Date(timeIntervalSince1970: 1_700_000_000)
        let hidden = PhotoSubmission(id: "h", bookingID: "date", taskID: "together", imageLabels: ["Hidden"], consent: nil)
        let shown = PhotoSubmission(id: "s", bookingID: "date", taskID: "orders", imageLabels: ["Cups"], consent: PhotoConsent(grantedAt: now))
        let other = PhotoSubmission(id: "o", bookingID: "other", taskID: "together", imageLabels: ["Other"], consent: PhotoConsent(grantedAt: now))
        let visible = CafePhotoAccess.visible([hidden, shown, other], bookingID: "date")
        XCTAssertEqual(visible.map(\.id), ["s"])
        XCTAssertEqual(visible.first?.imageLabels, ["Cups"])
    }
}
