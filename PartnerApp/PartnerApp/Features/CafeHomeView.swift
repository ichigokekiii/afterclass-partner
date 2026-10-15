import SwiftUI

struct CafeHomeView: View {
    @EnvironmentObject private var store: PartnerStore
    @State private var path = NavigationPath()

    var body: some View {
        NavigationStack(path: $path) {
            ScrollViewReader { proxy in
                ScrollView {
                    VStack(alignment: .leading, spacing: Theme.Spacing.md) {
                        profileCard
                        sectionMenu(proxy: proxy)
                    }
                    .padding(Theme.Spacing.gutter)
                    .frame(maxWidth: .infinity, alignment: .leading)
                }
            }
            .partnerScreen()
            .navigationTitle("Café")
            .appDestinations()
        }
    }

    private var profileCard: some View {
        PartnerCard {
            VStack(alignment: .leading, spacing: Theme.Spacing.sm) {
                MockPhotoTile(label: store.cafe.gallery.first?.caption ?? "Exterior", height: 156)
                Text("How students see you")
                    .partnerSubtext()
                labeledField("Name", text: Binding(
                    get: { store.cafe.name },
                    set: { store.setName($0) }
                ))
                labeledField("Address", text: Binding(
                    get: { store.cafe.address },
                    set: { store.setAddress($0) }
                ))
                VStack(alignment: .leading, spacing: Theme.Spacing.xs) {
                    Text("Description")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundStyle(Theme.Palette.ink)
                    TextField("What should students know?", text: Binding(
                        get: { store.cafe.description },
                        set: { store.setDescription($0) }
                    ), axis: .vertical)
                    .partnerInputField()
                }
            }
        }
    }

    /// Rows stay on screen. The walk still taps this heading, which brings billing up into reach.
    private func sectionMenu(proxy: ScrollViewProxy) -> some View {
        VStack(alignment: .leading, spacing: Theme.Spacing.sm) {
            Button {
                withAnimation {
                    proxy.scrollTo("cafe-sections", anchor: .top)
                }
            } label: {
                VStack(alignment: .leading, spacing: 2) {
                    Text("Choose a section")
                        .font(.system(size: 20, weight: .bold))
                        .foregroundStyle(Theme.Palette.ink)
                    Text("Hours, photos, menu, preview, billing")
                        .partnerSubtext()
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .frame(minHeight: 44)
                .contentShape(Rectangle())
            }
            .buttonStyle(.plain)
            .accessibilityIdentifier("cafe-section-menu")

            PartnerCard {
                VStack(spacing: 0) {
                    sectionRow("Opening hours", systemImage: "clock", route: .hours)
                    rowDivider
                    sectionRow("Busy times", systemImage: "calendar", route: .busy)
                    rowDivider
                    sectionRow("Photos", systemImage: "photo", route: .gallery)
                    rowDivider
                    sectionRow("Menu", systemImage: "menucard", route: .menu)
                    rowDivider
                    sectionRow("Preview in the student app", systemImage: "eye", route: .preview)
                    rowDivider
                    sectionRow("Tier and billing", systemImage: "creditcard", route: .billing, identifier: "tier-and-billing")
                }
            }
            .id("cafe-sections")
        }
    }

    private var rowDivider: some View {
        Rectangle()
            .fill(Theme.Palette.line)
            .frame(height: 1)
    }

    private func sectionRow(_ title: String, systemImage: String, route: AppRoute, identifier: String? = nil) -> some View {
        Button {
            path.append(route)
        } label: {
            HStack(spacing: Theme.Spacing.sm) {
                Image(systemName: systemImage)
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundStyle(Theme.Palette.burgundy)
                    .frame(width: 28, alignment: .center)
                Text(title)
                    .font(.system(size: 17, weight: .semibold))
                    .foregroundStyle(Theme.Palette.ink)
                    .multilineTextAlignment(.leading)
                Spacer(minLength: Theme.Spacing.xs)
                Image(systemName: "chevron.right")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundStyle(Theme.Palette.burgundy)
            }
            .frame(minHeight: Theme.Spacing.control)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .accessibilityIdentifier(identifier ?? title)
    }

    private func labeledField(_ title: String, text: Binding<String>) -> some View {
        VStack(alignment: .leading, spacing: Theme.Spacing.xs) {
            Text(title)
                .font(.system(size: 14, weight: .semibold))
                .foregroundStyle(Theme.Palette.ink)
            TextField(title, text: text)
                .partnerInputField()
        }
    }

}

struct HoursEditorView: View {
    @EnvironmentObject private var store: PartnerStore

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 12) {
                ForEach(store.cafe.hours) { day in
                    PartnerCard {
                        VStack(alignment: .leading, spacing: 12) {
                            Toggle(weekdayName(day.weekday), isOn: Binding(
                                get: { day.isOpen },
                                set: { open in
                                    if open {
                                        store.setHours(weekday: day.weekday, openHour: 8, closeHour: 18)
                                    } else {
                                        store.setHours(weekday: day.weekday, openHour: nil, closeHour: nil)
                                    }
                                }
                            ))
                            .font(.system(size: 17, weight: .semibold))
                            .tint(Theme.Palette.burgundy)
                            if day.isOpen {
                                Stepper("Opens \(hourLabel(day.openHour ?? 8))", value: Binding(
                                    get: { day.openHour ?? 8 },
                                    set: { store.setHours(weekday: day.weekday, openHour: $0, closeHour: day.closeHour) }
                                ), in: 6...20)
                                Stepper("Closes \(hourLabel(day.closeHour ?? 18))", value: Binding(
                                    get: { day.closeHour ?? 18 },
                                    set: { store.setHours(weekday: day.weekday, openHour: day.openHour, closeHour: $0) }
                                ), in: 8...23)
                            }
                        }
                    }
                }
            }
            .padding(Theme.Spacing.gutter)
        }
        .partnerScreen()
        .navigationTitle("Hours")
        .navigationBarTitleDisplayMode(.inline)
    }

    private func weekdayName(_ weekday: Int) -> String {
        let symbols = store.calendar.weekdaySymbols
        guard weekday >= 1, weekday <= symbols.count else { return "Day" }
        return symbols[weekday - 1]
    }

    private func hourLabel(_ hour: Int) -> String {
        var parts = DateComponents()
        parts.hour = hour
        let date = store.calendar.date(from: parts) ?? Date()
        return date.formatted(date: .omitted, time: .shortened)
    }
}

