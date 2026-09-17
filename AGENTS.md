<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Styling in `web`

- Tailwind utilities are the default for styling. Put layout, spacing, typography, colors, borders, responsive behavior, and interaction states in the component's `className`.
- When refactoring a component, migrate its routine named CSS rules to utilities and delete the replaced declarations. Adding a few utilities while leaving the component's styling in a named class does not complete a migration.
- Reserve custom CSS for artwork, complex animations, third-party markup, and locale-specific adjustments that are clearer in CSS. Keep a named class only when a remaining custom selector needs it; do not introduce named classes for ordinary layouts or hide utility lists behind `@apply`.
- Define recurring design values as theme tokens; use the same tokens from utilities and custom CSS instead of repeating literal values.
- Put repeated UI structure and its variants in React components rather than growing global CSS classes for each use. Reuse `SiteFrame` and `SiteLink` for public pages and `components/ui` for the admin UI.
- Give each CSS property on an element one owner. Do not set the same property through both a named class and a utility unless an intentional override is documented.
- Keep reset and element defaults in `@layer base` so utilities can override them. Scope custom selectors to their component; public-page styles must not override admin UI primitives.
- Use complete, statically detectable utility strings for variants and `cn()` when combining conditional or caller-supplied classes. Never construct Tailwind utilities with string interpolation such as `bg-${color}-500`.
- Preserve the existing inclusive responsive boundaries with `min-wide`, `max-tablet`, `max-admin-tablet`, `max-mobile`, and `max-small`. Check mobile, desktop, and Persian RTL behavior when migrating styles.
- Preserve appearance and behavior while migrating; use an arbitrary value when a standard utility would alter an existing measurement. Promote values shared across components into theme tokens.
- Run `npm run format -- <changed files>` to format JSX/CSS and sort utilities with the Tailwind Prettier plugin; verify with `npm run format:check -- <changed files>`, lint, and TypeScript.
