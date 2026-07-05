import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLibrary } from "../context/LibraryContext.js";
import BookCard from "../components/BookCard.js";
import type { Book } from "../types/book.js";

function hasReview(book: Book) {
  return !!(book.reviewRating || book.reviewThoughts || book.reviewFavoriteCharacter || book.reviewStartedAt || book.reviewFinishedAt);
}

export default function Reviews() {
  const navigate = useNavigate();
  const { books } = useLibrary();

  const reviewed = useMemo(
    () =>
      books
        .filter((b) => b.status === "finished" && hasReview(b))
        .sort((a, b) => (b.reviewFinishedAt || "").localeCompare(a.reviewFinishedAt || "")),
    [books]
  );

  return (
    <div className="w-full min-h-full px-4 sm:px-12 pt-9 pb-16">
      <div className="flex items-center gap-3.5 mb-1.5">
        <span className="text-[36px]">📝</span>
        <h1 className="font-display text-5xl font-semibold text-clay m-0">Reviews</h1>
      </div>
      <div className="font-body text-sand text-base sm:ml-[50px] mb-8">
        {reviewed.length} review{reviewed.length === 1 ? "" : "s"}
      </div>

      {reviewed.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviewed.map((book) => (
            <div
              key={book.id}
              onClick={() => navigate(`/books/${book.id}/review/view`)}
              className="flex gap-4 bg-white rounded-[22px] p-4 shadow-[0_8px_20px_rgba(74,53,39,0.14)] cursor-pointer transition-transform hover:-translate-y-1 overflow-hidden"
            >
              <div className="flex-none">
                <BookCard book={book} size="small" />
              </div>
              <div className="flex-1 flex flex-col justify-center gap-2 min-w-0">
                <h2 className="font-display text-lg font-semibold text-clay leading-tight truncate">{book.title}</h2>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span key={n} className="text-base" style={{ color: n <= (book.reviewRating || 0) ? "#d9a05b" : "rgba(139,105,74,0.25)" }}>
                      ★
                    </span>
                  ))}
                </div>
                <div className="text-[13px] text-driftwood truncate">
                  <span className="font-bold text-sand">Started:</span> {book.reviewStartedAt || "—"}
                </div>
                <div className="text-[13px] text-driftwood truncate">
                  <span className="font-bold text-sand">Finished:</span> {book.reviewFinishedAt || "—"}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-[70px] text-driftwood font-body">
          <div className="text-5xl mb-3">📝</div>
          <div className="text-lg">No reviews yet — finish a book and write your first one!</div>
        </div>
      )}
    </div>
  );
}