struct BusyEditorView: View {
    @EnvironmentObject private var store: PartnerStore

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: Theme.Spacing.md) {
                Text("Dates that overlap a busy block will not be offered to students.")
                    .partnerBody()
                if store.cafe.busy.isEmpty {
                    Text("No busy blocks.")
                        .partnerSubtext()
                }
                ForEach(store.cafe.busy) { block in
                    PartnerCard {
                        HStack {
                            Text(DateWindow.label(start: block.start, end: block.end))
                                .partnerBody()
                            Spacer()
                            Button("Remove") { store.removeBusyBlock(block.id) }
                                .font(.system(size: 15, weight: .semibold))
                                .foregroundStyle(Theme.Palette.burgundy)
                                .frame(minHeight: 44)
                        }
                    }
                }
            }
            .padding(Theme.Spacing.gutter)
        }
        .safeAreaInset(edge: .bottom) {
            BottomActionBar {
                PrimaryButton(title: "Block tomorrow, 2:00 PM to 5:00 PM") {
                    let start = tomorrow(hour: 14)
                    let end = tomorrow(hour: 17)
                    store.addBusyBlock(start: start, end: end)
                }
            }
        }
        .partnerScreen()
        .navigationTitle("Busy times")
        .navigationBarTitleDisplayMode(.inline)
    }

    private func tomorrow(hour: Int) -> Date {
        let day = store.calendar.date(byAdding: .day, value: 1, to: store.calendar.startOfDay(for: Date())) ?? Date()
        return store.calendar.date(bySettingHour: hour, minute: 0, second: 0, of: day) ?? day
    }
}

struct GalleryEditorView: View {
    @EnvironmentObject private var store: PartnerStore
    @State private var caption = ""

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: Theme.Spacing.md) {
                PartnerCard {
                    VStack(alignment: .leading, spacing: 12) {
                        Text("New photo")
                            .font(.system(size: 16, weight: .semibold))
                        TextField("Photo caption", text: $caption)
                            .partnerInputField()
                        PrimaryButton(title: "Add photo") {
                            store.addPhoto(caption: caption)
                            caption = ""
                        }
                    }
                }
                ForEach(store.cafe.gallery) { photo in
                    photoCard(photo.caption) {
                        store.removePhoto(photo.id)
                    }
                }
            }
            .padding(Theme.Spacing.gutter)
        }
        .partnerScreen()
        .navigationTitle("Photos")
        .navigationBarTitleDisplayMode(.inline)
    }
}

struct MenuEditorView: View {
    @EnvironmentObject private var store: PartnerStore
    @State private var name = ""
    @State private var price = 150

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: Theme.Spacing.md) {
                PartnerCard {
                    VStack(alignment: .leading, spacing: 12) {
                        TextField("Item name", text: $name)
                            .partnerInputField()
                        Stepper("Price \(Peso.string(price))", value: $price, in: 20...2000, step: 10)
                            .partnerBody()
                        PrimaryButton(title: "Add menu item") {
                            store.addMenuItem(name: name, pricePesos: price)
                            name = ""
                        }
                    }
                }
                if store.cafe.menu.isEmpty {
                    Text("No menu items yet.")
                        .partnerSubtext()
                }
                ForEach(store.cafe.menu) { item in
                    PartnerCard {
                        HStack {
                            VStack(alignment: .leading, spacing: 4) {
                                Text(item.name)
                                    .font(.system(size: 17, weight: .semibold))
                                Text(Peso.string(item.pricePesos))
                                    .partnerSubtext()
                            }
                            Spacer()
                            Button("Remove") { store.removeMenuItem(item.id) }
                                .font(.system(size: 15, weight: .semibold))
                                .foregroundStyle(Theme.Palette.burgundy)
                                .frame(minHeight: 44)
                        }
                    }
                }
            }
            .padding(Theme.Spacing.gutter)
        }
        .partnerScreen()
        .navigationTitle("Menu")
        .navigationBarTitleDisplayMode(.inline)
    }
}

