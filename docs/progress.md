# Progress

Working log for the partner app. This is not a spec and not a decision record of product direction. Product direction waits on the question at the bottom.

## 2026-10-15

Classification. Architectural. The partner app is a new product. This repo had a one-line `README.md` and nothing else.

Read. Shallow clone of [ichigokekiii/After-Class](https://github.com/ichigokekiii/After-Class) at `aa173e8559cfaa24a056b21aee4f796520fc849e` (2026-06-20). Four reads, then one synthesis. The write-up is `docs/explanation-student-product.md` and `docs/reference-repo-facts.md`.

Finding. The old repo specifies a student app and an internal admin for venues. The running frontends store `ConfirmedMatch` as a profile id and a 48-hour expiry. The café partner behavior in the kickoff talk is not in that commit.

Assumption, open to correction. This repo will become the café product described in that talk. It will not be a rename of the PRD's internal admin console. The student repo remains the constraint on what a date is today.

## Decisions

2026-10-15. The café person confirms a date on a phone at the counter, during the date. A desk dashboard is not the first surface.

2026-10-15. That phone app is native iOS, the same stack as the student app. The café phone for the first version is an iPhone. The running proposal is `docs/design-sections.md`. It is not the spec.

## 2026-10-15, wireframes

Two boards of the student main app were assessed. Copies and the write-up are in `docs/wireframes/`. They show Jennie's profile, a manual calendar, and a Café Uno España sheet. They do not show the café counter, and they are not a yes on the architecture section.

## 2026-10-15, direction

Four reference shots were assessed against the student wireframes. The proposed counter UI is a cream list, written in `docs/direction/explanation-direction.md`. Frontend only, mock data, SwiftUI in `PartnerApp/`. The HTTP API waits. No Xcode project yet.

2026-10-15. The brand sheet is saved at `docs/direction/design-sheet.png`. Partner primary is burgundy `#4A1525`. Pink `#F39394` stays on the student app. Background is cream `#FEF9E6`. Logos are a burgundy AC placeholder until the real files arrive.

## Not done

- Architecture section is waiting for a yes.
- No further design sections.
- No file under `docs/superpowers/specs/`.
- No app code, no dependency install, no commit.

## Next gate

A yes or a correction on `docs/direction/explanation-direction.md`. A yes starts the SwiftUI app in `PartnerApp/`. It does not approve a backend, tiers, or the student calendar. The architecture section's API line is paused by the frontend-only request.
