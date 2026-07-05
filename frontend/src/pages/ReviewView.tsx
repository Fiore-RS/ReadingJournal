import { useNavigate, useParams } from "react-router-dom";
import { useLibrary } from "../context/LibraryContext.js";
import BookCard from "../components/BookCard.js";

export default function ReviewView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { books } = useLibrary();
  const book = books.find((b) => b.id === id);

  if (!book) {
    return (
      <div className="text-center py-20 text-driftwood">
        <div className="text-5xl mb-2.5">🔍</div>
        <div>Book not found — it may have been deleted.</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-full flex items-center justify-center px-6 py-12">
      <div className="flex gap-10 bg-white rounded-[26px] p-10 max-w-[760px] w-full shadow-[0_12px_30px_rgba(74,53,39,0.16)] relative">
        <div className="absolute -top-2.5 left-11 w-14 h-6 bg-[#d9c79a]/85 -rotate-[5deg] shadow-[0_3px_6px_rgba(0,0,0,0.12)]" />
        <div className="flex-none w-[190px]">
          <BookCard book={book} size="large" />
        </div>
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <div>
            <h1 className="font-display text-[30px] font-semibold text-clay mb-1">{book.title}</h1>
            <div className="text-[16px] text-sand">
              by {book.author} · {book.format === "digital" ? "Digital" : "Physical"} · {book.pages} pages
            </div>
          </div>

          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <span key={n} className="text-2xl" style={{ color: n <= (book.reviewRating || 0) ? "#d9a05b" : "rgba(139,105,74,0.25)" }}>
                ★
              </span>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-x-5 gap-y-3">
            <div>
              <div className="text-[13.5px] text-driftwood font-bold uppercase">Started</div>
              <div className="text-[16.5px] text-clay">{book.reviewStartedAt || "—"}</div>
            </div>
            <div>
              <div className="text-[13.5px] text-driftwood font-bold uppercase">Finished</div>
              <div className="text-[16.5px] text-clay">{book.reviewFinishedAt || "—"}</div>
            </div>
            {!!book.reviewFavoriteCharacter && (
              <div className="col-span-2">
                <div className="text-[13.5px] text-driftwood font-bold uppercase">Favorite Character</div>
                <div className="text-[16.5px] text-clay">{book.reviewFavoriteCharacter}</div>
              </div>
            )}
          </div>

          <div>
            <div className="text-[13.5px] text-driftwood font-bold uppercase mb-1.5">My Thoughts</div>
            <p className="text-[15.5px] text-clay leading-relaxed whitespace-pre-wrap">
              {book.reviewThoughts || "No thoughts recorded yet."}
            </p>
          </div>

          <div className="flex gap-2.5 flex-wrap mt-auto pt-2.5">
            <button
              onClick={() => navigate(`/books/${book.id}/review`)}
              className="py-2.5 px-5 rounded-[20px] border-none bg-sage text-parchment font-extrabold text-[15.5px] cursor-pointer shadow-[0_4px_10px_rgba(125,157,110,0.3)]"
            >
              Edit Review
            </button>
            <button
              onClick={() => navigate(`/books/${book.id}`)}
              className="py-2.5 px-5 rounded-[20px] border-[1.5px] border-bark/30 bg-transparent text-bark font-bold text-[15.5px] cursor-pointer"
            >
              View Book Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
