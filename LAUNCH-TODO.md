# Landing page — launch TODO

The English landing is implemented in `app/page.tsx`. Product examples are illustrative; no demo action writes to the app or server.

## Replace the placeholders

Edit `app/site-config.ts` directly, or provide these environment variables before building:

| Setting                       | Replace with                                              | Current placeholder behavior                                             |
| ----------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------ |
| `NEXT_PUBLIC_GOOGLE_PLAY_URL` | Your exact Google Play listing URL                        | Shows a non-clickable “Coming soon to Google Play” badge                 |
| `NEXT_PUBLIC_APP_STORE_URL`   | Your exact Apple App Store listing URL                    | Shows a non-clickable “Coming soon to App Store” badge                   |
| `NEXT_PUBLIC_CONTACT_EMAIL`   | Your company/sales contact email                          | Company CTA leads to the contact section, which says inquiries open soon |
| `NEXT_PUBLIC_PREMIUM_PRICE`   | The final monthly price, including currency, e.g. `$4.99` | Shows “Monthly” and “Pricing to be announced”                            |

- [ ] Fill the two store URLs and check them on both desktop and phones.
- [ ] Fill the contact email. This enables the email CTA in the contact section.
- [ ] Set the monthly price. Confirm the actual currency and billing model first.
- [ ] Verify the inherited direct Android download: `https://cdn.ekipma.ir/files/ekipma.apk`. Update `site.androidApk`, or set it to an empty string to remove the link.

The empty strings are intentional placeholders: visitors cannot accidentally follow a made-up store listing or email address. Setting the values automatically enables the relevant links. Rebuild after updating environment variables.

## Finalize product copy

- [ ] Confirm the Free/Premium feature split in the `plans` array in `app/page.tsx`. Analytics is included under Premium per the current brief. The precise final entitlements need your product decision.
- [ ] Update the Premium details text when pricing and features are final. Replace “Explore Premium” with the correct purchase/upgrade destination if a web checkout becomes available.
- [ ] Confirm the Company offering and update its feature list to match the actual service. The current copy invites a discussion and does not promise unimplemented enterprise features.
- [ ] Review the three feature descriptions and FAQ against the app version being released.
- [ ] The expense demo uses illustrative US dollar amounts for the English page. Change the example currency if the launch market calls for it; this does not imply new currency support in the app.

## Brand and publishing

- [ ] Replace the supplied Persian screenshots with English screenshots when ready. Current originals are preserved and the image alt text identifies the Persian interface. The English examples below the hero are labeled demos.
- [ ] Confirm `https://ekipma.ir` as the canonical origin in `app/layout.tsx`.
- [ ] Optionally replace `public/thumbnail.jpeg` with a higher-resolution English social preview (recommended size: 1200 × 630), then update its dimensions in `app/layout.tsx`.
- [ ] Add approved privacy/terms pages and footer links before public launch. No made-up legal pages are included.
- [ ] Confirm the inherited GitHub organization link in the footer.
- [ ] Run `npm run lint` and `npm run build`, then check the store/email links with the final values.

## Local preview

```sh
npm run dev
```

The page uses the bundled local Vazirmatn font, supplied logo and screenshots, CSS hover/focus glows, keyboard-accessible feature tabs, a local chore demo, and native FAQ disclosures. Reduced-motion preferences are respected. No animation or analytics dependency was added.
