import { useLibrary } from "../../context/LibraryContext.js";
import BookCard from "../BookCard.js";
import ModalShell from "./ModalShell.js";

export default function ReviewViewModal({ bookId }: { bookId: string }) {
  const { books, closeModal, openReviewEditModal, openDetailsModal } = useLibrary();
  const book = books.find((b) => b.id === bookId);

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

  return (
    <ModalShell onClose={closeModal} maxWidth={760} bgClassName="bg-white" showCloseButton>
      <div className="flex gap-10 flex-col sm:flex-row">
        <div className="flex-none w-[190px] mx-auto sm:mx-0">
          <BookCard book={book} size="large" />
        </div>
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <div>
            <h1 className="font-display text-[28px] font-semibold text-clay mb-1">{book.title}</h1>
            <div className="text-[15.5px] text-sand">
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
          </div>

          <div className="flex gap-2.5 flex-wrap mt-auto pt-2.5">
            <button
              onClick={() => openReviewEditModal(book.id)}
              className="py-2.5 px-5 rounded-[20px] border-none bg-sage text-parchment font-extrabold text-[15.5px] cursor-pointer shadow-[0_4px_10px_rgba(125,157,110,0.3)]"
            >
              Edit Review
            </button>
            <button
              onClick={() => openDetailsModal(book.id)}
              className="py-2.5 px-5 rounded-[20px] border-[1.5px] border-bark/30 bg-transparent text-bark font-bold text-[15.5px] cursor-pointer"
            >
              View Book Details
            </button>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
