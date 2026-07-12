# Cozy Reading Journal — Backend

Express + TypeScript API backed by Neon Postgres via Drizzle ORM.

## Structure

```
backend/
├── env.ts                    Zod-validated environment variables
├── server.ts                 Entry point
├── drizzle.config.ts         drizzle-kit config (points at Neon)
└── src/
    ├── app.ts                Express app: middleware + route mounting
    ├── db/
    │   ├── connection.ts     pg Pool + drizzle instance
    │   ├── schema/           Drizzle table definitions (users, books, series)
    │   └── seeders/seed.ts   Creates accounts + seeds the demo library (see below)
    ├── controllers/          Route handlers (business logic)
    ├── routes/                Express routers
    ├── middleware/            asyncHandler, ApiError, error handler, requireAuth
    └── utils/                 Zod request-validation schemas, auth (hash/JWT) helpers
```

## Commands

```bash
npm run dev          # tsx watch — restarts on file changes
npm run db:push      # push the Drizzle schema to Neon (no migration files)
npm run db:generate  # generate SQL migration files instead, if you prefer that workflow
npm run db:studio    # open Drizzle Studio to browse your data
npm run db:seed      # one-time setup: creates your account + the demo account (see below)
npm run build        # compile to dist/
npm start            # run the compiled build
```

## Accounts & data isolation

Every book and series row belongs to exactly one user (`userId`). All
`/api/books`, `/api/series`, and `/api/uploads` routes require a valid login
(`Authorization: Bearer <token>`, obtained from `POST /api/auth/login`) and
every query is scoped to `req.userId` — one account can never see or modify
another account's data.

There are two kinds of accounts:
- **Owner** (you) — your real library.
- **Demo** — a public account anyone can log into from the login page to try
  the app. It ships with a small sample library so it doesn't look empty.

### ⚠️ One-time setup — run this before anything else

This only needs to happen once, whether you're setting up a brand-new
database or migrating your existing one (with your real books already in it).

1. **Add these to your `.env`** (already added for you locally, but you'll
   need them wherever else you deploy this — e.g. Render/Railway):
   - `JWT_SECRET` — a random secret used to sign login tokens. Generate one
     with `openssl rand -hex 32`. **Never reuse the example value, and never
     commit this file** (it's now in `.gitignore`).
   - `JWT_EXPIRES_IN` — how long a login stays valid (default `30d`).
   - `OWNER_USERNAME`, `OWNER_PASSWORD`, `OWNER_DISPLAY_NAME` — your personal
     login. Pick a real password here.
   - `DEMO_USERNAME`, `DEMO_PASSWORD`, `DEMO_DISPLAY_NAME` — the account
     you'll hand out publicly. Defaults to `demo` / `demo1234` — change the
     password if you want, just remember to update the hint text in
     `frontend/src/pages/Login.tsx` to match.

2. **Install the new dependencies**: `npm install` (adds `bcryptjs` and
   `jsonwebtoken`).

3. **Run the setup script**: `npm run db:seed`

   This single script is safe to run once against your real database. It
   will, in order:
   - Create the `users` table and add a `user_id` column to `books` and
     `series` (raw SQL — not `drizzle-kit push`, because push can't safely
     sequence "add a required foreign key to a table that already has rows").
   - Create your owner account and the demo account from the env vars above.
   - **Assign every existing book/series row (the ones you already have) to
     your owner account.** Nothing is deleted or altered — just tagged as
     yours.
   - Make `user_id` required now that every row has one, and switch the
     `series.name` unique constraint from global to per-account (so the demo
     account and your account can both have, say, a "Hearthglow Trilogy"
     without conflicting).
   - Give the demo account the original 17 sample books (only if it doesn't
     already have books of its own — safe to run again later).

4. After that, `npm run db:push` should report no pending changes, since the
   seed script already brought the database in sync with the schema files.

You do **not** need to run `db:push` before `db:seed` — the seed script
handles its own schema changes. Run `db:push` afterward only if you edit the
schema files again down the line.

## Notes

- Every route is wrapped in `asyncHandler` so thrown errors reach the central
  `errorHandler` middleware instead of crashing the process.
- `ApiError` lets controllers throw `throw new ApiError(404, "Book not found")`
  and get a clean JSON error response.
- Validation is entirely Zod-based (see `src/utils/book_validators.ts`) — the
  same pattern used in Heleani's backend.
- The `series` table only exists to keep empty series sections around before
  any book is assigned to them; series membership itself lives on `books.series`.
- Passwords are hashed with bcrypt before storage — nothing plaintext ever
  touches the database.

