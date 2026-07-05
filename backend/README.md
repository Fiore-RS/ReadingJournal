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
    │   ├── schema/           Drizzle table definitions (books, series)
    │   └── seeders/seed.ts   Inserts the 17 original sample books
    ├── controllers/          Route handlers (business logic)
    ├── routes/                Express routers
    ├── middleware/            asyncHandler, ApiError, error handler
    └── utils/                 Zod request-validation schemas
```

## Commands

```bash
npm run dev          # tsx watch — restarts on file changes
npm run db:push      # push the Drizzle schema to Neon (no migration files)
npm run db:generate  # generate SQL migration files instead, if you prefer that workflow
npm run db:studio    # open Drizzle Studio to browse your data
npm run db:seed      # insert the sample books (skips if books already exist)
npm run build        # compile to dist/
npm start            # run the compiled build
```

## Notes

- Every route is wrapped in `asyncHandler` so thrown errors reach the central
  `errorHandler` middleware instead of crashing the process.
- `ApiError` lets controllers throw `throw new ApiError(404, "Book not found")`
  and get a clean JSON error response.
- Validation is entirely Zod-based (see `src/utils/book_validators.ts`) — the
  same pattern used in Heleani's backend.
- The `series` table only exists to keep empty series sections around before
  any book is assigned to them; series membership itself lives on `books.series`.
