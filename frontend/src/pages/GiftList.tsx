import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { publicService, type PublicWishlistBook } from "../services/publicService.js";
import type { BookCategory } from "../types/book.js";
import BookCard from "../components/BookCard.js";

const CATEGORY_FILTERS: { value: BookCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "book", label: "📘 Books" },
  { value: "novel", label: "📗 Novels" },
  { value: "comic", label: "📓 Comic" },
];

// Public, unauthenticated page meant to be shared with friends/family so
// they know what to gift. Read-only — no login, no edit actions. Visually
// it mirrors BookShelf.tsx (the layout used by Library/TBR/Finished/etc.)
// so it doesn't feel like a different app, just without any authed-only
// chrome (no nav bar, no add button, cards aren't clickable).
export default function GiftList() {
  const [books, setBooks] = useState<PublicWishlistBook[] | null>(null);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"title" | "author">("title");
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<BookCategory | "all">("all");

  useEffect(() => {
    publicService
      .wishlist()
      .then(setBooks)
      .catch(() => setError(true));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (books ?? [])
      .filter((b) => categoryFilter === "all" || b.category === categoryFilter)
      .filter((b) => !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q))
      .sort((a, b) => (sortBy === "author" ? a.author : a.title).localeCompare(sortBy === "author" ? b.author : b.title));
  }, [books, search, sortBy, categoryFilter]);

  const hasBooks = filtered.length > 0;

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="w-full box-border px-4 sm:px-8 lg:px-12 pt-6 sm:pt-9 pb-16">
        <Link
          to="/"
          className="inline-block py-2.5 px-6 rounded-[20px] bg-sage text-parchment font-extrabold text-sm shadow-[0_4px_10px_rgba(125,157,110,0.35)] transition-transform hover:-translate-y-0.5"
        >
          ← Back to home
        </Link>

        <div className="flex items-center gap-2.5 sm:gap-3.5 mt-5 mb-1.5">
          <span className="text-2xl sm:text-3xl lg:text-[36px]">🎁</span>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-clay m-0">My Gift List</h1>
        </div>
        <p className="font-body text-sand text-base ml-[38px] sm:ml-[50px] mb-5 max-w-xl">
          Books I'd love to add to my shelf — if you're ever looking for something to give me, any of these would make me very happy.
        </p>

        {!error && books !== null && books.length > 0 && (
          <>
            <div className="flex items-center gap-3.5 mb-5 flex-wrap">
              <div className="relative flex-1 min-w-[160px] max-w-[360px]">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[17px] opacity-60">🔍</span>
                <input
                  type="text"
                  placeholder="Search by title or author..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full box-border py-2.5 pl-[42px] pr-4 rounded-[22px] border-[1.5px] border-bark/25 bg-parchment font-body text-base text-clay outline-none"
                />
              </div>

              <div className="relative">
                <button
                  onClick={() => setSortMenuOpen((v) => !v)}
                  className="flex items-center gap-1.5 py-2.5 px-[18px] rounded-[22px] border-[1.5px] border-bark/25 bg-parchment font-body font-bold text-[15.5px] text-bark cursor-pointer"
                >
                  ⇅ Sort: {sortBy === "author" ? "Author" : "Title"}
                </button>
                {sortMenuOpen && (
                  <div className="absolute top-[calc(100%+6px)] left-0 bg-parchment border-[1.5px] border-bark/20 rounded-2xl shadow-[0_8px_20px_rgba(74,53,39,0.18)] overflow-hidden z-20 min-w-[180px]">
                    <div
                      onClick={() => { setSortBy("title"); setSortMenuOpen(false); }}
                      className="py-2.5 px-[18px] font-body text-[15.5px] text-clay cursor-pointer hover:bg-sage/10"
                    >
                      Title (A–Z)
                    </div>
                    <div
                      onClick={() => { setSortBy("author"); setSortMenuOpen(false); }}
                      className="py-2.5 px-[18px] font-body text-[15.5px] text-clay cursor-pointer border-t border-bark/10 hover:bg-sage/10"
                    >
                      Author (A–Z)
                    </div>
                  </div>
                )}
              </div>

              <div className="font-body text-sand text-base ml-auto">
                {books.length} book{books.length === 1 ? "" : "s"}
              </div>
            </div>

            <div className="flex items-center gap-2 mb-6 flex-wrap">
              {CATEGORY_FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setCategoryFilter(f.value)}
                  className="py-2.5 px-[22px] rounded-full border-[1.5px] font-body font-extrabold text-base cursor-pointer transition-colors"
                  style={{
                    borderColor: categoryFilter === f.value ? "#7d9d6e" : "rgba(139,105,74,0.25)",
                    background: categoryFilter === f.value ? "#7d9d6e" : "transparent",
                    color: categoryFilter === f.value ? "#fbf5e9" : "#5c4632",
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </>
        )}

        {error && (
          <p className="font-body text-sand py-10 text-center">Couldn't load the gift list right now — try again in a bit.</p>
        )}

        {!error && books === null && <p className="font-body text-sand py-10 text-center">Loading…</p>}

        {!error && books !== null && !hasBooks && (
          <div className="text-center py-[70px] text-driftwood font-body">
            <div className="text-5xl mb-3">{search || categoryFilter !== "all" ? "🔍" : "🌿"}</div>
            <div className="text-lg">
              {search
                ? "No books match your search."
                : categoryFilter !== "all"
                ? `No ${categoryFilter}s here yet.`
                : "Nothing on the wishlist yet — check back later!"}
            </div>
          </div>
        )}

        {!error && hasBooks && (
          <div
            className="flex flex-wrap justify-center gap-x-3.5 sm:gap-x-[22px] gap-y-5 sm:gap-y-7 py-4 sm:py-[26px] px-2.5 sm:px-5 rounded-[20px]"
            style={{
              background:
                "repeating-linear-gradient(180deg, rgba(139,105,74,0.06) 0px, rgba(139,105,74,0.06) 210px, rgba(139,105,74,0.14) 210px, rgba(139,105,74,0.14) 218px)",
            }}
          >
            {filtered.map((book) => (
              <BookCard key={book.id} book={book} metaMode="series" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
