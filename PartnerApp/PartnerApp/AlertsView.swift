import SwiftUI

struct AlertsView: View {
    @EnvironmentObject private var store: PartnerStore

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: Theme.Spacing.md) {
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Reports")
                            .font(.system(size: 20, weight: .bold))
                        ForEach(store.reports) { report in
                            NavigationLink(value: AppRoute.report(report.id)) {
                                ReportRow(report: report)
                            }
                            .buttonStyle(.plain)
                            .accessibilityIdentifier("alert-report-\(report.id)")
                        }
                    }
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Inbox")
                            .font(.system(size: 20, weight: .bold))
                        ForEach(store.notifications) { note in
                            inboxLink(note)
                        }
                    }
                }
                .padding(Theme.Spacing.gutter)
            }
            .partnerScreen()
            .navigationTitle("Alerts")
            .appDestinations()
        }
    }

    @ViewBuilder
    private func inboxLink(_ note: AppNotification) -> some View {
        if let reportID = note.reportID {
            NavigationLink(value: AppRoute.report(reportID)) { inboxRow(note) }
                .buttonStyle(.plain)
        } else if let bookingID = note.bookingID {
            NavigationLink(value: AppRoute.booking(bookingID)) { inboxRow(note) }
                .buttonStyle(.plain)
        } else {
            inboxRow(note)
        }
    }

    private func inboxRow(_ note: AppNotification) -> some View {
        PartnerCard {
            VStack(alignment: .leading, spacing: 10) {
                HStack {
                    Text(kindTitle(note.kind))
                        .font(.system(size: 13, weight: .bold))
                        .foregroundStyle(Theme.Palette.burgundy)
                    Spacer()
                    if note.kind == .report {
                        StatusChip(title: "Urgent", urgent: true)
                    } else {
                        Text(note.fireDate.formatted(date: .abbreviated, time: .shortened))
                            .partnerSubtext()
                    }
                }
                Text(note.title)
                    .font(.system(size: 17, weight: .bold))
                    .foregroundStyle(Theme.Palette.ink)
                Text(note.body)
                    .partnerBody()
                if let bookingID = note.bookingID, let booking = store.booking(bookingID) {
                    HStack(spacing: 10) {
                        HStack(spacing: -8) {
                            StudentAvatar(name: booking.students.first.firstName, side: 32)
                            StudentAvatar(name: booking.students.second.firstName, side: 32)
                        }
                        Text("\(booking.students.first.firstName) and \(booking.students.second.firstName)")
                            .partnerSubtext()
                    }
                }
            }
        }
    }

    private func kindTitle(_ kind: NotificationKind) -> String {
        switch kind {
        case .weekAhead: "7 days before"
        case .dayOf: "Day of the date"
        case .report: "Safety report"
        }
    }
}

struct ReportDetailView: View {
    let reportID: String
    @EnvironmentObject private var store: PartnerStore

    var body: some View {
        Group {
            if let report = store.report(reportID) {
                content(report)
            } else {
                Text("This report is no longer on the list.")
                    .partnerBody()
            }
        }
        .partnerScreen()
        .navigationTitle("Report")
        .navigationBarTitleDisplayMode(.inline)
    }

    private func content(_ report: SafetyReport) -> some View {
        ScrollView {
            VStack(alignment: .leading, spacing: Theme.Spacing.md) {
                PartnerCard {
                    VStack(alignment: .leading, spacing: 12) {
                        HStack(spacing: 12) {
                            if let reporter = store.student(report.reporterID) {
                                StudentAvatar(name: reporter.firstName, side: 52)
                                VStack(alignment: .leading, spacing: 4) {
                                    Text(reporter.firstName)
                                        .font(.system(size: 18, weight: .bold))
                                    Text(report.placeInCafe)
                                        .partnerBody()
                                }
                            } else {
                                Text(report.placeInCafe)
                                    .partnerHeader()
                            }
                            Spacer()
                        }
                        statusLine(report)
                    }
                }
                location(report)
                VStack(alignment: .leading, spacing: 12) {
                    Text("Audit")
                        .font(.system(size: 20, weight: .bold))
                    ForEach(report.audit) { entry in
                        PartnerCard {
                            VStack(alignment: .leading, spacing: 4) {
                                Text(entry.action)
                                    .partnerBody()
                                Text(entry.at.formatted(date: .abbreviated, time: .shortened))
                                    .partnerSubtext()
                            }
                        }
                    }
                }
            }
            .padding(Theme.Spacing.gutter)
        }
        .safeAreaInset(edge: .bottom) {
            bottomBar(report)
        }
    }

