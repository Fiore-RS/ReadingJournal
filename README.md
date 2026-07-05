# 📖 Cozy Reading Journal

A full-stack rebuild of the Cozy Reading Journal — a warm little app to track
what you're reading, what's waiting on your shelf, and what you thought of it
once you're done.

**Stack**

- **Backend:** Express 5 + TypeScript + Drizzle ORM + Neon (serverless Postgres) + Zod
- **Frontend:** React 19 + Vite + TypeScript + Tailwind CSS + React Router 7
- No authentication — this is a single shared library, backed directly by your Neon database.

```
cozy-reading-journal/
├── backend/     Express API (books + series)
└── frontend/    React app (Vite + Tailwind)
```

## 1. Set up Neon

1. Create a project at [neon.tech](https://neon.tech) if you haven't already.
2. Grab the connection string from your project dashboard (**Connect** → copy the
   `postgresql://...` URL). Make sure it includes `?sslmode=require`.

## 2. Backend setup

```bash
cd backend
cp .env.example .env
# paste your Neon connection string into DATABASE_URL in .env

npm install
npm run db:push     # creates the books & series tables in Neon
npm run db:seed      # optional — adds the original 17 sample books
npm run dev           # starts the API on http://localhost:4000
```

## 3. Frontend setup

```bash
cd frontend
cp .env.example .env   # defaults to http://localhost:4000/api, adjust if needed

npm install
npm run dev             # starts Vite on http://localhost:5173
```

Open `http://localhost:5173` — the landing page links straight into the library.

## API overview

| Method | Path                     | Description                          |
|--------|--------------------------|---------------------------------------|
| GET    | /api/books               | List all books                        |
| POST   | /api/books               | Create a book                         |
| GET    | /api/books/:id           | Get one book                          |
| PUT    | /api/books/:id           | Update a book                         |
| DELETE | /api/books/:id           | Delete a book                         |
| PATCH  | /api/books/:id/status    | Change status (tbr/reading/wishlist/finished) |
| PATCH  | /api/books/:id/favorite  | Toggle favorite                       |
| PATCH  | /api/books/:id/progress  | Update reading progress               |
| PUT    | /api/books/:id/review    | Save a review                         |
| GET    | /api/series              | List series names                     |
| POST   | /api/series              | Create a new (empty) series section   |

See `backend/README.md` and `frontend/README.md` for more detail on each side.
