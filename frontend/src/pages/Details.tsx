import { useNavigate, useParams } from "react-router-dom";
import { useLibrary } from "../context/LibraryContext.js";
import BookCard from "../components/BookCard.js";

const STATUS_MAP: Record<string, { label: string; bg: string; color: string }> = {
  reading: { label: "Currently Reading", bg: "rgba(217,199,154,0.35)", color: "#8a6a2e" },
  tbr: { label: "To Be Read", bg: "rgba(159,184,163,0.3)", color: "#4c6b53" },
  wishlist: { label: "Wishlist", bg: "rgba(227,184,196,0.35)", color: "#9a4f66" },
  finished: { label: "Finished", bg: "rgba(125,157,110,0.28)", color: "#4a6b3a" },
};

export default function Details() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { books, openEditBookModal, setFavorite, removeBook } = useLibrary();

  const book = books.find((b) => b.id === id);

  if (!book) {
    return (
      <div className="text-center py-20 text-driftwood">
        <div className="text-5xl mb-2.5">🔍</div>
        <div>Book not found — it may have been deleted.</div>
      </div>
    );
  }

  const sm = STATUS_MAP[book.status] || STATUS_MAP.tbr;
  const seriesLabel = book.series ? `${book.series} (#${book.seriesOrder || 1})` : "Standalone";
  const favBtnLabel = book.favorite ? "♥ Favorited" : "♡ Add to Favorites";

  return (
    <div className="w-full min-h-full flex items-start justify-center px-6 py-12">
      <div className="flex gap-10 bg-parchment rounded-[26px] p-9.5 max-w-[820px] w-full shadow-[0_12px_30px_rgba(74,53,39,0.16)] relative">
        <div className="absolute -top-2.5 right-[60px] w-14 h-5.5 bg-sage-soft/85 rotate-[5deg] shadow-[0_3px_6px_rgba(0,0,0,0.12)]" />
        <div className="flex-none w-[210px]">
          <BookCard book={book} size="large" />
        </div>
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <div>
            <span
              className="py-1 px-3 rounded-xl text-sm font-extrabold uppercase tracking-wide"
              style={{ background: sm.bg, color: sm.color }}
            >
              {sm.label}
            </span>
            <h1 className="font-display text-[34px] font-semibold text-clay mt-2.5 mb-1">{book.title}</h1>
            <div className="text-[17px] text-sand">by {book.author}</div>
          </div>
          <div className="grid grid-cols-2 gap-x-5 gap-y-3">
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
          <div className="flex gap-2.5 flex-wrap mt-auto pt-2.5">
            <button
              onClick={() => openEditBookModal(book)}
              className="py-2.5 px-5 rounded-[20px] border-none bg-sand text-parchment font-extrabold text-[15.5px] cursor-pointer"
            >
              Edit Details
            </button>
            {book.status === "finished" && (
              <button
                onClick={() => navigate(`/books/${book.id}/review`)}
                className="py-2.5 px-5 rounded-[20px] border-[1.5px] border-bark/30 bg-transparent text-bark font-bold text-[15.5px] cursor-pointer"
              >
                {book.reviewRating ? "Edit Review" : "Write Review"}
              </button>
            )}
            <button
              onClick={() => setFavorite(book.id, !book.favorite)}
              className="py-2.5 px-5 rounded-[20px] border-[1.5px] border-bark/30 bg-transparent text-bark font-bold text-[15.5px] cursor-pointer"
            >
              {favBtnLabel}
            </button>
            <button
              onClick={async () => {
                await removeBook(book.id);
                navigate("/library");
              }}
              className="py-2.5 px-5 rounded-[20px] border-[1.5px] border-honey/40 bg-transparent text-[#a15b3d] font-bold text-[15.5px] cursor-pointer ml-auto"
            >
              Delete Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
