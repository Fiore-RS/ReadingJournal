import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLibrary } from "../context/LibraryContext.js";
import type { ReviewDraft } from "../types/book.js";

export default function Review() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { books, saveReview } = useLibrary();
  const book = books.find((b) => b.id === id);

  const [draft, setDraft] = useState<ReviewDraft>({
    rating: book?.reviewRating || 0,
    startedAt: book?.reviewStartedAt || "",
    finishedAt: book?.reviewFinishedAt || new Date().toISOString().slice(0, 10),
    favoriteCharacter: book?.reviewFavoriteCharacter || "",
    thoughts: book?.reviewThoughts || "",
    favorite: !!book?.favorite,
  });

  if (!book) {
    return <div className="text-center py-20 text-driftwood">Book not found.</div>;
  }

  const patch = (p: Partial<ReviewDraft>) => setDraft((d) => ({ ...d, ...p }));

  const handleSave = async () => {
    await saveReview(book.id, draft);
    navigate(`/books/${book.id}`);
  };

  return (
    <div className="w-full min-h-full flex items-start justify-center px-6 py-12">
      <div className="bg-parchment rounded-[26px] p-10 max-w-[640px] w-full shadow-[0_12px_30px_rgba(74,53,39,0.16)] relative">
        <div className="absolute -top-2.5 left-11 w-14 h-6 bg-[#d9c79a]/85 -rotate-[5deg] shadow-[0_3px_6px_rgba(0,0,0,0.12)]" />
        <div className="flex items-center gap-4 mb-2">
          <span className="text-[32px]">📝</span>
          <div>
            <h1 className="font-display text-[28px] font-semibold text-clay m-0">{book.title}</h1>
            <div className="text-[15.5px] text-sand">
              by {book.author} · {book.format === "digital" ? "Digital" : "Physical"} · {book.pages} pages
            </div>
          </div>
        </div>

        <div className="flex gap-1.5 my-5">
          {[1, 2, 3, 4, 5].map((n) => (
            <span
              key={n}
              onClick={() => patch({ rating: n })}
              className="text-[36px] cursor-pointer"
              style={{ color: n <= (draft.rating || 0) ? "#d9a05b" : "rgba(139,105,74,0.25)" }}
            >
              ★
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3.5 mb-4">
          <div>
            <label className="text-sm font-bold text-sand uppercase">Started</label>
            <input
              type="date"
              value={draft.startedAt}
              onChange={(e) => patch({ startedAt: e.target.value })}
              className="w-full py-2.5 px-3 rounded-xl border-[1.5px] border-bark/28 mt-1 text-[15.5px] text-clay"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-sand uppercase">Finished</label>
            <input
              type="date"
              value={draft.finishedAt}
              onChange={(e) => patch({ finishedAt: e.target.value })}
              className="w-full py-2.5 px-3 rounded-xl border-[1.5px] border-bark/28 mt-1 text-[15.5px] text-clay"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="text-sm font-bold text-sand uppercase">Favorite Character</label>
          <input
            type="text"
            placeholder="Who stole the show?"
            value={draft.favoriteCharacter}
            onChange={(e) => patch({ favoriteCharacter: e.target.value })}
            className="w-full py-2.5 px-3 rounded-xl border-[1.5px] border-bark/28 mt-1 text-[15.5px] text-clay"
          />
        </div>

        <div className="mb-5">
          <label className="text-sm font-bold text-sand uppercase">My Thoughts</label>
          <textarea
            placeholder="How did this story make you feel?"
            value={draft.thoughts}
            onChange={(e) => patch({ thoughts: e.target.value })}
            rows={5}
            className="w-full p-3 rounded-2xl border-[1.5px] border-bark/28 mt-1 text-[15.5px] text-clay resize-y"
          />
        </div>

        <div className="flex items-center gap-2.5 mb-6">
          <input type="checkbox" checked={draft.favorite} onChange={(e) => patch({ favorite: e.target.checked })} className="w-[18px] h-[18px]" />
          <label className="text-[15.5px] text-bark">Add to Top Favorites 💚</label>
        </div>

        <div className="flex gap-2.5">
          <button onClick={handleSave} className="py-3 px-6 rounded-[20px] border-none bg-sage text-parchment font-extrabold text-base cursor-pointer shadow-[0_4px_10px_rgba(125,157,110,0.3)]">
            Save Review
          </button>
          <button onClick={() => navigate(`/books/${book.id}`)} className="py-3 px-6 rounded-[20px] border-[1.5px] border-bark/30 bg-transparent text-bark font-bold text-base cursor-pointer">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
