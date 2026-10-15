import Foundation

@MainActor
protocol BookingRepository: AnyObject {
    var bookings: [Booking] { get }
    func booking(_ id: String) -> Booking?
    func visiblePhotos(bookingID: String) -> [PhotoSubmission]
    func confirmDate(_ id: String)
    func markNoShow(_ id: String)
    func confirmReport(_ id: String)
    func resolveReport(_ id: String, outcome: ReportResolution)
}

@MainActor
final class PartnerStore: ObservableObject, BookingRepository {
    @Published private(set) var cafe: Cafe
    @Published private(set) var bookings: [Booking]
    @Published private(set) var tasks: [PhotoTaskDefinition]
    @Published private(set) var submissions: [PhotoSubmission]
    @Published private(set) var reports: [SafetyReport]
    @Published private(set) var notifications: [AppNotification]
    @Published private(set) var accounts: [StaffAccount]
    @Published private(set) var session: StaffAccount?
    let calendar: Calendar

    init(snapshot: PartnerSnapshot, calendar: Calendar) {
        cafe = snapshot.cafe
        bookings = snapshot.bookings
        tasks = snapshot.tasks
        submissions = snapshot.submissions
        reports = snapshot.reports
        notifications = snapshot.notifications
        accounts = snapshot.accounts
        self.calendar = calendar
    }

    static func seeded(now: Date = Date(), calendar: Calendar = .current) -> PartnerStore {
        PartnerStore(snapshot: Seed.snapshot(now: now, calendar: calendar), calendar: calendar)
    }

    var isOwner: Bool { session?.role == .owner }

    var pendingReports: [SafetyReport] {
        reports.filter { if case .reported = $0.status { return true }; return false }
    }

    var customersBroughtIn: Int {
        HostedStats.customers(bookings: bookings)
    }

    var unfinishedProfile: [String] {
        ProfileGaps.unfinished(cafe)
    }

    func signIn(_ id: String) {
        session = accounts.first { $0.id == id } ?? accounts.first
    }

    func signOut() {
        session = nil
    }

    func booking(_ id: String) -> Booking? {
        bookings.first { $0.id == id }
    }

    func student(_ id: StudentID) -> PublicStudent? {
        bookings.flatMap(\.students.both).first { $0.id == id }
    }

    func report(_ id: String) -> SafetyReport? {
        reports.first { $0.id == id }
    }

    func submission(bookingID: String, taskID: String) -> PhotoSubmission? {
        submissions.first { $0.bookingID == bookingID && $0.taskID == taskID }
    }

    func visiblePhotos(bookingID: String) -> [PhotoSubmission] {
        CafePhotoAccess.visible(submissions, bookingID: bookingID)
    }

    func todaysBookings(now: Date = Date()) -> [Booking] {
        bookings
            .filter { calendar.isDate($0.windowStart, inSameDayAs: now) }
            .sorted { $0.windowStart < $1.windowStart }
    }

    func weeksBookings(now: Date = Date()) -> [Booking] {
        guard let interval = calendar.dateInterval(of: .weekOfYear, for: now) else { return [] }
        return bookings
            .filter { $0.windowStart >= interval.start && $0.windowStart < interval.end }
            .filter { !calendar.isDate($0.windowStart, inSameDayAs: now) }
            .sorted { $0.windowStart < $1.windowStart }
    }

    func openToday(now: Date = Date()) -> [Booking] {
        todaysBookings(now: now).filter { if case .scheduled = $0.state { return true }; return false }
    }

    func nextWindow(now: Date = Date()) -> Booking? {
        openToday(now: now).min { $0.windowStart < $1.windowStart }
    }

    func stats(containing date: Date) -> MonthStats {
        HostedStats.month(bookings: bookings, containing: date, calendar: calendar)
    }

    func confirmDate(_ id: String) {
        let now = Date()
        replace(id) { BookingTransition.complete($0, at: now) }
    }

    func markNoShow(_ id: String) {
        let now = Date()
        replace(id) { BookingTransition.noShow($0, at: now) }
    }

    func confirmReport(_ id: String) {
        let now = Date()
        guard let index = reports.firstIndex(where: { $0.id == id }) else { return }
        let actor = session?.name ?? "Staff"
        guard let updated = ReportClock.confirm(
            reports[index],
            now: now,
            latitude: cafe.latitude + 0.0004,
            longitude: cafe.longitude + 0.0002,
            actor: actor
        ) else { return }
        reports[index] = updated
    }

    func resolveReport(_ id: String, outcome: ReportResolution) {
        let now = Date()
        guard let index = reports.firstIndex(where: { $0.id == id }) else { return }
        let actor = session?.name ?? "Staff"
        guard let updated = ReportClock.resolve(reports[index], now: now, outcome: outcome, actor: actor) else { return }
        reports[index] = updated
    }

    func setName(_ name: String) {
        guard isOwner else { return }
        cafe.name = name
    }

    func setAddress(_ address: String) {
        guard isOwner else { return }
        cafe.address = address
    }

    func setDescription(_ description: String) {
        guard isOwner else { return }
        cafe.description = description
    }

    func setHours(weekday: Int, openHour: Int?, closeHour: Int?) {
        guard isOwner, let index = cafe.hours.firstIndex(where: { $0.weekday == weekday }) else { return }
        cafe.hours[index].openHour = openHour
        cafe.hours[index].closeHour = closeHour
    }

    func addBusyBlock(start: Date, end: Date) {
        guard isOwner, start < end else { return }
        let id = "busy-\(Int(start.timeIntervalSince1970))"
        guard !cafe.busy.contains(where: { $0.id == id }) else { return }
        cafe.busy.append(BusyBlock(id: id, start: start, end: end))
    }

    func removeBusyBlock(_ id: String) {
        guard isOwner else { return }
        cafe.busy.removeAll { $0.id == id }
    }

    func addPhoto(caption: String) {
        guard isOwner else { return }
        let trimmed = caption.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }
        cafe.gallery.append(CafePhoto(id: "photo-\(cafe.gallery.count)-\(trimmed)", caption: trimmed))
    }

    func removePhoto(_ id: String) {
        guard isOwner else { return }
        cafe.gallery.removeAll { $0.id == id }
    }

    func addMenuItem(name: String, pricePesos: Int) {
        guard isOwner, pricePesos > 0 else { return }
        let trimmed = name.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }
        cafe.menu.append(MenuItem(id: "menu-\(cafe.menu.count)-\(trimmed)", name: trimmed, pricePesos: pricePesos))
    }

    func removeMenuItem(_ id: String) {
        guard isOwner else { return }
        cafe.menu.removeAll { $0.id == id }
    }

    private func replace(_ id: String, _ transform: (Booking) -> Booking?) {
        guard let index = bookings.firstIndex(where: { $0.id == id }),
              let updated = transform(bookings[index]) else { return }
        var next = bookings
        next[index] = updated
        bookings = next
    }
}
