import SwiftUI

enum AppRoute: Hashable {
    case hours
    case busy
    case gallery
    case menu
    case preview
    case billing
    case booking(String)
    case report(String)
    case student(StudentID)
}

extension View {
    func appDestinations() -> some View {
        navigationDestination(for: AppRoute.self) { route in
            switch route {
            case .hours:
                HoursEditorView()
            case .busy:
                BusyEditorView()
            case .gallery:
                GalleryEditorView()
            case .menu:
                MenuEditorView()
            case .preview:
                CafePreviewView()
            case .billing:
                BillingView()
            case .booking(let id):
                DateDetailView(bookingID: id)
            case .report(let id):
                ReportDetailView(reportID: id)
            case .student(let id):
                StudentProfileView(studentID: id)
            }
        }
    }
}
