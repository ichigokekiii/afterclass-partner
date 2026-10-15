import Foundation

struct NotificationInstants: Equatable {
    let weekAhead: Date
    let dayOf: Date
}

enum DateWindow {
    static func label(start: Date, end: Date) -> String {
        let day = start.formatted(.dateTime.weekday(.abbreviated).month(.abbreviated).day())
        let open = start.formatted(date: .omitted, time: .shortened)
        let close = end.formatted(date: .omitted, time: .shortened)
        return "\(day), \(open) to \(close)"
    }
}

enum NotificationSchedule {
    static func instants(windowStart: Date, calendar: Calendar) -> NotificationInstants {
        let weekAhead = calendar.date(byAdding: .day, value: -7, to: windowStart) ?? windowStart
        let dayOf = calendar.date(bySettingHour: 9, minute: 0, second: 0, of: windowStart) ?? windowStart
        return NotificationInstants(weekAhead: weekAhead, dayOf: dayOf)
    }
}

enum Availability {
    static func allows(start: Date, end: Date, busy: [BusyBlock]) -> Bool {
        guard start < end else { return false }
        return busy.allSatisfy { end <= $0.start || start >= $0.end }
    }
}

enum CafePhotoAccess {
    static func visible(_ submissions: [PhotoSubmission], bookingID: String) -> [PhotoSubmission] {
        submissions.filter { $0.bookingID == bookingID && $0.consent != nil }
    }
}

struct LocationPin: Equatable {
    let latitude: Double
    let longitude: Double
    let expiresAt: Date
}

enum LiveLocationCopy {
    static let statusTitle = "Live location is on"

    static func subtitle(cafeName: String) -> String {
        "Updates automatically near \(cafeName). Emergency contacts follow the live pin on the map."
    }

    static func placeLine(cafeName: String, reportPlace: String) -> String {
        "\(reportPlace) · near \(cafeName)"
    }
}

enum ReportClock {
    static func pin(for report: SafetyReport, now: Date) -> LocationPin? {
        guard case .confirmed(_, let latitude, let longitude, let expiresAt) = report.status else { return nil }
        guard now < expiresAt else { return nil }
        return LocationPin(latitude: latitude, longitude: longitude, expiresAt: expiresAt)
    }

    static func confirm(
        _ report: SafetyReport,
        now: Date,
        latitude: Double,
        longitude: Double,
        actor: String
    ) -> SafetyReport? {
        guard case .reported = report.status else { return nil }
        var updated = report
        let expiresAt = now.addingTimeInterval(24 * 60 * 60)
        updated.status = .confirmed(at: now, latitude: latitude, longitude: longitude, expiresAt: expiresAt)
        updated.audit.append(AuditEntry(id: "\(report.id)-confirmed-\(Int(now.timeIntervalSince1970))", at: now, action: "\(actor) confirmed the report"))
        return updated
    }

    static func resolve(_ report: SafetyReport, now: Date, outcome: ReportResolution, actor: String) -> SafetyReport? {
        guard case .confirmed = report.status else { return nil }
        var updated = report
        updated.status = .resolved(at: now, outcome: outcome)
        updated.audit.append(AuditEntry(id: "\(report.id)-resolved-\(Int(now.timeIntervalSince1970))", at: now, action: outcome.title))
        return updated
    }
}

enum BookingTransition {
    static func complete(_ booking: Booking, at now: Date) -> Booking? {
        guard case .scheduled = booking.state, booking.bothInside else { return nil }
        var updated = booking
        updated.state = .completed(at: now, confirmedByCafe: true)
        return updated
    }

    static func noShow(_ booking: Booking, at now: Date) -> Booking? {
        guard case .scheduled = booking.state else { return nil }
        var updated = booking
        updated.state = .noShow(at: now)
        return updated
    }
}

struct MonthStats: Equatable {
    let hosted: Int
    let completed: Int
    let customers: Int
}

enum HostedStats {
    static func isCompleted(_ booking: Booking) -> Bool {
        if case .completed = booking.state { return true }
        return false
    }

    static func month(bookings: [Booking], containing date: Date, calendar: Calendar) -> MonthStats {
        let inMonth = bookings.filter { calendar.isDate($0.windowStart, equalTo: date, toGranularity: .month) }
        let completed = inMonth.filter(isCompleted).count
        return MonthStats(hosted: inMonth.count, completed: completed, customers: completed * 2)
    }

    static func customers(bookings: [Booking]) -> Int {
        bookings.filter(isCompleted).count * 2
    }
}

enum ProfileGaps {
    static func unfinished(_ cafe: Cafe) -> [String] {
        var items: [String] = []
        if cafe.description.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
            items.append("Add a description")
        }
        if cafe.gallery.isEmpty {
            items.append("Add photos")
        }
        if cafe.menu.isEmpty {
            items.append("Add a menu")
        }
        if cafe.hours.allSatisfy({ !$0.isOpen }) {
            items.append("Set opening hours")
        }
        return items
    }
}
