import { useState } from "react";
import { useLibrary } from "../../context/LibraryContext.js";
import BookCard from "../BookCard.js";
import ModalShell from "./ModalShell.js";

const STATUS_MAP: Record<string, { label: string; bg: string; color: string }> = {
  reading: { label: "Reading", bg: "rgba(217,199,154,0.35)", color: "#8a6a2e" },
  tbr: { label: "To Be Read", bg: "rgba(159,184,163,0.3)", color: "#4c6b53" },
  wishlist: { label: "Wishlist", bg: "rgba(227,184,196,0.35)", color: "#9a4f66" },
  finished: { label: "Finished", bg: "rgba(125,157,110,0.28)", color: "#4a6b3a" },
};

export default function BookDetailsModal({ bookId }: { bookId: string }) {
  const { books, openEditBookModal, setFavorite, removeBook, closeModal, openReviewViewModal, openReviewEditModal } = useLibrary();
  const book = books.find((b) => b.id === bookId);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  if (!book) {
    return (
      <ModalShell onClose={closeModal} maxWidth={420}>
        <div className="text-center py-10 text-driftwood">
          <div className="text-5xl mb-2.5">🔍</div>
          <div>Book not found — it may have been deleted.</div>
        </div>
      </ModalShell>
    );
  }

  const sm = STATUS_MAP[book.status] || STATUS_MAP.tbr;
  const seriesLabel = book.series ? `${book.series} (#${book.seriesOrder || 1})` : "Standalone";
  const favBtnLabel = book.favorite ? "♥ Favorited" : "♡ Add to Favorites";

  return (
    <ModalShell onClose={closeModal} maxWidth={820} bgClassName="bg-white" showCloseButton>
      <div className="flex gap-10 flex-col sm:flex-row">
        <div className="flex-none w-[210px] mx-auto sm:mx-0 flex flex-col gap-3">
          <BookCard book={book} size="large" />
          {!confirmingDelete ? (
            <button
              onClick={() => setConfirmingDelete(true)}
              className="w-full py-2.5 px-4 rounded-[20px] border-[1.5px] border-honey/40 bg-transparent text-[#a15b3d] font-bold text-[14.5px] cursor-pointer mt-auto"
            >
              Delete Book
            </button>
          ) : (
            <div className="mt-auto flex flex-col gap-2 p-3 rounded-2xl bg-[#a15b3d]/10 border-[1.5px] border-[#a15b3d]/30">
              <div className="text-[13px] text-[#a15b3d] font-bold text-center leading-snug">
                Delete "{book.title}" permanently? This can't be undone.
              </div>
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    await removeBook(book.id);
                    closeModal();
                  }}
                  className="flex-1 py-2 rounded-xl border-none bg-[#a15b3d] text-white font-bold text-[13.5px] cursor-pointer"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setConfirmingDelete(false)}
                  className="flex-1 py-2 rounded-xl border-[1.5px] border-bark/25 bg-white text-bark font-bold text-[13.5px] cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <div>
            <span
              className="py-1 px-3 rounded-xl text-sm font-extrabold uppercase tracking-wide"
              style={{ background: sm.bg, color: sm.color }}
            >
              {sm.label}
            </span>
            <h1 className="font-display text-[30px] font-semibold text-clay mt-2.5 mb-1">{book.title}</h1>
            <div className="text-[16px] text-sand">by {book.author}</div>
          </div>
          <div className="grid grid-cols-2 gap-x-5 gap-y-3">
            <div>
              <div className="text-[13.5px] text-driftwood font-bold uppercase">Category</div>
              <div className="text-[16.5px] text-clay capitalize">{book.category}</div>
            </div>
            <div>
              <div className="text-[13.5px] text-driftwood font-bold uppercase">Format</div>
              <div className="text-[16.5px] text-clay">{book.format === "digital" ? "Digital" : "Physical"}</div>
            </div>
            <div>
              <div className="text-[13.5px] text-driftwood font-bold uppercase">Language</div>
              <div className="text-[16.5px] text-clay">{book.language}</div>
            </div>
            <div>
              <div className="text-[13.5px] text-driftwood font-bold uppercase">Pages</div>
              <div className="text-[16.5px] text-clay">{book.pages}</div>
            </div>
            <div>
              <div className="text-[13.5px] text-driftwood font-bold uppercase">Series</div>
              <div className="text-[16.5px] text-clay">{seriesLabel}</div>
            </div>
          </div>
          {book.status === "finished" && (
            <div className="flex gap-7 flex-wrap pt-3 border-t border-bark/10">
              <div>
                <div className="text-[13.5px] text-driftwood font-bold uppercase">Started</div>
                <div className="text-[16.5px] text-clay">{book.reviewStartedAt || "—"}</div>
              </div>
              <div>
                <div className="text-[13.5px] text-driftwood font-bold uppercase">Finished</div>
                <div className="text-[16.5px] text-clay">{book.reviewFinishedAt || "—"}</div>
              </div>
              <div>
                <div className="text-[13.5px] text-driftwood font-bold uppercase mb-1">Rating</div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span key={n} className="text-lg" style={{ color: n <= (book.reviewRating || 0) ? "#d9a05b" : "rgba(139,105,74,0.25)" }}>
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div className="flex gap-2.5 flex-wrap mt-auto pt-2.5">
            <button
              onClick={() => openEditBookModal(book)}
              className="py-2.5 px-5 rounded-[20px] border-none bg-sand text-parchment font-extrabold text-[15.5px] cursor-pointer"
            >
              Edit Details
            </button>
            {book.status === "finished" && (
              <button
                onClick={() => (book.reviewRating ? openReviewViewModal(book.id) : openReviewEditModal(book.id))}
                className="py-2.5 px-5 rounded-[20px] border-[1.5px] border-bark/30 bg-transparent text-bark font-bold text-[15.5px] cursor-pointer"
              >
                {book.reviewRating ? "View Review" : "Write Review"}
              </button>
            )}
            <button
              onClick={() => setFavorite(book.id, !book.favorite)}
              className="py-2.5 px-5 rounded-[20px] border-[1.5px] border-bark/30 bg-transparent text-bark font-bold text-[15.5px] cursor-pointer"
            >
              {favBtnLabel}
            </button>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}