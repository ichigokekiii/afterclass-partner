import SwiftUI

struct TodayView: View {
    @EnvironmentObject private var store: PartnerStore

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: Theme.Spacing.md) {
                    brandBar
                    summary
                    customersCard
                    bookingSection("Today", bookings: store.todaysBookings())
                    bookingSection("This week", bookings: store.weeksBookings())
                    if !store.pendingReports.isEmpty {
                        reportSection
                    }
                    if store.isOwner, !store.unfinishedProfile.isEmpty {
                        unfinished
                    }
                    stats
                }
                .padding(Theme.Spacing.gutter)
            }
            .partnerScreen()
            .navigationTitle("Today")
            .appDestinations()
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Sign out") { store.signOut() }
                        .font(.system(size: 15, weight: .semibold))
                        .foregroundStyle(Theme.Palette.burgundy)
                        .accessibilityIdentifier("sign-out")
                }
            }
        }
    }

    private var brandBar: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(store.cafe.name)
                .font(.system(size: 24, weight: .bold))
                .foregroundStyle(Theme.Palette.ink)
            if let session = store.session {
                Text("Signed in as \(session.name)")
                    .partnerSubtext()
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    private var summary: some View {
        let open = store.openToday()
        return VStack(alignment: .leading, spacing: 10) {
            VStack(alignment: .leading, spacing: 4) {
                Text("ACTIVE SCHEDULE")
                    .font(.system(size: 12, weight: .bold))
                    .tracking(0.8)
                    .foregroundStyle(Theme.Palette.white.opacity(0.75))
                Text("\(open.count) still open")
                    .font(.system(size: 32, weight: .bold))
                    .foregroundStyle(Theme.Palette.white)
            }
            if let next = store.nextWindow() {
                Text("Next, \(next.windowStart.formatted(date: .omitted, time: .shortened))")
                    .font(.system(size: 17, weight: .medium))
                    .foregroundStyle(Theme.Palette.white.opacity(0.9))
            } else {
                Text("Nothing else open today")
                    .font(.system(size: 17, weight: .medium))
                    .foregroundStyle(Theme.Palette.white.opacity(0.9))
            }
        }
        .padding(Theme.Spacing.md)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Theme.Palette.burgundy)
        .clipShape(RoundedRectangle(cornerRadius: 24, style: .continuous))
        .shadow(color: Theme.Palette.burgundy.opacity(0.22), radius: 14, x: 0, y: 6)
    }

    private var customersCard: some View {
        PartnerCard {
            HStack(spacing: 12) {
                Circle()
                    .fill(Theme.Palette.burgundy.opacity(0.1))
                    .frame(width: 44, height: 44)
                    .overlay {
                        Image(systemName: "person.2.fill")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundStyle(Theme.Palette.burgundy)
                    }
                VStack(alignment: .leading, spacing: 2) {
                    Text("\(store.customersBroughtIn) customers brought in")
                        .font(.system(size: 18, weight: .bold))
                        .foregroundStyle(Theme.Palette.ink)
                        .accessibilityIdentifier("customers-brought-in")
                    Text("2 customers per completed date")
                        .partnerSubtext()
                }
                Spacer()
            }
        }
    }

    private func bookingSection(_ title: String, bookings: [Booking]) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(title)
                .font(.system(size: 20, weight: .bold))
                .foregroundStyle(Theme.Palette.ink)
            if bookings.isEmpty {
                PartnerCard {
                    Text("No dates in this list.")
                        .partnerSubtext()
                }
            }
            ForEach(bookings) { booking in
                NavigationLink(value: AppRoute.booking(booking.id)) {
                    BookingRow(booking: booking)
                }
                .buttonStyle(.plain)
                .accessibilityIdentifier("booking-\(booking.id)")
            }
        }
    }

    private var reportSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Pending reports")
                .font(.system(size: 20, weight: .bold))
                .foregroundStyle(Theme.Palette.ink)
            ForEach(store.pendingReports) { report in
                NavigationLink(value: AppRoute.report(report.id)) {
                    ReportRow(report: report)
                }
                .buttonStyle(.plain)
                .accessibilityIdentifier("report-\(report.id)")
            }
        }
    }

    private var unfinished: some View {
        PartnerCard {
            VStack(alignment: .leading, spacing: 8) {
                Text("Finish the café page")
                    .font(.system(size: 18, weight: .bold))
                ForEach(store.unfinishedProfile, id: \.self) { item in
                    HStack(spacing: 8) {
                        Circle()
                            .fill(Theme.Palette.burgundy)
                            .frame(width: 6, height: 6)
                        Text(item)
                            .partnerSubtext()
                    }
                }
            }
        }
    }

    private var stats: some View {
        let current = store.stats(containing: Date())
        let previousDate = store.calendar.date(byAdding: .month, value: -1, to: Date()) ?? Date()
        let previous = store.stats(containing: previousDate)
        return VStack(alignment: .leading, spacing: 12) {
            Text("This month")
                .font(.system(size: 20, weight: .bold))
            statCard(current)
            Text("Last month")
                .font(.system(size: 20, weight: .bold))
            statCard(previous)
        }
    }

    private func statCard(_ stats: MonthStats) -> some View {
        PartnerCard {
            VStack(alignment: .leading, spacing: 6) {
                Text("\(stats.hosted) hosted")
                    .font(.system(size: 17, weight: .semibold))
                    .foregroundStyle(Theme.Palette.ink)
                Text("\(stats.completed) completed")
                    .partnerBody()
                Text("\(stats.customers) customers from those dates")
                    .partnerSubtext()
            }
        }
    }
}

struct BookingRow: View {
    let booking: Booking

    var body: some View {
        PartnerCard {
            HStack(spacing: 14) {
                HStack(spacing: -10) {
                    StudentAvatar(name: booking.students.first.firstName, side: 44)
                    StudentAvatar(name: booking.students.second.firstName, side: 44)
                }
                VStack(alignment: .leading, spacing: 4) {
                    Text("\(booking.students.first.firstName) and \(booking.students.second.firstName)")
                        .font(.system(size: 17, weight: .bold))
                        .foregroundStyle(Theme.Palette.ink)
                    Text(DateWindow.label(start: booking.windowStart, end: booking.windowEnd))
                        .partnerSubtext()
                }
                Spacer(minLength: 8)
                stateMark
            }
        }
    }

    @ViewBuilder
    private var stateMark: some View {
        switch booking.state {
        case .scheduled:
            StatusChip(title: "Scheduled")
        case .completed:
            StatusChip(title: "Completed", resolved: true)
        case .noShow:
            StatusChip(title: "No-show")
        }
    }
}

struct ReportRow: View {
    let report: SafetyReport

    var body: some View {
        PartnerCard {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text(report.placeInCafe)
                        .font(.system(size: 17, weight: .bold))
                        .foregroundStyle(Theme.Palette.ink)
                    Text(statusTitle)
                        .partnerSubtext()
                }
                Spacer()
                if isPending {
                    StatusChip(title: "Urgent", urgent: true)
                }
            }
        }
    }

    private var isPending: Bool {
        if case .reported = report.status { return true }
        return false
    }

    private var statusTitle: String {
        switch report.status {
        case .reported:
            "Reported"
        case .confirmed:
            "Confirmed by café"
        case .resolved(_, let outcome):
            outcome.title
        }
    }
}
