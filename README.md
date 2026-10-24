# Vandit Kala Portfolio

A Next.js (App Router) portfolio with three audience views (recruiter, family and friends, random visitors), content stored in MongoDB and an owner-only admin dashboard.

## Setup

Requirements: Node.js 20+ and a MongoDB instance (local or hosted).

```bash
brew services start mongodb-community   # or any running mongod
cp .env.example .env.local              # then edit the values below
npm install
npm run seed                            # fills MongoDB with the portfolio content
npm run dev                             # http://localhost:3000
```

## Environment variables

Set these in `.env.local` (git-ignored). They are validated the first time they are used.

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | yes | Connection string including the database name, e.g. `mongodb://127.0.0.1:27017/vandit-portfolio`. |
| `ADMIN_PASSWORD` | yes | Owner password for the admin login. |
| `ADMIN_SESSION_SECRET` | yes | Secret that signs the admin session cookie, at least 32 characters (for example `openssl rand -hex 32`). |

## Seeding

`npm run seed` upserts the projects, skills, experience, education and site texts from `lib/server/seed/seedData.ts`. It does no network calls and is safe to run repeatedly: existing documents are never overwritten, so edits made in the admin dashboard survive a re-run. It prints how many documents it created, and exits non-zero on failure.

To change the starting content, edit `seedData.ts` and run the seed again for new items. To change an existing item, edit it in the admin dashboard.

## Admin login

Open the site, use the admin login and enter `ADMIN_PASSWORD`. The session lasts 8 hours and is stored in an httpOnly cookie. From the dashboard (`/admin`) you can view visit analytics, read contact messages and edit projects, skills, experience, education and site texts. Login attempts are rate limited.

## Tests

```bash
npm test
```

Runs the vitest suites in `lib/server/__tests__` (schemas, auth, rate limiting, HTTP helpers and seed data). They need no network or database.

## Other scripts

- `npm run build` and `npm start` for a production build.
- `npm run lint` to run ESLint.
