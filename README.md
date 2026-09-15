# Ekipma landing

An English landing page for Ekipma: shared expenses, rotating responsibilities, and plans for friends and roommates.

## Run locally

```sh
npm install
npm run dev
```

Open `http://localhost:3000`.

## Checks

```sh
npm run lint
npm run build
```

If your environment restricts the local worker ports required by Turbopack, the equivalent production build can use `npm run build -- --webpack`.

## Where to edit

- `app/page.tsx`: landing sections, pricing tiers, and FAQs.
- `app/site-config.ts`: store links, contact email, monthly price, and APK URL.
- `app/_components/feature-demo.tsx`: accessible feature tabs and illustrative product examples.
- `app/_components/header.tsx`: desktop/mobile navigation.
- `app/globals.css`: responsive layout, colors, hover/focus states, reduced-motion support.
- `app/layout.tsx`: local font, metadata, canonical URL, and social preview.
- `assets/images/phones.png`: original app screenshot composition.
- `public/images/app-logo.svg`: supplied brand mark served by the landing.

**Before publishing, complete [LAUNCH-TODO.md](./LAUNCH-TODO.md).** Store URLs, contact email, and monthly price intentionally remain empty placeholders. The page shows availability labels until they are filled. Illustrative demo actions are local to the page; there is no app/backend mutation, signup, checkout, or tracking integration.

No new runtime dependencies were added for this landing.
