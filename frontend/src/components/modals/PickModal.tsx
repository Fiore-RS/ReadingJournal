import { useState } from "react";
import type { Book } from "../../types/book.js";
import BookCard from "../BookCard.js";
import ModalShell from "./ModalShell.js";

interface PickModalProps {
  title: string;
  books: Book[];
  filterFn: (b: Book) => boolean;
  onPick: (b: Book) => void;
  onClose: () => void;
}

export default function PickModal({ title, books, filterFn, onPick, onClose }: PickModalProps) {
  const [search, setSearch] = useState("");
  const q = search.trim().toLowerCase();
  const results = books
    .filter(filterFn)
    .filter((b) => !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));

  return (
    <ModalShell onClose={onClose} maxWidth={640}>
      <h2 className="font-display text-[24px] text-clay mt-1.5 mb-3.5">{title}</h2>
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full py-2.5 px-3.5 rounded-2xl border-[1.5px] border-bark/25 mb-4 text-base"
      />
      {results.length > 0 ? (
        <div className="flex flex-wrap gap-4">
          {results.map((book) => (
            <BookCard key={book.id} book={book} size="small" onClick={() => onPick(book)} />
          ))}
        </div>
      ) : (
        <div className="text-center py-7 text-driftwood text-base">No matching books.</div>
      )}
    </ModalShell>
  );
}
