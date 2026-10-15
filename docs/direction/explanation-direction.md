# How the partner app should look and what we build first

Explanation. The picture inventory is `reference-shots.md`. The student boards are `docs/wireframes/`.

## Who this is for

Café staff, standing at the counter, on an iPhone, during the date. Success is a short list of today's dates and a mark that the date happened or that it was a no-show. The next engineer inherits one SwiftUI app in `PartnerApp/`, with mock data and no packages.

This message set the build to frontend only. The HTTP API in `docs/design-sections.md` waits. The first app keeps bookings in memory.

## What the references are aiming at

The four shots are one family of screen, painted four ways.

Medico and Homedoctor are the family to borrow from. A card on top tells you the current pack. Rows underneath are the things you deal with. An empty circle on the row is the unfinished mark. Homedoctor's second phone adds times as chips. That is the anatomy of a counter list. The drugs, the prices, the cart, and the magenta field are the other product.

The coffee shots are the wrong verb in the right room. They browse a menu, pick a size, and place an order. Staff at this café are not selling the student a drink inside our app. The splash cup and the green field belong to that ordering brand. We do not take the green, the search field, the size slider, or "Place order".

The crypto shots are a lesson in hierarchy and a warning about palette. One number is allowed to be large. One button is allowed to be black and final. The lilac field, the chart, and the keypad are a wallet. A search of café-staff patterns also offered a marketing funnel, brown `#92400E` on cream `#FEF3C7`, and Inter with Playfair Display. That result matched a café website, not this counter. It is not the system we use.

## What survives the cross-check with the wireframes

The student boards and these references meet in one place. The last wireframe names Café Uno España, a Friday, and 1:00 PM to 3:00 PM, with photos of the café. That sheet is student-facing. "Meet your match here" is the wrong sentence for the person who already works there.

Turn that sheet around. The café already knows its own name. The row should name the two students and the window. The photos of the storefront can wait. Staff do not need a map of their own block.

Leave the rest of the student boards on the student app. The month grid, the two bare clock times, the prompt cards, and the unlabeled tab bar are not the partner loop. The wireframe assessment already says the student should not be scheduling by hand. The partner app must not grow that calendar.

## The direction

One light-mode SwiftUI app. The brand sheet in `reference-brand.md` is the palette. Background cream `#FEF9E6`. Cards white `#FFFFFF`. Text `#2E2E2E`. Burgundy `#4A1525` is the primary, on the happened mark and on the primary button. Pink `#F39394` stays on the student app, so the two phones read as different products. Mauve, gray, and green are on the sheet and unused here. No gradient hero, no magenta, no pharmacy green, no lilac.

The sheet names SN Pro and Open Sauce Two. Those files are not here yet, so type is San Francisco at the sheet's sizes. The time uses the 28 px header. Names use the body size. The logo is a burgundy rounded square with the letters AC until the real marks arrive. Everything else is quiet.

Layout is left aligned. Variance stays low on purpose. The taste baseline of 8 would push the screen toward asymmetry, and a counter list cannot make staff hunt. Motion stays on the mark itself. The circle fills, and the row moves from open to marked. Nothing floats, and nothing plays on its own. Density stays open. A day of dates is a short list, with targets at least 44 points.

```
Today
Cafe Uno Espana

2 still open
Next, 1:00 PM

Jennie and Marco
1:00 PM to 3:00 PM          o

Aria and Luis
5:00 PM to 6:00 PM          o

Marked
...
```

Tap a row. The sheet names the pair, the day, and the window. Two actions. "Date happened" and "No-show". A marked row can be undone, because a mis-tap at the counter is the main error.

The app opens already signed in as Café Uno España. A login form does not help the first loop.

## Features in the first build

In.

- A today list of mock bookings for one café.
- A count of dates still open, and the next window, in the top card.
- A sheet with the two display names, the day, and the window.
- Mark the date happened.
- Mark a no-show.
- Undo that mark.
- An empty state when every date is marked, and an empty state when the mock day has no bookings. The copy says what is true. It does not ask staff to invent a date.

Out.

- Student swipe, prompts, match, and chat.
- A month calendar and a time picker.
- A map, a menu, prices, sizes, and an order button.
- Freshman and Senior tiers.
- A network call, an account system, and a second café.
- Per-barista logins.

Mock bookings live in the app. One of them uses the wireframe's pair of facts. Café Uno España, Friday, September 11, 1:00 PM to 3:00 PM, Jennie and one other name. The other rows are the same shape, so the list is a day and not a single card. States in the mock include open, happened, and no-show, so the marked section is visible on launch.

## How it gets built

The Xcode project sits in `PartnerApp/` at the root of this repo. SwiftUI, iOS 17 or later, light mode, no Swift packages. One scheme that runs in the simulator.

Order.

1. The `Booking` type and a mock list. A booking has an id, two display names, a start, an end, and a state of `scheduled`, `completed`, or `noShow`. The mark stores the time. The café is a constant on the mock, not a field the row repeats.
2. The today screen, top card plus rows.
3. The sheet and the two marks, including undo.
4. The two empty states.
5. Run it in the simulator and walk the marks.

The command that would own the visual build, once this direction has a yes, is impeccable `craft`, with the iOS reference. This note does not start that build.

## What a yes means

A yes on this note means the first Swift project is the today list and the two marks, in `PartnerApp/`, with mock data, burgundy `#4A1525` on cream `#FEF9E6`, and an AC logo placeholder. It does not approve tiers, a backend, or the student calendar.
