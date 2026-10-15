import SwiftUI

@main
struct PartnerApp: App {
    @StateObject private var store = PartnerStore.seeded()

    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(store)
                .preferredColorScheme(.light)
        }
    }
}

struct RootView: View {
    @EnvironmentObject private var store: PartnerStore

    var body: some View {
        Group {
            if store.session == nil {
                SignInView()
            } else {
                MainTabView()
            }
        }
    }
}