private func photoCard(_ caption: String, remove: @escaping () -> Void) -> some View {
    PartnerCard {
        VStack(alignment: .leading, spacing: 12) {
            MockPhotoTile(label: caption, height: 164)
            HStack {
                Text(caption)
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundStyle(Theme.Palette.ink)
                Spacer()
                Button("Remove", action: remove)
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundStyle(Theme.Palette.burgundy)
                    .frame(minHeight: 44)
            }
        }
    }
}

struct CafePreviewView: View {
    @EnvironmentObject private var store: PartnerStore
    @State private var showMenu = false

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: Theme.Spacing.md) {
                MockPhotoTile(label: store.cafe.gallery.first?.caption ?? store.cafe.name, height: 220)
                VStack(alignment: .leading, spacing: Theme.Spacing.sm) {
                    HStack(alignment: .center) {
                        Text(store.cafe.name)
                            .partnerTitle()
                        Spacer()
                        if store.cafe.tier == .senior {
                            StatusChip(title: "Featured", resolved: true)
                        }
                    }
                    Text(hoursLine)
                        .partnerSubtext()
                    if !store.cafe.description.isEmpty {
                        Text(store.cafe.description)
                            .partnerBody()
                    }
                    Picker("Page", selection: $showMenu) {
                        Text("Photos").tag(false)
                        Text("Menu").tag(true)
                    }
                    .pickerStyle(.segmented)
                    if showMenu {
                        menu
                    } else {
                        photos
                    }
                    PartnerCard {
                        VStack(alignment: .leading, spacing: 6) {
                            Text("Location")
                                .font(.system(size: 18, weight: .bold))
                            Text(store.cafe.address)
                                .partnerBody()
                            Text("Shown on the map in the student app")
                                .partnerSubtext()
                        }
                    }
                }
            }
            .padding(Theme.Spacing.gutter)
        }
        .partnerScreen()
        .navigationTitle("Preview")
        .navigationBarTitleDisplayMode(.inline)
    }

    private var hoursLine: String {
        let open = store.cafe.hours.filter(\.isOpen)
        if open.isEmpty { return "Hours not set" }
        return "Open on \(open.count) days"
    }

    private var photos: some View {
        VStack(alignment: .leading, spacing: 12) {
            if store.cafe.gallery.isEmpty {
                Text("No photos yet.")
                    .partnerSubtext()
            }
            ForEach(store.cafe.gallery) { photo in
                MockPhotoTile(label: photo.caption, height: 164)
            }
        }
    }

    private var menu: some View {
        VStack(alignment: .leading, spacing: 12) {
            if store.cafe.menu.isEmpty {
                Text("No menu yet.")
                    .partnerSubtext()
            }
            ForEach(store.cafe.menu) { item in
                PartnerCard {
                    HStack {
                        Text(item.name)
                            .partnerBody()
                        Spacer()
                        Text(Peso.string(item.pricePesos))
                            .font(.system(size: 17, weight: .semibold))
                    }
                }
            }
        }
    }
}

struct BillingView: View {
    @EnvironmentObject private var store: PartnerStore

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: Theme.Spacing.md) {
                PartnerCard {
                    VStack(alignment: .leading, spacing: 10) {
                        HStack {
                            Text(store.cafe.tier.title)
                                .partnerHeader()
                            Spacer()
                            StatusChip(title: "Active tier", resolved: true)
                        }
                        Text(store.cafe.tier.detail)
                            .partnerBody()
                        Text("\(Peso.string(store.cafe.tier.monthlyPesos)) a month")
                            .font(.system(size: 18, weight: .bold))
                            .foregroundStyle(Theme.Palette.burgundy)
                    }
                }
                let customers = store.customersBroughtIn
                PartnerCard {
                    VStack(alignment: .leading, spacing: 12) {
                        Text("\(customers) of 500 customers")
                            .partnerHeader()
                            .accessibilityLabel("\(customers) of 500 customers")
                            .accessibilityIdentifier("billing-customers")
                        ProgressView(value: Double(min(customers, 500)), total: 500)
                            .tint(Theme.Palette.burgundy)
                        Text(customers < 500 ? "Free until 500 customers. Then the monthly fee starts." : "Monthly billing has started.")
                            .partnerBody()
                    }
                }
                Text("This screen does not take payment.")
                    .partnerSubtext()
            }
            .padding(Theme.Spacing.gutter)
        }
        .partnerScreen()
        .navigationTitle("Billing")
        .navigationBarTitleDisplayMode(.inline)
    }
}
