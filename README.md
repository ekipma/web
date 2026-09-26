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
in `GOOGLE_OAUTH_CLIENT_IDS`. Google and Apple are independent providers.

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

## Apple sign-in for administrators

The Apple button remains disabled with “Coming soon” until both web variables are
set. No Apple requests are made until the button is clicked. Add these runtime
values to the **web deployment**, replacing the example Services ID:

```dotenv
APPLE_OAUTH_WEB_CLIENT_ID=ir.ekipma.admin
APPLE_OAUTH_REDIRECT_URI=https://ekipma.ir/api/admin/oauth/apple/callback
```

In the **Go server deployment**, include the same Services ID in the existing
comma-separated allowlist (preserve any other client IDs):

```dotenv
APPLE_OAUTH_CLIENT_IDS=ir.ekipma.admin
```

Restart both services after setting their variables. `ir.ekipma.admin` is only an
example: you must register your actual Services ID in Apple Developer, enable
Sign in with Apple, associate it with a primary App ID that has the capability,
and register `ekipma.ir` and the exact HTTPS return URL above. See
[Apple’s web configuration instructions](https://developer.apple.com/help/account/capabilities/configure-sign-in-with-apple-for-the-web).
Use the admin panel on that exact origin. Local testing needs a registered HTTPS
domain; an HTTP localhost URL will not work with this flow.

Clicking the button requests a five-minute backend nonce and redirects to Apple.
Apple POSTs the result to the callback. A Secure, HttpOnly, SameSite=None,
host-only cookie binds the state and nonce to the initiating browser; ingress
must preserve the POST body and cookies. The callback checks state, nonce and
Web audience, forwards the ID token to the Go server for cryptographic validation
and single-use nonce consumption, and checks administrator access before setting
session cookies. Return URLs are fixed by configuration; tokens never go into URLs.

This implements ID-token sign-in only: the returned authorization code is not
exchanged or stored, so no Apple client secret or private key is required. It does
not obtain Apple refresh tokens or implement Apple token revocation. Apple's
optional first-login name is used only as display text; email comes from the
verified token. Existing accounts are not linked by email, and first Apple login
creates an ordinary account that an existing admin must grant access to.

`npm test` covers the callback and failure paths with mocked upstream responses.
A real end-to-end Apple login still requires your Apple Developer configuration.
