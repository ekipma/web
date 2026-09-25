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

### Publishing Android releases

Sign in as an admin and open **App releases** (`/admin/releases`). Enter the build
version, choose a signed `.apk` (up to 200 MiB), then select **Upload and publish**.
The screen shows upload progress and the current release's version, size, date,
and download link. If publication times out, refresh the current release before
retrying; it may already have succeeded.

The website's Android link points to
`https://cdn.ekipma.ir/downloads/android/ekipma.apk`. Deploy the server release API,
MinIO bucket initialization, and Nginx routes alongside this web update (see the
server README). Uploads go directly to MinIO using temporary signed forms; storage
credentials are never exposed to the browser. The existing `EKIPMA_API_URL` setting
is used for authenticated release API calls.

## Google sign-in for administrators

The admin login screen supports Google alongside mobile/password login. Configure
these values in the **web deployment** environment (restart the web server afterward):

```dotenv
EKIPMA_API_URL=https://your-api.example
GOOGLE_OAUTH_WEB_CLIENT_ID=14358628459-m1uqt523ki083kc7ugnscfnrgva0qv7q.apps.googleusercontent.com
```

`GOOGLE_OAUTH_WEB_CLIENT_ID` is a public Web application client ID, read at runtime
and passed to the login component. Leave it unset to hide Google sign-in. Do not
add a Google client secret: this flow verifies ID tokens and does not exchange
OAuth authorization codes.

In Google Cloud, add each web origin to that client's **Authorized JavaScript
origins**, for example `https://ekipma.ir` and `http://localhost:3000`. Add the `www`
origin separately if the admin panel is served there. This uses the Google popup
callback and requires no authorized redirect URI. The login page sets
`Cross-Origin-Opener-Policy: same-origin-allow-popups`; preserve this at the ingress.
Google Identity Services renders its official button as an exception to the admin
shadcn primitives, preserving provider branding and accessible interaction.

The **Go server** must have its OAuth migration applied and this same Web client ID
in `GOOGLE_OAUTH_CLIENT_IDS`. Google/Apple are independent providers; this admin UI
currently enables Google only. Apple web integration is not configured here.

The browser requests a challenge through `/api/admin/oauth/google/challenge`.
The web server binds it to a five-minute HttpOnly, SameSite=Strict cookie. The
Google SDK includes the nonce in the signed ID token, which is posted to
`/api/admin/oauth/google`. That route checks the request origin, cookie/nonce and
Web audience, then delegates cryptographic verification and nonce consumption to
the Go server. It verifies `/api/v1/admin/me` before issuing the existing HttpOnly
admin session cookies. Ekipma access/refresh tokens never reach browser JavaScript.

**Existing phone accounts are not linked by email.** First Google sign-in creates
an ordinary account and the panel denies access. An existing administrator can
find the new account in **Users** and grant it the Admin role. Then retry Google
sign-in. Keep an existing phone/password administrator available for this step.

Run `npm test` for the OAuth route security checks, then `npm run lint`,
`npx tsc --noEmit`, and `npm run build`. Tests mock the upstream API and use fake
tokens; real Google sign-in still requires the registered origin and provider setup.
