# Cozy Reading Journal — Frontend

React 19 + Vite + TypeScript + Tailwind. Talks to the backend API for all data
— there is no local/offline storage, so the backend must be running.

## Structure

```
frontend/src/
├── App.tsx                    Routes
├── components/
│   ├── AppLayout.tsx           Nav bar + page outlet + modal root
│   ├── NavBar.tsx               Landing nav + app nav bar
│   ├── BookCard.tsx              Book cover card (used everywhere)
│   ├── BookShelf.tsx             Grid + search/sort, used by all shelf pages
│   └── modals/                  BookForm, Choice, Pick, NewSeries + shell
├── pages/
│   ├── Landing.tsx
│   ├── ShelfPage.tsx             Generic page for library/tbr/wishlist/finished/favorites
│   ├── Series.tsx
│   ├── Reading.tsx
│   ├── Details.tsx
│   └── Review.tsx
├── context/LibraryContext.tsx    Provides the shared library store to every page
├── hooks/
│   ├── useBooks.ts                Fetches from the API + exposes CRUD actions
│   └── useLibraryStore.ts         Adds modal state on top of useBooks
├── services/                     Thin fetch wrappers per resource (api.ts, booksService.ts, seriesService.ts)
└── types/                         Book, ModalState, etc.
```

## Commands

```bash
npm run dev       # Vite dev server on http://localhost:5173
npm run build     # type-check + production build
npm run preview   # preview the production build locally
```

## Environment

```
VITE_API_URL=http://localhost:4000/api
```

Set this in `.env` (copy from `.env.example`) if your backend runs somewhere
other than the default.
