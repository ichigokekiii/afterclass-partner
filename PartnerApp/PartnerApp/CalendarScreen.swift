import SwiftUI

enum CalendarScope: String, CaseIterable, Identifiable {
    case month = "Month"
    case week = "Week"
    case day = "Day"

    var id: String { rawValue }
}

struct CalendarScreen: View {
    @EnvironmentObject private var store: PartnerStore
    @State private var scope: CalendarScope = .month
    @State private var selected = Date()

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: Theme.Spacing.md) {
                    Picker("Range", selection: $scope) {
                        ForEach(CalendarScope.allCases) { item in
                            Text(item.rawValue).tag(item)
                        }
                    }
                    .pickerStyle(.segmented)
                    switch scope {
                    case .month:
                        PartnerCard {
                            MonthGrid(selected: $selected)
                        }
                    case .week:
                        WeekStrip(selected: $selected)
                    case .day:
                        EmptyView()
                    }
                    Text(selected.formatted(date: .complete, time: .omitted))
                        .font(.system(size: 20, weight: .bold))
                    let bookings = store.bookings
                        .filter { store.calendar.isDate($0.windowStart, inSameDayAs: selected) }
                        .sorted { $0.windowStart < $1.windowStart }
                    if bookings.isEmpty {
                        PartnerCard {
                            Text("No dates this day.")
                                .partnerSubtext()
                        }
                    }
                    ForEach(bookings) { booking in
                        NavigationLink(value: AppRoute.booking(booking.id)) {
                            BookingRow(booking: booking)
                        }
                        .buttonStyle(.plain)
                    }
                }
                .padding(Theme.Spacing.gutter)
            }
            .partnerScreen()
            .navigationTitle("Calendar")
            .appDestinations()
        }
    }
}

private struct MonthGrid: View {
    @EnvironmentObject private var store: PartnerStore
    @Binding var selected: Date

    var body: some View {
        VStack(spacing: Theme.Spacing.sm) {
            HStack {
                Button {
                    shift(months: -1)
                } label: {
                    Image(systemName: "chevron.left")
                        .frame(width: 44, height: 44)
                }
                Spacer()
                Text(monthTitle)
                    .font(.system(size: 18, weight: .bold))
                Spacer()
                Button {
                    shift(months: 1)
                } label: {
                    Image(systemName: "chevron.right")
                        .frame(width: 44, height: 44)
                }
            }
            .foregroundStyle(Theme.Palette.burgundy)
            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 7), spacing: 8) {
                ForEach(Array(weekdaySymbols.enumerated()), id: \.offset) { _, symbol in
                    Text(symbol)
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundStyle(Theme.Palette.gray)
                }
                ForEach(slots) { slot in
                    if let day = slot.day {
                        dayButton(day)
                    } else {
                        Color.clear.frame(height: 40)
                    }
                }
            }
        }
    }

    private var monthTitle: String {
        selected.formatted(.dateTime.month(.wide).year())
    }

    private var weekdaySymbols: [String] {
        let symbols = store.calendar.veryShortWeekdaySymbols
        let start = store.calendar.firstWeekday - 1
        return Array(symbols[start...] + symbols[..<start])
    }

    private var slots: [MonthSlot] {
        let calendar = store.calendar
        let parts = calendar.dateComponents([.year, .month], from: selected)
        guard let first = calendar.date(from: parts),
              let range = calendar.range(of: .day, in: .month, for: first) else { return [] }
        let weekday = calendar.component(.weekday, from: first)
        let pad = (weekday - calendar.firstWeekday + 7) % 7
        var items: [MonthSlot] = (0..<pad).map { MonthSlot(id: -($0 + 1), day: nil) }
        for day in range {
            guard let date = calendar.date(byAdding: .day, value: day - 1, to: first) else { continue }
            items.append(MonthSlot(id: day, day: date))
        }
        return items
    }

    private func dayButton(_ day: Date) -> some View {
        let count = store.bookings.filter { store.calendar.isDate($0.windowStart, inSameDayAs: day) }.count
        let isSelected = store.calendar.isDate(day, inSameDayAs: selected)
        return Button {
            selected = day
        } label: {
            VStack(spacing: 3) {
                Text("\(store.calendar.component(.day, from: day))")
                    .font(.system(size: 15, weight: isSelected ? .bold : .medium))
                    .foregroundStyle(isSelected ? Theme.Palette.white : Theme.Palette.ink)
                Circle()
                    .fill(count > 0 ? (isSelected ? Theme.Palette.white : Theme.Palette.burgundy) : Color.clear)
                    .frame(width: 5, height: 5)
            }
            .frame(maxWidth: .infinity, minHeight: 40)
            .background(isSelected ? Theme.Palette.burgundy : Color.clear)
            .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
        }
        .buttonStyle(.plain)
        .accessibilityLabel("\(day.formatted(date: .abbreviated, time: .omitted)), \(count) dates")
    }

    private func shift(months: Int) {
        selected = store.calendar.date(byAdding: .month, value: months, to: selected) ?? selected
    }
}

private struct MonthSlot: Identifiable {
    let id: Int
    let day: Date?
}

private struct WeekStrip: View {
    @EnvironmentObject private var store: PartnerStore
    @Binding var selected: Date

    var body: some View {
        HStack(spacing: 8) {
            ForEach(days, id: \.timeIntervalSince1970) { day in
                let isSelected = store.calendar.isDate(day, inSameDayAs: selected)
                Button {
                    selected = day
                } label: {
                    VStack(spacing: 4) {
                        Text(day.formatted(.dateTime.weekday(.narrow)))
                            .font(.system(size: 13, weight: .medium))
                        Text("\(store.calendar.component(.day, from: day))")
                            .font(.system(size: 17, weight: .bold))
                    }
                    .foregroundStyle(isSelected ? Theme.Palette.white : Theme.Palette.ink)
                    .frame(maxWidth: .infinity, minHeight: 56)
                    .background(isSelected ? Theme.Palette.burgundy : Theme.Palette.surface)
                    .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
                    .overlay {
                        RoundedRectangle(cornerRadius: 14, style: .continuous)
                            .stroke(isSelected ? Color.clear : Theme.Palette.line, lineWidth: 1)
                    }
                }
                .buttonStyle(.plain)
            }
        }
    }

    private var days: [Date] {
        guard let interval = store.calendar.dateInterval(of: .weekOfYear, for: selected) else { return [] }
        return (0..<7).compactMap { store.calendar.date(byAdding: .day, value: $0, to: interval.start) }
    }
}
