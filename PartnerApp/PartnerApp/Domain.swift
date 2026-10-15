import Foundation

struct StudentID: Hashable, Equatable {
    let raw: String
}

struct PublicStudent: Identifiable, Hashable, Equatable {
    let id: StudentID
    let firstName: String
    let school: String
    let isVerified: Bool
}

struct StudentPair: Equatable {
    let first: PublicStudent
    let second: PublicStudent

    var both: [PublicStudent] { [first, second] }
}

enum BookingState: Equatable {
    case scheduled
    case completed(at: Date, confirmedByCafe: Bool)
    case noShow(at: Date)
}

struct Booking: Identifiable, Equatable {
    let id: String
    let windowStart: Date
    let windowEnd: Date
    let students: StudentPair
    var state: BookingState
    var checkedInStudentIDs: Set<StudentID>

    var bothInside: Bool {
        checkedInStudentIDs.contains(students.first.id) && checkedInStudentIDs.contains(students.second.id)
    }
}

enum PhotoTaskKind: Equatable {
    case together
    case orders
    case recreation
}

struct PhotoTaskDefinition: Identifiable, Equatable {
    let id: String
    let title: String
    let kind: PhotoTaskKind
}

struct PhotoConsent: Equatable {
    let grantedAt: Date
}

struct PhotoSubmission: Identifiable, Equatable {
    let id: String
    let bookingID: String
    let taskID: String
    let imageLabels: [String]
    let consent: PhotoConsent?
}

enum ReportResolution: Equatable {
    case safelyLeft
    case resolved

    var title: String {
        switch self {
        case .safelyLeft: "Student safely left"
        case .resolved: "Resolved"
        }
    }
}

enum ReportStatus: Equatable {
    case reported(at: Date)
    case confirmed(at: Date, latitude: Double, longitude: Double, expiresAt: Date)
    case resolved(at: Date, outcome: ReportResolution)
}

struct AuditEntry: Identifiable, Equatable {
    let id: String
    let at: Date
    let action: String
}

struct SafetyReport: Identifiable, Equatable {
    let id: String
    let bookingID: String
    let reporterID: StudentID
    let placeInCafe: String
    var status: ReportStatus
    var audit: [AuditEntry]
}

enum StaffRole: Equatable {
    case owner
    case staff
}

struct StaffAccount: Identifiable, Equatable {
    let id: String
    let name: String
    let role: StaffRole
}

enum PartnerTier: Equatable {
    case freshman
    case senior

    var title: String {
        switch self {
        case .freshman: "Freshman"
        case .senior: "Senior"
        }
    }

    var monthlyPesos: Int {
        switch self {
        case .freshman: 2_500
        case .senior: 5_000
        }
    }

    var detail: String {
        switch self {
        case .freshman: "Basic listing."
        case .senior: "Featured and recommended first near the café."
        }
    }
}

struct DayHours: Identifiable, Equatable {
    let weekday: Int
    var openHour: Int?
    var closeHour: Int?

    var id: Int { weekday }

    var isOpen: Bool { openHour != nil && closeHour != nil }
}

struct BusyBlock: Identifiable, Equatable {
    let id: String
    let start: Date
    let end: Date
}

struct MenuItem: Identifiable, Equatable {
    let id: String
    var name: String
    var pricePesos: Int
}

struct CafePhoto: Identifiable, Equatable {
    let id: String
    var caption: String
}

struct Cafe: Equatable {
    var name: String
    var address: String
    var description: String
    var latitude: Double
    var longitude: Double
    var hours: [DayHours]
    var gallery: [CafePhoto]
    var menu: [MenuItem]
    var busy: [BusyBlock]
    var tier: PartnerTier
}

enum NotificationKind: Equatable {
    case weekAhead
    case dayOf
    case report
}

struct AppNotification: Identifiable, Equatable {
    let id: String
    let kind: NotificationKind
    let bookingID: String?
    let reportID: String?
    let fireDate: Date
    let title: String
    let body: String
}

struct PartnerSnapshot {
    var cafe: Cafe
    var bookings: [Booking]
    var tasks: [PhotoTaskDefinition]
    var submissions: [PhotoSubmission]
    var reports: [SafetyReport]
    var notifications: [AppNotification]
    var accounts: [StaffAccount]
}
