import { useState } from "react";
import type { Book } from "../types/book.js";
import BookCard from "./BookCard.js";

interface BookShelfProps {
  books: Book[];
  pageTitle: string;
  pageIcon: string;
  addLabel?: string;
  onAddClick?: () => void;
  onOpenBook: (book: Book) => void;
  emptyText: string;
}

export default function BookShelf({ books, pageTitle, pageIcon, addLabel, onAddClick, onOpenBook, emptyText }: BookShelfProps) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"title" | "author">("title");
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  const q = search.trim().toLowerCase();
  const filtered = books
    .filter((b) => !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q))
    .sort((a, b) => (sortBy === "author" ? a.author : a.title).localeCompare(sortBy === "author" ? b.author : b.title));

  const hasBooks = filtered.length > 0;

  return (
    <div className="w-full min-h-full box-border px-12 pt-9 pb-16">
      <div className="flex items-center gap-3.5 mb-1.5">
        <span className="text-[36px]">{pageIcon}</span>
        <h1 className="font-display text-5xl font-semibold text-clay m-0">{pageTitle}</h1>
      </div>
      <div className="font-body text-sand text-base ml-[50px] mb-5">
        {books.length} book{books.length === 1 ? "" : "s"}
      </div>

      <div className="flex items-center gap-3.5 mb-7 flex-wrap">
        <div className="relative flex-1 min-w-[220px] max-w-[360px]">
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

        {!!addLabel && (
          <button
            onClick={onAddClick}
            className="ml-auto py-2.5 px-[22px] rounded-[22px] border-none bg-sage text-parchment font-body font-extrabold text-base cursor-pointer shadow-[0_4px_10px_rgba(125,157,110,0.35)] flex items-center gap-1.5"
          >
            <span className="text-lg">+</span> {addLabel}
          </button>
        )}
      </div>

      {hasBooks ? (
        <div
          className="grid gap-x-[22px] gap-y-7 py-[26px] px-5 rounded-[20px]"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(148px, 1fr))",
            background:
              "repeating-linear-gradient(180deg, rgba(139,105,74,0.06) 0px, rgba(139,105,74,0.06) 210px, rgba(139,105,74,0.14) 210px, rgba(139,105,74,0.14) 218px)",
          }}
        >
          {filtered.map((book) => (
            <BookCard key={book.id} book={book} onClick={() => onOpenBook(book)} />
          ))}
        </div>
      ) : (
        <div className="text-center py-[70px] text-driftwood font-body">
          <div className="text-5xl mb-3">{q ? "🔍" : "🌿"}</div>
          <div className="text-lg">{q ? "No books match your search." : emptyText}</div>
        </div>
      )}
    </div>
  );
}
