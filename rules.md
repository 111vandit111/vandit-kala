# Project rules

## Project-specific rules
1. Keep the Amazon Prime inspired look: dark navy backgrounds, Prime blue accents, existing components in `lib/`. Reuse `lib/Button.tsx`, `lib/tooltip.tsx` etc. before adding new ones.
2. The three profile views (Recruiter, Friends and Family, Random) stay; the "add another" (+) button opens the admin login popup, never a route change.
3. Admin access is for the owner only: one password from env (`ADMIN_PASSWORD`), signed httpOnly cookie session, checked server-side on every admin API route.
4. Content (projects, skills, experience, education, text) is read from MongoDB through API routes, seeded from the resume and GitHub. `constants.ts` keeps only UI config.
5. Intro loader plays once per browser session (sessionStorage) and respects `prefers-reduced-motion`.
6. Never commit `.env*`; add every new variable to `.env.example`.

## General
1. Follow the existing style of the file you are editing. Run `npm run lint`.
2. Functions do one thing, under ~50 lines; files under ~400 lines.
3. No dead code, commented-out code, debug prints, or ownerless `TODO`.
4. No magic numbers or strings; use named constants.
5. Names describe intent; booleans read as `is/has/should`.
6. Free open-source dependencies only (existing first, then MIT/Apache/BSD). No paid services without approval.
7. Match `.agent-team/style.md`.

## Correctness and errors
8. Validate all external input (request bodies, query params, env vars) at the API boundary.
9. Never swallow errors; return a consistent `{ error }` shape with correct status codes.
10. Handle empty, null and very large inputs (cap contact message length).

## Security
11. No secrets in code, logs or commits.
12. Mongoose/typed queries only; never build queries from raw user objects (strip `$` operators).
13. Never render raw user HTML; escape output.
14. Rate-limit login and contact endpoints.
15. Admin routes check the session server-side, not only in the UI.

## TypeScript / React
16. `strict` TypeScript; no `any` (use `unknown` + narrowing); no `!` unless proven.
17. `async`/`await` with error handling; no floating promises.
18. `const` by default.
19. Function components and hooks; stable `key`s; effects clean up after themselves. Server components by default, `"use client"` only where needed.

## UI and design consistency
D1. Reuse the existing layout shell, components and tokens; no new hard-coded colors where a token exists.
D2. Every page works from 320px to 1920px: no horizontal scroll, long text wraps.
D3. Modals (login, admin, coming soon) stay in the viewport, scroll when tall, close on Escape, trap focus.
D4. Tap targets at least 44×44px; visible focus; WCAG AA contrast.
D5. Every data view has loading, empty and error states.

## Backend: APIs and data
20. Layering: route handler (validate, auth) → `lib/server/` service → Mongoose model. Cache the Mongo connection across hot reloads.
21. List endpoints are paginated where unbounded (messages, analytics events).
22. Analytics store no personal data (no raw IPs); count by profile type and day.
23. API changes are backward compatible or the break is stated.

## Tests
24. New server logic (auth, validation, seed) has tests for the normal path and one edge case; deterministic, no real network.

## Git
25. Format `<type>: <summary>` with a bullet body.
26. Never commit build output, `.env` files, `.agent-team/`.
