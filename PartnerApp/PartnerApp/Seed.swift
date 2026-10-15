import Foundation

enum Seed {
    static let tasks: [PhotoTaskDefinition] = [
        PhotoTaskDefinition(id: "together", title: "A photo together anywhere in the café", kind: .together),
        PhotoTaskDefinition(id: "orders", title: "A photo with your orders, styled like a story", kind: .orders),
        PhotoTaskDefinition(id: "recreation", title: "Recreate a photo you choose", kind: .recreation),
    ]

    static func snapshot(now: Date, calendar: Calendar) -> PartnerSnapshot {
        func at(dayOffset: Int, hour: Int, minute: Int = 0) -> Date {
            let day = calendar.date(byAdding: .day, value: dayOffset, to: calendar.startOfDay(for: now)) ?? now
            return calendar.date(bySettingHour: hour, minute: minute, second: 0, of: day) ?? day
        }

        let jennie = student("jennie", "Jennie", "Ateneo de Manila University")
        let marco = student("marco", "Marco", "De La Salle University")
        let aria = student("aria", "Aria", "University of the Philippines Diliman")
        let luis = student("luis", "Luis", "University of Santo Tomas")
        let sofia = student("sofia", "Sofia", "Ateneo de Manila University")
        let isabel = student("isabel", "Isabel", "De La Salle University")
        let noah = student("noah", "Noah", "Ateneo de Manila University")

        let todayJennie = Booking(
            id: "today-jennie",
            windowStart: at(dayOffset: 0, hour: 13),
            windowEnd: at(dayOffset: 0, hour: 15),
            students: StudentPair(first: jennie, second: marco),
            state: .scheduled,
            checkedInStudentIDs: [jennie.id, marco.id]
        )
        let todayAria = Booking(
            id: "today-aria",
            windowStart: at(dayOffset: 0, hour: 17),
            windowEnd: at(dayOffset: 0, hour: 18),
            students: StudentPair(first: aria, second: luis),
            state: .scheduled,
            checkedInStudentIDs: [aria.id]
        )
        let weekSofia = Booking(
            id: "week-sofia",
            windowStart: at(dayOffset: 2, hour: 11),
            windowEnd: at(dayOffset: 2, hour: 12),
            students: StudentPair(first: sofia, second: isabel),
            state: .scheduled,
            checkedInStudentIDs: []
        )
        let aheadNoah = Booking(
            id: "ahead-noah",
            windowStart: at(dayOffset: 7, hour: 15),
            windowEnd: at(dayOffset: 7, hour: 16),
            students: StudentPair(first: noah, second: marco),
            state: .scheduled,
            checkedInStudentIDs: []
        )
        let doneRecent = completed("done-recent", start: at(dayOffset: -1, hour: 14), end: at(dayOffset: -1, hour: 15), first: sofia, second: luis)
        let doneMonth = completed("done-month", start: at(dayOffset: -4, hour: 10), end: at(dayOffset: -4, hour: 11), first: jennie, second: noah)
        let missed = Booking(
            id: "missed",
            windowStart: at(dayOffset: -2, hour: 12),
            windowEnd: at(dayOffset: -2, hour: 13),
            students: StudentPair(first: isabel, second: aria),
            state: .noShow(at: at(dayOffset: -2, hour: 13)),
            checkedInStudentIDs: []
        )
        let doneLastA = completed("done-last-a", start: at(dayOffset: -22, hour: 13), end: at(dayOffset: -22, hour: 14), first: marco, second: aria)
        let doneLastB = completed("done-last-b", start: at(dayOffset: -27, hour: 15), end: at(dayOffset: -27, hour: 16), first: luis, second: sofia)
        let doneLastC = completed("done-last-c", start: at(dayOffset: -32, hour: 11), end: at(dayOffset: -32, hour: 12), first: noah, second: isabel)

        let bookings = [todayJennie, todayAria, weekSofia, aheadNoah, doneRecent, doneMonth, missed, doneLastA, doneLastB, doneLastC]
        let submissions = [
            PhotoSubmission(id: "photo-together", bookingID: todayJennie.id, taskID: "together", imageLabels: ["Together by the window"], consent: PhotoConsent(grantedAt: now)),
            PhotoSubmission(id: "photo-orders", bookingID: todayJennie.id, taskID: "orders", imageLabels: ["Two cups on the table"], consent: PhotoConsent(grantedAt: now)),
            PhotoSubmission(id: "photo-recreation", bookingID: todayJennie.id, taskID: "recreation", imageLabels: ["Reference", "Recreation"], consent: PhotoConsent(grantedAt: now)),
            PhotoSubmission(id: "photo-hidden", bookingID: todayAria.id, taskID: "together", imageLabels: ["Together, not shared"], consent: nil),
        ]

        let pendingAt = now.addingTimeInterval(-20 * 60)
        let liveExpires = now.addingTimeInterval(2 * 60 * 60)
        let liveAt = now.addingTimeInterval(-30 * 60)
        let expiredAt = now.addingTimeInterval(-26 * 60 * 60)
        let closedAt = at(dayOffset: -8, hour: 16)

        let pending = SafetyReport(
            id: "report-pending",
            bookingID: todayAria.id,
            reporterID: aria.id,
            placeInCafe: "By the counter",
            status: .reported(at: pendingAt),
            audit: [AuditEntry(id: "audit-pending", at: pendingAt, action: "Reported")]
        )
        let live = SafetyReport(
            id: "report-live",
            bookingID: doneRecent.id,
            reporterID: sofia.id,
            placeInCafe: "Window seats",
            status: .confirmed(at: liveAt, latitude: 14.6101, longitude: 120.9899, expiresAt: liveExpires),
            audit: [
                AuditEntry(id: "audit-live-reported", at: liveAt.addingTimeInterval(-600), action: "Reported"),
                AuditEntry(id: "audit-live-confirmed", at: liveAt, action: "Maria confirmed the report"),
            ]
        )
        let expired = SafetyReport(
            id: "report-expired",
            bookingID: doneMonth.id,
            reporterID: jennie.id,
            placeInCafe: "Patio",
            status: .confirmed(at: expiredAt, latitude: 14.6101, longitude: 120.9899, expiresAt: now.addingTimeInterval(-2 * 60 * 60)),
            audit: [AuditEntry(id: "audit-expired", at: expiredAt, action: "Maria confirmed the report")]
        )
        let closed = SafetyReport(
            id: "report-closed",
            bookingID: doneLastA.id,
            reporterID: marco.id,
            placeInCafe: "Front table",
            status: .resolved(at: closedAt, outcome: .safelyLeft),
            audit: [
                AuditEntry(id: "audit-closed-reported", at: closedAt.addingTimeInterval(-3600), action: "Reported"),
                AuditEntry(id: "audit-closed-confirmed", at: closedAt.addingTimeInterval(-1800), action: "Maria confirmed the report"),
                AuditEntry(id: "audit-closed-left", at: closedAt, action: "Student safely left"),
            ]
        )

        var notifications: [AppNotification] = []
        for booking in bookings {
            let instants = NotificationSchedule.instants(windowStart: booking.windowStart, calendar: calendar)
            let names = "\(booking.students.first.firstName) and \(booking.students.second.firstName)"
            notifications.append(AppNotification(
                id: "\(booking.id)-week",
                kind: .weekAhead,
                bookingID: booking.id,
                reportID: nil,
                fireDate: instants.weekAhead,
                title: "Date in seven days",
                body: "\(names) are booked a week from their window."
            ))
            notifications.append(AppNotification(
                id: "\(booking.id)-day",
                kind: .dayOf,
                bookingID: booking.id,
                reportID: nil,
                fireDate: instants.dayOf,
                title: "Date today",
                body: "\(names) are booked today."
            ))
        }
        notifications.append(AppNotification(
            id: "note-report-pending",
            kind: .report,
            bookingID: todayAria.id,
            reportID: pending.id,
            fireDate: pendingAt,
            title: "Safety report",
            body: "Aria reported a concern by the counter."
        ))

        let hours = (1...7).map { weekday in
            DayHours(weekday: weekday, openHour: weekday == 1 ? nil : 8, closeHour: weekday == 1 ? nil : 18)
        }

        let cafe = Cafe(
            name: "Dear Darling Cafe",
            address: "Katipunan Avenue, Quezon City",
            description: "",
            latitude: 14.6097,
            longitude: 120.9896,
            hours: hours,
            gallery: [
                CafePhoto(id: "exterior", caption: "Exterior"),
                CafePhoto(id: "seating", caption: "Seating"),
            ],
            menu: [
                MenuItem(id: "latte", name: "Spanish latte", pricePesos: 160),
                MenuItem(id: "bread", name: "Spanish bread", pricePesos: 85),
                MenuItem(id: "americano", name: "Iced americano", pricePesos: 140),
            ],
            busy: [BusyBlock(id: "busy-tomorrow", start: at(dayOffset: 1, hour: 14), end: at(dayOffset: 1, hour: 17))],
            tier: .senior
        )

        return PartnerSnapshot(
            cafe: cafe,
            bookings: bookings,
            tasks: tasks,
            submissions: submissions,
            reports: [pending, live, expired, closed],
            notifications: notifications.sorted { $0.fireDate > $1.fireDate },
            accounts: [
                StaffAccount(id: "maria", name: "Maria", role: .owner),
                StaffAccount(id: "paolo", name: "Paolo", role: .staff),
            ]
        )
    }

    private static func student(_ raw: String, _ name: String, _ school: String) -> PublicStudent {
        PublicStudent(id: StudentID(raw: raw), firstName: name, school: school, isVerified: true)
    }

    private static func completed(
        _ id: String,
        start: Date,
        end: Date,
        first: PublicStudent,
        second: PublicStudent
    ) -> Booking {
        Booking(
            id: id,
            windowStart: start,
            windowEnd: end,
            students: StudentPair(first: first, second: second),
            state: .completed(at: end, confirmedByCafe: true),
            checkedInStudentIDs: [first.id, second.id]
        )
    }
}
