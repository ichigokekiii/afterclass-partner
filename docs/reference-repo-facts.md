# Repo facts for the June 20, 2026 After Class commit

Reference only. The narrative is `docs/explanation-student-product.md`.

## Source

| Field | Value |
| --- | --- |
| Repo | https://github.com/ichigokekiii/After-Class |
| Commit | `aa173e8559cfaa24a056b21aee4f796520fc849e` |
| Commit date | 2026-06-20 01:23:09 +0800 |
| Commit subject | Create .gitignore |
| Read on | 2026-10-15, shallow clone of `main` |
| Partner repo at that time | `README.md` only. One sentence. No app and no docs. |

This partner repo does not vendor that commit. Paths in the tables below are paths inside After-Class.

## What each tree is

| Path | What it is |
| --- | --- |
| `docs/after-class-prd.md` | Draft v2 PRD. Last updated May 23, 2026. Version 2.0. |
| `docs/after-class-prd.pdf` | Same document as a PDF. Text was not extracted. |
| `PRODUCT.md` | iOS product register. SwiftUI, Xcode 26, iOS 17+. |
| `DESIGN.md` | Light-mode tokens and spacing. Cream `#F7F6EE`, peach `#F9B3A6`, ink `#383934`. |
| `AfterClass/` | SwiftUI student app. |
| `preview/` | Vite React preview of the same student flow. |
| `prototype/wireframe/` | Grayscale HTML wireframe. |
| `ui/` | Palette images and `tokens.css`. |

## ConfirmedMatch

Swift, `AfterClass/AfterClass/App/AppState.swift`, re-read 2026-10-15.

| Field | Type | Rule |
| --- | --- | --- |
| `profileId` | `String` | Also the `id`. |
| `confirmedAt` | `Date` | `now` at insert. |
| `expiresAt` | `Date` | `now` plus `MeetupData.expiryHours` hours. That constant is 48. |

`confirmMatch` returns immediately when `profileId` is already present. Otherwise it inserts at index 0. The comment on the struct says the 48-hour window matches the prototype's MVP policy.

Preview, `preview/src/constants/confirmedMatches.ts`.

| Field | Type |
| --- | --- |
| `profileId` | `string` |
| `confirmedAt` | ISO `string` |
| `expiresAt` | ISO `string` |

The preview store is a module variable. It dies on reload.

Neither struct stores a venue, a time window, a second student, a café id, or a completion flag.

## Sample proposals

From `preview/src/constants/meetup.ts`, re-read 2026-10-15. Every row has `radiusKm` 10.

| id | areaLabel | venueName | Window |
| --- | --- | --- | --- |
| sofia | Bonifacio Global City | The Coffee Academics | Sat, 2:30 PM to 3:30 PM |
| marco | Manila Bay area | Starbucks Reserve — MOA | Wed, 11:30 AM to 12:30 PM |
| isabel | Maginhawa food strip | Bo's Coffee — UP Town | Thu, 12:00 PM to 1:00 PM |

The venue strings in the table are the source strings, including the dash characters in the file.

## PRD lines re-read on 2026-10-15

| Id or line | Text, shortened |
| --- | --- |
| Status | Draft v2 for implementation planning. Version 2.0. Last updated May 23, 2026. |
| Line 57 | Faculty, staff, contractors, or campus partners are outside the student audience. |
| Line 143 | No standard in-app chat in the MVP. |
| `FR-PRO-4` | Radius options 2, 5, 10, 15, 20, and 30 km. Default 10. |
| `FR-MAT-1` | Mutual likes create a match immediately. |
| `FR-MAT-5` | No accept within 30 seconds expires the pending match and creates no active match. |
| `FR-MAT-7` | 48 hours from match creation to a mutually accepted meetup plan. Then the match leaves active lists. |
| `FR-MAT-8` | Confirm Match returns the user to discovery, not a matches hub. |
| `FR-MEET-14` | The proposal screen must not offer a time-slot picker. Time confirmation is a later step. |
| Line 364 | Suggest three slots inside 8:00 AM to 6:00 PM. |
| `FR-POST-2` | Completion prompt after the scheduled time passes, the user marks complete, or the system detects likely date-end behavior. |
| `FR-POST-7` | No normal open-ended one-to-one chat before or after match resolution. |
| `FR-SAFE-6` | Shake-triggered in-app emergency flow during the meetup window. |
| `FR-ADM-4` | Admins create, edit, deactivate, and safety-tag venues, including external place data. |

Other requirement ids in the explanation come from the same PRD via the synthesis pass. They were not re-read line by line on this date.

## Talk claims against this commit

The talk is the description pasted at the start of the partner-app effort. It is not a file in either repo.

| Talk claim | In commit `aa173e8` |
| --- | --- |
| iOS Swift student app | `PRODUCT.md` states iOS, SwiftUI, iOS 17+. |
| Android later | No Android product statement. |
| No chat. A match books a public daytime café and a time. | `FR-POST-7` forbids that chat. The PRD assigns a venue and a window. The apps show a hardcoded coffee shop. No booking type. |
| School ID, `.edu` email, proof of enrollment, face check, emergency contact | `.edu` entry, a face-check screen that sets a flag, a school-ID field that estimates year level, and a trusted-contact form. No proof-of-enrollment flow. |
| Geofenced check-in around the café. Location hidden from the match. | The word geofence does not appear. The PRD uses proximity as supporting evidence and says the other user does not see tracking. No radius is specified in the lines re-read here. |
| In-app alert button | No alert button. `FR-SAFE-6` requires a shake gesture. The apps do not build that gesture. |
| After-date check-in with the emergency contact | Trusted-contact fields exist. Meetup-complete screens are placeholder copy. |
| afterclassapp.com, `/pilot`, `/recruit` | No site and no those routes. The PRD says "pilot geography". |
| Supabase for pilot signups and hiring | No Supabase client or schema. |
| Café dashboard not built yet | The commit never names a café dashboard. |
| Freshman and Senior tiers. Senior is featured first near the café. | Freshman through Graduate are school-ID year labels. Nothing features Senior near a café. |
| The partner app confirms a date happened at the café. | No partner app. `FR-POST-2` names the clock, the student, or the system. |

## File conflicts

| Topic | PRD | Wireframe | Swift | Preview |
| --- | --- | --- | --- | --- |
| Chat | Forbidden, `FR-POST-7` | Unlocks a demo thread | No chat | No chat |
| Time picking | `FR-MEET-14` forbids a picker. Line 364 says three slots. | Three chips and "Pick a time" | One hardcoded window | One hardcoded window |
| After Confirm Match | Discovery, `FR-MAT-8` | "You're set" | Matches tab | `/home` |
| Expired match | Leaves the active list, `FR-MAT-7` | 48-hour banner | Row stays at `00:00:00` | Row is removed |
| Who confirms the date | Student, clock, or system, `FR-POST-2` | Student rates the date | Complete screen is unwired | Complete screen does not write |

## Lines re-read on 2026-10-15

- `PRODUCT.md` through the palette section
- `docs/after-class-prd.md` header, and the requirement lines in the table above
- `AfterClass/AfterClass/App/AppState.swift` through `loadCompletedDraftForDebug`
- `preview/src/constants/confirmedMatches.ts` through `getConfirmedMatches`
- `preview/src/constants/meetup.ts` venue names
- `MatchesTabView.swift` iteration of `app.confirmedMatches`
- `preview/src/hooks/useConfirmedMatches.ts` calls to `removeExpiredMatches`