    private func statusLine(_ report: SafetyReport) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            step("Reported", done: true, resolved: false)
            step("Confirmed by café", done: isConfirmed(report) || isResolved(report), resolved: false)
            step("Student safely left", done: isResolved(report), resolved: isResolved(report))
        }
    }

    private func step(_ title: String, done: Bool, resolved: Bool) -> some View {
        HStack(spacing: 10) {
            Image(systemName: done ? "checkmark.circle.fill" : "circle")
                .foregroundStyle(done ? Theme.Palette.burgundy : Theme.Palette.gray)
            if resolved {
                StatusChip(title: title, resolved: true)
            } else {
                Text(title)
                    .partnerBody()
                    .foregroundStyle(done ? Theme.Palette.ink : Theme.Palette.gray)
            }
        }
    }

    @ViewBuilder
    private func location(_ report: SafetyReport) -> some View {
        if let pin = ReportClock.pin(for: report, now: Date()) {
            PartnerCard {
                VStack(alignment: .leading, spacing: Theme.Spacing.sm) {
                    HStack(spacing: Theme.Spacing.xs) {
                        Image(systemName: "location.fill")
                            .font(.system(size: 22))
                            .foregroundStyle(Theme.Palette.burgundy)
                        Text(LiveLocationCopy.statusTitle)
                            .font(.system(size: 18, weight: .bold))
                    }
                    liveLocationMapPreview
                    Text(LiveLocationCopy.placeLine(cafeName: store.cafe.name, reportPlace: report.placeInCafe))
                        .partnerBody()
                    Text(LiveLocationCopy.subtitle(cafeName: store.cafe.name))
                        .partnerSubtext()
                    Text("Sharing until \(pin.expiresAt.formatted(date: .abbreviated, time: .shortened))")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundStyle(Theme.Palette.burgundy)
                }
            }
            .accessibilityElement(children: .combine)
            .accessibilityIdentifier("report-location")
            .accessibilityLabel(LiveLocationCopy.statusTitle)
        } else if case .confirmed = report.status {
            Text("Location share ended.")
                .partnerBody()
                .accessibilityIdentifier("location-ended")
        }
    }

    @ViewBuilder
    private func bottomBar(_ report: SafetyReport) -> some View {
        switch report.status {
        case .reported:
            BottomActionBar {
                PrimaryButton(title: "Confirm report") {
                    store.confirmReport(report.id)
                }
                .accessibilityIdentifier("confirm-report")
            }
        case .confirmed:
            BottomActionBar {
                PrimaryButton(title: "Student safely left") {
                    store.resolveReport(report.id, outcome: .safelyLeft)
                }
                .accessibilityIdentifier("resolve-report")
            }
        case .resolved:
            EmptyView()
        }
    }

    private func isConfirmed(_ report: SafetyReport) -> Bool {
        if case .confirmed = report.status { return true }
        return false
    }

    private func isResolved(_ report: SafetyReport) -> Bool {
        if case .resolved = report.status { return true }
        return false
    }

    private var liveLocationMapPreview: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 16, style: .continuous)
                .fill(
                    LinearGradient(
                        colors: [Theme.Palette.surface, Theme.Palette.line.opacity(0.6)],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )
            Image(systemName: "mappin.circle.fill")
                .font(.system(size: 44))
                .foregroundStyle(Theme.Palette.burgundy)
                .shadow(color: .black.opacity(0.12), radius: 4, y: 2)
        }
        .frame(maxWidth: .infinity)
        .frame(height: 140)
        .accessibilityHidden(true)
    }
}
