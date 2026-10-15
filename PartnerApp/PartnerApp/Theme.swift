import SwiftUI

enum Theme {
    enum Palette {
        static let cream = Color(hex: 0xFEF9E6)
        static let white = Color(hex: 0xFFFFFF)
        static let surface = Color(hex: 0xF8F7F4)
        static let burgundy = Color(hex: 0x4A1525)
        static let pink = Color(hex: 0xF39394)
        static let ink = Color(hex: 0x2E2E2E)
        static let green = Color(hex: 0x5F8651)
        static let gray = Color(hex: 0x757575)
        static let line = Color(hex: 0xEAE6DF)
    }

    enum Spacing {
        static let xs: CGFloat = 8
        static let sm: CGFloat = 16
        static let md: CGFloat = 24
        static let lg: CGFloat = 32
        static let xl: CGFloat = 48
        static let gutter: CGFloat = 24
        static let control: CGFloat = 56
    }
}

extension Color {
    init(hex: UInt32) {
        self.init(
            red: Double((hex >> 16) & 0xFF) / 255,
            green: Double((hex >> 8) & 0xFF) / 255,
            blue: Double(hex & 0xFF) / 255
        )
    }
}

extension View {
    func partnerScreen() -> some View {
        self
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
            .background(Theme.Palette.white.ignoresSafeArea())
    }

    func partnerTitle() -> some View {
        self.font(.system(size: 32, weight: .bold))
            .foregroundStyle(Theme.Palette.ink)
    }

    func partnerHeader() -> some View {
        self.font(.system(size: 26, weight: .bold))
            .foregroundStyle(Theme.Palette.ink)
    }

    func partnerBody() -> some View {
        self.font(.system(size: 17, weight: .regular))
            .foregroundStyle(Theme.Palette.ink)
    }

    func partnerSubtext() -> some View {
        self.font(.system(size: 14, weight: .regular))
            .foregroundStyle(Theme.Palette.gray)
    }

    func partnerInputField() -> some View {
        self
            .font(.system(size: 17, weight: .regular))
            .padding(.horizontal, 16)
            .padding(.vertical, 14)
            .background(Theme.Palette.surface)
            .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
            .overlay {
                RoundedRectangle(cornerRadius: 14, style: .continuous)
                    .stroke(Theme.Palette.line, lineWidth: 1)
            }
    }
}

struct PartnerCard<Content: View>: View {
    @ViewBuilder var content: Content

    var body: some View {
        content
            .padding(Theme.Spacing.sm)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(Theme.Palette.white)
            .clipShape(RoundedRectangle(cornerRadius: 20, style: .continuous))
            .overlay {
                RoundedRectangle(cornerRadius: 20, style: .continuous)
                    .stroke(Theme.Palette.line, lineWidth: 1)
            }
            .shadow(color: Color.black.opacity(0.03), radius: 8, x: 0, y: 2)
    }
}

struct AfterClassLogo: View {
    var height: CGFloat = 88

    var body: some View {
        Image("Logo")
            .resizable()
            .scaledToFit()
            .frame(height: height)
            .padding(Theme.Spacing.sm)
            .background(Theme.Palette.white)
            .clipShape(RoundedRectangle(cornerRadius: 20, style: .continuous))
            .overlay {
                RoundedRectangle(cornerRadius: 20, style: .continuous)
                    .stroke(Theme.Palette.line, lineWidth: 1)
            }
            .shadow(color: Color.black.opacity(0.06), radius: 10, x: 0, y: 4)
            .accessibilityLabel("After Class")
    }
}

struct ACMark: View {
    var side: CGFloat = 56

    var body: some View {
        AfterClassLogo(height: side * 0.95)
            .frame(width: side, height: side)
    }
}

struct PrimaryButton: View {
    let title: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.system(size: 16, weight: .semibold))
                .multilineTextAlignment(.center)
                .lineLimit(2)
                .minimumScaleFactor(0.92)
                .foregroundStyle(Theme.Palette.white)
                .padding(.horizontal, Theme.Spacing.sm)
                .padding(.vertical, 14)
                .frame(maxWidth: .infinity)
                .frame(minHeight: Theme.Spacing.control)
                .background(Theme.Palette.burgundy)
                .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
                .shadow(color: Theme.Palette.burgundy.opacity(0.18), radius: 8, x: 0, y: 4)
        }
        .buttonStyle(.plain)
    }
}

struct SecondaryButton: View {
    let title: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.system(size: 16, weight: .semibold))
                .multilineTextAlignment(.center)
                .lineLimit(2)
                .minimumScaleFactor(0.92)
                .foregroundStyle(Theme.Palette.burgundy)
                .padding(.horizontal, Theme.Spacing.sm)
                .padding(.vertical, 14)
                .frame(maxWidth: .infinity)
                .frame(minHeight: Theme.Spacing.control)
                .background(Theme.Palette.white)
                .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
                .overlay {
                    RoundedRectangle(cornerRadius: 16, style: .continuous)
                        .stroke(Theme.Palette.burgundy.opacity(0.35), lineWidth: 1.5)
                }
        }
        .buttonStyle(.plain)
    }
}

struct BottomActionBar<Content: View>: View {
    @ViewBuilder var content: Content

