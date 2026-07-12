import { useMemo, useState } from "react";
import { useLibrary } from "../context/LibraryContext.js";
import BookCard from "../components/BookCard.js";

export default function Series() {
  const { books, extraSeries, setModal, openPickModal, openEditBookModal, openDetailsModal } = useLibrary();
  const [search, setSearch] = useState("");

  const q = search.trim().toLowerCase();
  const matches = (b: (typeof books)[number]) =>
    !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);

  const sections = useMemo(() => {
    const seriesNames = Array.from(new Set(books.filter((b) => b.series).map((b) => b.series as string)));
    extraSeries.forEach((s) => {
      if (!seriesNames.includes(s.name)) seriesNames.push(s.name);
    });
    seriesNames.sort((a, b) => a.localeCompare(b));

    const result = seriesNames.map((name) => {
      const secBooks = books
        .filter((b) => b.series === name && matches(b))
        .sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0));
      return { name, books: secBooks, countLabel: `${secBooks.length} book${secBooks.length === 1 ? "" : "s"}` };
    });

    const standalone = books.filter((b) => !b.series && matches(b)).sort((a, b) => a.title.localeCompare(b.title));
    result.push({ name: "Standalones", books: standalone, countLabel: `${standalone.length} book${standalone.length === 1 ? "" : "s"}` });

    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [books, extraSeries, q]);

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 pt-6 sm:pt-9 pb-16">
      <div className="flex items-center gap-2.5 sm:gap-3.5 mb-6 flex-wrap">
        <span className="text-2xl sm:text-3xl lg:text-[36px]">🩷</span>
        <h1 className="font-display text-2xl sm:text-3xl lg:text-5xl font-semibold text-clay m-0">Series &amp; Standalones</h1>
        <div className="w-full sm:w-auto sm:ml-auto flex gap-3">
          <button
            onClick={() => setModal({ type: "newSeries", name: "" })}
            className="flex-1 sm:flex-none py-2.5 px-[18px] rounded-[20px] border-[1.5px] border-bark/25 bg-parchment font-extrabold text-sm sm:text-[15.5px] text-bark cursor-pointer whitespace-nowrap"
          >
            + New Series
          </button>
          <button
            onClick={() => openPickModal("Add a Book to a Series", () => true, (b) => openEditBookModal(b))}
            className="flex-1 sm:flex-none py-2.5 px-[18px] rounded-[20px] border-none bg-sage text-parchment font-extrabold text-sm sm:text-[15.5px] cursor-pointer shadow-[0_4px_10px_rgba(125,157,110,0.35)] whitespace-nowrap"
          >
            + Add Existing Book
          </button>
        </div>
      </div>

      <div className="relative w-full sm:max-w-[360px] mb-7">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[17px] opacity-60">🔍</span>
        <input
          type="text"
          placeholder="Search by title or author..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full py-2.5 pl-[42px] pr-4 rounded-[22px] border-[1.5px] border-bark/25 bg-parchment text-base text-clay outline-none"
        />
      </div>

      {sections.map((section) => (
        <div key={section.name} className="mb-9">
          <div className="flex items-baseline gap-2.5 mb-3.5">
            <div className="w-[30px] h-1.5 rounded bg-sage-soft" />
            <h2 className="font-display text-2xl font-semibold text-clay m-0">{section.name}</h2>
            <span className="text-[14.5px] text-driftwood">{section.countLabel}</span>
          </div>
          {section.books.length > 0 ? (
            <div className="flex gap-4 sm:gap-9 flex-wrap p-3 sm:p-5 rounded-[18px] bg-bark/[0.06]">
              {section.books.map((book) => (
                <BookCard key={book.id} book={book} onClick={() => openDetailsModal(book.id)} metaMode="series" />
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-[18px] bg-bark/[0.06] text-driftwood text-base">No books in this series yet.</div>
          )}
        </div>
      ))}
    </div>
  );
}
