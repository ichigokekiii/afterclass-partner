# afterclass-partner

This repository contains the After Class partner app for café staff at the counter.

## Subfolders

- `PartnerApp/` owns the native iOS SwiftUI counter application and XCTest suites.
- `PartnerWeb/` owns the mobile-only Next.js web application that mirrors `PartnerApp/` one-to-one for phones and tablets while blocking desktop browsers.

## Running `PartnerWeb/` locally

```bash
cd PartnerWeb
npm install
npm run dev
```

Open `http://localhost:3000` using a mobile phone, tablet, or mobile device emulation in your browser. Desktop user-agents are routed to `/blocked`.

## Verification

```bash
cd PartnerWeb
npm test
npm run build
npx playwright test
```

## Deploying `PartnerWeb/` to Vercel

1. Import this repository in Vercel.
2. Set the **Root Directory** to `PartnerWeb`.
3. Keep the **Framework Preset** as `Next.js` and **Build Command** as `npm run build`.
4. Share the deployed `.vercel.app` URL with partner café staff to open on their counter phone or tablet.