    var body: some View {
        VStack(spacing: 12) {
            content
        }
        .padding(.horizontal, Theme.Spacing.gutter)
        .padding(.top, 12)
        .padding(.bottom, 8)
        .frame(maxWidth: .infinity)
        .background(
            Theme.Palette.white
                .overlay(alignment: .top) {
                    Rectangle()
                        .fill(Theme.Palette.line)
                        .frame(height: 1)
                }
                .ignoresSafeArea(edges: .bottom)
        )
    }
}

struct StatusChip: View {
    let title: String
    var urgent = false
    var resolved = false

    var body: some View {
        Text(title)
            .font(.system(size: 13, weight: .semibold))
            .foregroundStyle(foreground)
            .padding(.horizontal, 12)
            .padding(.vertical, 6)
            .background(fill)
            .clipShape(Capsule())
            .accessibilityLabel(title)
    }

    private var foreground: Color {
        if resolved { return Theme.Palette.green }
        if urgent { return Theme.Palette.burgundy }
        return Theme.Palette.ink
    }

    private var fill: Color {
        if resolved { return Theme.Palette.green.opacity(0.16) }
        if urgent { return Theme.Palette.burgundy.opacity(0.14) }
        return Theme.Palette.surface
    }
}

enum MockMedia {
    static func avatarAsset(for name: String) -> String {
        switch name.lowercased() {
        case "jennie": "avatar-jennie"
        case "marco": "avatar-marco"
        case "aria": "avatar-aria"
        case "luis": "avatar-luis"
        case "sofia": "avatar-sofia"
        case "isabel": "avatar-isabel"
        case "noah": "avatar-noah"
        default: "avatar-jennie"
        }
    }

    static func avatarURL(for name: String) -> URL? {
        let seed = name.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) ?? name
        switch name.lowercased() {
        case "jennie":
            return URL(string: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces&q=80")
        case "marco":
            return URL(string: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces&q=80")
        case "aria":
            return URL(string: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=faces&q=80")
        case "luis":
            return URL(string: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces&q=80")
        case "sofia":
            return URL(string: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop&crop=faces&q=80")
        case "isabel":
            return URL(string: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces&q=80")
        case "noah":
            return URL(string: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&h=200&fit=crop&crop=faces&q=80")
        default:
            return URL(string: "https://picsum.photos/seed/\(seed)/200/200")
        }
    }

    static func photoAsset(for label: String) -> String {
        let lower = label.lowercased()
        if lower.contains("exterior") { return "photo-exterior" }
        if lower.contains("seating") { return "photo-seating" }
        if lower.contains("together") { return "photo-together" }
        if lower.contains("cup") || lower.contains("order") { return "photo-cups" }
        if lower.contains("reference") { return "photo-reference" }
        if lower.contains("recreation") { return "photo-recreation" }
        return "photo-exterior"
    }

    static func photoURL(for label: String) -> URL? {
        let lower = label.lowercased()
        if lower.contains("exterior") {
            return URL(string: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=500&fit=crop&q=80")
        }
        if lower.contains("seating") {
            return URL(string: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=500&fit=crop&q=80")
        }
        if lower.contains("together") {
            return URL(string: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&h=500&fit=crop&q=80")
        }
        if lower.contains("cup") || lower.contains("order") {
            return URL(string: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=500&fit=crop&q=80")
        }
        if lower.contains("reference") {
            return URL(string: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&h=500&fit=crop&q=80")
        }
        if lower.contains("recreation") {
            return URL(string: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&h=500&fit=crop&q=80")
        }
        let seed = label.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) ?? "cafe"
        return URL(string: "https://picsum.photos/seed/\(seed)/400/300")
    }
}

struct StudentAvatar: View {
    let name: String
    var side: CGFloat = 48

    var body: some View {
        Image(MockMedia.avatarAsset(for: name))
            .resizable()
            .scaledToFill()
            .frame(width: side, height: side)
        .clipShape(Circle())
        .overlay {
            Circle()
                .stroke(Theme.Palette.white, lineWidth: 2)
        }
        .shadow(color: Color.black.opacity(0.08), radius: 4, x: 0, y: 2)
        .accessibilityLabel(name)
    }
}

struct MockPhotoTile: View {
    let label: String
    var height: CGFloat = 156

    var body: some View {
        ZStack(alignment: .bottomLeading) {
            Image(MockMedia.photoAsset(for: label))
                .resizable()
                .scaledToFill()
            .frame(maxWidth: .infinity)
            .frame(height: height)
            .clipped()

            LinearGradient(
                colors: [Color.black.opacity(0.0), Color.black.opacity(0.65)],
                startPoint: .center,
                endPoint: .bottom
            )
            .frame(height: height)

            Text(label)
                .font(.system(size: 14, weight: .semibold))
                .foregroundStyle(Theme.Palette.white)
                .padding(.horizontal, 12)
                .padding(.vertical, 10)
        }
        .frame(maxWidth: .infinity)
        .frame(height: height)
        .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
        .overlay {
            RoundedRectangle(cornerRadius: 16, style: .continuous)
                .stroke(Theme.Palette.line, lineWidth: 1)
        }
        .accessibilityElement(children: .contain)
    }
}

enum Peso {
    static func string(_ amount: Int) -> String {
        let formatted = amount.formatted(.number.grouping(.automatic))
        return "₱\(formatted)"
    }
}
