# Design sections

Running proposal for the partner app. This is not the spec. A section stays here after it is presented. It becomes decided only when it gets an explicit yes. The spec, later, will be copied from the sections that were approved.

## Architecture

Status. Presented 2026-10-15. Waiting for a yes.

The partner app is a SwiftUI app on iPhone. The deployment target is iOS 17 or later, the same floor `PRODUCT.md` sets for the student app in After Class commit `aa173e8`. Café staff open it at the counter during the date.

One café account signs in on that phone. The phone lists today's bookings for that café. Staff mark what happened to each one.

The record is a Booking. It is a different object from `ConfirmedMatch` in the student app. `ConfirmedMatch` stores a profile id and two timestamps. A Booking stores the café, the daytime window, two student display names, and a state.

The happy path is `scheduled`, then `completed`. A booking can also end as `noShow` or `canceled`. The mark stores the café account and the time. The booking does not store a student's email, phone, trusted contact, or live location. The café sees the two display names so staff can recognize the pair.

The student app at commit `aa173e8` cannot create a Booking. This repo owns the Booking and a small HTTP API that stores it. The iOS app is the only client in the first version. For a pilot, someone on the team loads that day's bookings through the API. When the student app can emit a meetup, it writes the same Booking. The counter screen stays as it is.

Freshman and Senior stay out of this version. Those labels would change which café the student app offers. They do not change how staff confirm a date that is already on today's list.

One shared login per café is enough for the first phone. Separate staff accounts wait until two people need their own mark on the same booking.
