import SwiftUI

struct SignInView: View {
    @EnvironmentObject private var store: PartnerStore

    var body: some View {
        VStack(alignment: .leading, spacing: Theme.Spacing.md) {
            VStack(alignment: .leading, spacing: 4) {
                Text("After Class")
                    .partnerTitle()
                Text("Partner")
                    .font(.system(size: 20, weight: .semibold))
                    .foregroundStyle(Theme.Palette.burgundy)
            }
            Text("The first move is showing up.")
                .partnerSubtext()

            PartnerCard {
                VStack(alignment: .leading, spacing: Theme.Spacing.sm) {
                    MockPhotoTile(label: "Exterior", height: 176)
                    VStack(alignment: .leading, spacing: 4) {
                        Text(store.cafe.name)
                            .font(.system(size: 20, weight: .bold))
                            .foregroundStyle(Theme.Palette.ink)
                        Text(store.cafe.address)
                            .partnerSubtext()
                    }
                }
            }

            Spacer(minLength: Theme.Spacing.md)

            VStack(spacing: Theme.Spacing.sm) {
                PrimaryButton(title: "Continue as Maria, owner") {
                    store.signIn("maria")
                }
                .accessibilityIdentifier("sign-in-maria")
                SecondaryButton(title: "Continue as Paolo, staff") {
                    store.signIn("paolo")
                }
                .accessibilityIdentifier("sign-in-paolo")
            }
            .padding(.bottom, Theme.Spacing.sm)
        }
        .padding(.horizontal, Theme.Spacing.gutter)
        .padding(.top, Theme.Spacing.md)
        .partnerScreen()
    }
}

struct MainTabView: View {
    @EnvironmentObject private var store: PartnerStore

    var body: some View {
        TabView {
            TodayView()
                .tabItem { Label("Today", systemImage: "sun.max") }
            CalendarScreen()
                .tabItem { Label("Calendar", systemImage: "calendar") }
            AlertsView()
                .tabItem { Label("Alerts", systemImage: "bell") }
                .badge(store.pendingReports.count)
            if store.isOwner {
                CafeHomeView()
                    .tabItem { Label("Café", systemImage: "storefront") }
            }
        }
        .tint(Theme.Palette.burgundy)
    }
}
