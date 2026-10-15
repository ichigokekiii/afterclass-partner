import SwiftUI

struct DateDetailView: View {
    let bookingID: String
    @EnvironmentObject private var store: PartnerStore

    var body: some View {
        Group {
            if let booking = store.booking(bookingID) {
                content(booking)
            } else {
                Text("This date is no longer on the list.")
                    .partnerBody()
            }
        }
        .partnerScreen()
        .navigationTitle("Date")
        .navigationBarTitleDisplayMode(.inline)
    }

    private func content(_ booking: Booking) -> some View {
        ScrollView {
            VStack(alignment: .leading, spacing: Theme.Spacing.md) {
                PartnerCard {
                    VStack(alignment: .leading, spacing: 10) {
                        HStack {
                            Text("\(booking.students.first.firstName) and \(booking.students.second.firstName)")
                                .partnerHeader()
                            Spacer()
                            stateChip(booking.state)
                        }
                        Text(DateWindow.label(start: booking.windowStart, end: booking.windowEnd))
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundStyle(Theme.Palette.burgundy)
                        Text(checkInLine(booking))
                            .partnerBody()
                            .accessibilityIdentifier("check-in-line")
                        if case .completed = booking.state {
                            Text("This date counts toward customers brought in.")
                                .partnerSubtext()
                        }
                    }
                }
                students(booking)
                photos(booking)
            }
            .padding(Theme.Spacing.gutter)
        }
        .safeAreaInset(edge: .bottom) {
            bottomBar(booking)
        }
    }

    @ViewBuilder
    private func stateChip(_ state: BookingState) -> some View {
        switch state {
        case .scheduled:
            StatusChip(title: "Scheduled")
        case .completed:
            StatusChip(title: "Completed", resolved: true)
        case .noShow:
            StatusChip(title: "No-show")
        }
    }

    private func checkInLine(_ booking: Booking) -> String {
        if booking.bothInside { return "Both students are inside." }
        let count = booking.checkedInStudentIDs.count
        if count == 1 { return "One student is inside." }
        return "Neither student is inside yet."
    }

    private func students(_ booking: Booking) -> some View {
        VStack(alignment: .leading, spacing: Theme.Spacing.sm) {
            Text("Students")
                .font(.system(size: 20, weight: .bold))
            ForEach(booking.students.both, id: \.id) { student in
                NavigationLink(value: AppRoute.student(student.id)) {
                    PartnerCard {
                        HStack(spacing: Theme.Spacing.sm) {
                            StudentAvatar(name: student.firstName, side: 52)
                            VStack(alignment: .leading, spacing: 4) {
                                Text(student.firstName)
                                    .font(.system(size: 18, weight: .semibold))
                                    .foregroundStyle(Theme.Palette.ink)
                                Text(student.school)
                                    .partnerSubtext()
                            }
                            Spacer()
                            if student.isVerified {
                                StatusChip(title: "Verified", resolved: true)
                            }
                            Image(systemName: "chevron.right")
                                .font(.system(size: 14, weight: .semibold))
                                .foregroundStyle(Theme.Palette.burgundy)
                        }
                    }
                }
                .buttonStyle(.plain)
            }
        }
    }

    private func photos(_ booking: Booking) -> some View {
        VStack(alignment: .leading, spacing: Theme.Spacing.sm) {
            Text("Photos")
                .font(.system(size: 20, weight: .bold))
            ForEach(store.tasks) { task in
                photoTask(task, bookingID: booking.id)
            }
        }
    }

    private func photoTask(_ task: PhotoTaskDefinition, bookingID: String) -> some View {
        let submission = store.submission(bookingID: bookingID, taskID: task.id)
        let visible = store.visiblePhotos(bookingID: bookingID).first { $0.taskID == task.id }
        return PartnerCard {
            VStack(alignment: .leading, spacing: Theme.Spacing.sm) {
                Text(task.title)
                    .font(.system(size: 17, weight: .semibold))
                if let visible {
                    if visible.imageLabels.count > 1 {
                        HStack(spacing: 12) {
                            ForEach(visible.imageLabels, id: \.self) { label in
                                photoTile(label, height: 140)
                            }
                        }
                    } else {
                        ForEach(visible.imageLabels, id: \.self) { label in
                            photoTile(label, height: 172)
                        }
                    }
                } else if submission != nil {
                    Text("Waiting for the students to share these photos.")
                        .partnerBody()
                        .accessibilityIdentifier("photos-waiting-\(task.id)")
                } else {
                    Text("No photos for this task.")
                        .partnerSubtext()
                        .accessibilityIdentifier("photos-empty-\(task.id)")
                }
            }
        }
    }

    private func photoTile(_ label: String, height: CGFloat = 160) -> some View {
        MockPhotoTile(label: label, height: height)
    }

    @ViewBuilder
    private func bottomBar(_ booking: Booking) -> some View {
        if case .scheduled = booking.state {
            BottomActionBar {
                if booking.bothInside {
                    PrimaryButton(title: "Confirm date happened") {
                        store.confirmDate(booking.id)
                    }
                    .accessibilityIdentifier("confirm-date")
                } else {
                    Text("Confirm is available once both students are inside.")
                        .partnerSubtext()
                }
                SecondaryButton(title: "Mark no-show") {
                    store.markNoShow(booking.id)
                }
            }
        }
    }
}

struct StudentProfileView: View {
    let studentID: StudentID
    @EnvironmentObject private var store: PartnerStore

    var body: some View {
        Group {
            if let student = store.student(studentID) {
                ScrollView {
                    VStack(alignment: .leading, spacing: Theme.Spacing.md) {
                        PartnerCard {
                            VStack(alignment: .leading, spacing: Theme.Spacing.sm) {
                                HStack(spacing: Theme.Spacing.sm) {
                                    StudentAvatar(name: student.firstName, side: 84)
                                    VStack(alignment: .leading, spacing: 6) {
                                        Text(student.firstName)
                                            .partnerTitle()
                                        if student.isVerified {
                                            StatusChip(title: "Verified", resolved: true)
                                        }
                                    }
                                }
                                Text(student.school)
                                    .partnerBody()
                                Text("Email, phone, ID, and emergency contact stay off this screen.")
                                    .partnerSubtext()
                            }
                        }
                    }
                    .padding(Theme.Spacing.gutter)
                    .frame(maxWidth: .infinity, alignment: .leading)
                }
            } else {
                Text("This profile is not available.")
                    .partnerBody()
                    .padding(Theme.Spacing.gutter)
            }
        }
        .partnerScreen()
        .navigationTitle("Profile")
        .navigationBarTitleDisplayMode(.inline)
    }
}
