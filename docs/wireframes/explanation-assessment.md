# What these main-app wireframes are doing

Explanation of the two boards in this folder. Frame-by-frame facts are in `reference-frames.md`. The student-app commit those facts get compared to is After Class `aa173e8`, written up in `docs/explanation-student-product.md`.

## Overview

The boards are a low-fidelity pass at the student app's main screen. Jennie is the person you are looking at. The first board lets you read her photo and her prompts. The second board, still under her header, lets you pick a day and a clock time, then shows a map and a real café.

That is a different product from the one-line pitch on the old repo, and from Draft v2 of the PRD. The pitch says the app plans the daytime date and the student shows up. `FR-MEET-14` says the proposal screen must not ask the student to pick a time slot. These boards hand the student a month calendar and two clock times. They also never draw the action that would start a match.

For the café app, one frame matters. The last phone names Café Uno España, a Friday, and a two-hour window. That is the seed of a Booking. The board stops at the student looking at it. Nobody on the café side confirms it.

## The loop the student actually gets

The printed titles on the first board describe one path. Open the main screen, scroll the first tab, tap a prompt, tap again to close it.

The second board has no titles. The repeated header is the only reason to treat the calendar and the map as the next steps in Jennie's profile. If that reading is right, the student goes from prompts to a month, to a day, to a map, to a café sheet.

Two controls the student needs are absent.

The like is absent. The bottom bar is on the photo, the prompts, the calendar, and the map, so those three icons are navigation. They are not a yes and a no for this card. A student can read Jennie and cannot, on these boards, decide about her.

The plan is present, and it is manual. August 2026 is a full month. August 3 offers 1:00 PM and 5:00 PM as bare start times. The café sheet then ignores both the day and the 5:00 PM row. It says Friday, September 11, 1:00 PM to 3:00 PM. The frames disagree with each other about when the date is.

The weekday label is also wrong for the year printed on the phone. The grid says August 2026 and the caption says Wednesday, August 3. August 3, 2026 is a Monday. September 11, 2026 really is a Friday, so the café sheet is the frame that matches a calendar. It does not match the day the student just selected.

## What matches the product we already wrote down

Jennie is 18, which sits on the PRD's age floor. The card shows a school and a district, Ateneo and Diliman, rather than a street address. That is in the spirit of an approximate area. The prompts are the profile the student came to read. Five of them, opened one at a time, is a clear reading pattern.

The café sheet is the first picture in this project of a named venue with a window and photos. Café Uno España, near University of Santo Tomas, on a Friday afternoon. The callout on the map says "Meet your match here!". The student is being sent to a public café in the daytime. That part of the pitch survives.

## Where the boards work against the product

The student is the scheduler. A month grid plus clock rows is a booking widget. The PRD's meetup engine was supposed to assign one window of at least an hour, from both people's daytime availability, and keep the slot picker off the proposal. Line 364 of the same PRD does say to suggest three slots, so the spec is already split. These boards pick the manual side of that split and then go further. They offer a whole month, and two start times, and no sign that the other person is free then.

The map puts Jennie's portrait on the same screen as four place pins. The portrait is not one of those pins. It still reads as her location sitting on the map. The later frame corrects this by pinning the café and saying the match is there. The schematic frame does not. The PRD's rule is that the other person's precise point stays off the student's screen. A district label on the card is enough. A face on the map is the frame to redraw.

The rectangle in the bottom bar has no label. The shape is the one people read as an inbox. The PRD forbids a normal one-to-one chat. If that icon is matches, the shape is the wrong word. If it is chat, the board has reopened a door the spec shut.

Safety is missing from the path that ends at a café. No arrival, no shake, no check-in after the date. The old HTML wireframe had the same hole. These boards do too. The student can reach "Meet your match here!" with no safety step drawn between the calendar and the street.

The copy is still a wireframe. "Im Jennie because..." is missing the apostrophe. "Ateneo De Manila" capitalizes "De". "This Mirror Pic I have" is a caption, not a finished prompt answer. Fine for structure. Not fine to carry into the app.

The palette is not on these boards. `PRODUCT.md` fixes cream `#F7F6EE`, peach `#F9B3A6`, and ink `#383934`. Every phone here is white, gray, and black. That is appropriate for a structure pass. It is not a visual system yet.

## What this does to the café app

The last frame is a student looking at a café. It is not a café looking at a date. There is still no staff phone, no shared café login, and no `completed` or `noShow` mark.

If this sheet were a Booking, the fields on it would be the café name, the calendar day, and a start and end. The missing fields are the second student, the café account that will confirm it, and the state. Jennie is the only name. The person holding the phone is invisible, which is normal for a profile, and useless for a host who has to recognize a pair.

The window is also a different length from the prototype. The Swift and preview samples use one hour. This sheet uses two, 1:00 PM to 3:00 PM. The PRD's floor is one hour. Two hours fits that floor. It does not fit the two bare times on the calendar frame.

Treat these boards as a proposal for the student profile and a rough proposal for the venue sheet. Do not treat them as the flow the café app should copy. The counter app still needs today's list and one mark. These pictures never draw that list.

## What to keep

Keep the profile reading pattern. Photo, school, district, prompts, tap to open one answer. Keep a named daytime café with photos.

Redraw the path from the profile to the café. The student should not be handed a month and two clock times. The frames should agree on one day and one window. The map should pin the café. The like has to exist before any of that planning, because a date with someone you never chose is not a date. The inbox-shaped icon needs a label that is not chat, or it needs to leave.
