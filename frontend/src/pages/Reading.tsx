import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLibrary } from "../context/LibraryContext.js";
import BookCard from "../components/BookCard.js";

export default function Reading() {
  const navigate = useNavigate();
  const { books, setProgress, setStatus, openEditBookModal, changeCurrentBook, openPickModal } = useLibrary();
  const [readingIndexRaw, setReadingIndexRaw] = useState(0);
  const [progressInput, setProgressInput] = useState("");
  const [direction, setDirection] = useState<"left" | "right">("right");

  const readingBooks = books.filter((b) => b.status === "reading");
  const readingIndex = Math.max(0, Math.min(readingIndexRaw, readingBooks.length - 1));
  const current = readingBooks[readingIndex];

  const goToIndex = (nextIndex: number, dir: "left" | "right") => {
    setDirection(dir);
    setReadingIndexRaw(nextIndex);
    setProgressInput("");
  };

  const progressPercent = current?.pages ? Math.min(100, Math.round(((current.progressPages || 0) / current.pages) * 100)) : 0;

  const handleSaveProgress = async () => {
    if (!current) return;
    const val = parseInt(progressInput, 10);
    const clamped = isNaN(val) ? current.progressPages : Math.max(0, Math.min(val, current.pages || val));
    await setProgress(current.id, clamped);
    setProgressInput("");
  };

  const handleMarkFinished = async () => {
    if (!current) return;
    await setStatus(current.id, "finished", current.pages);
    navigate(`/books/${current.id}/review`, { state: { fromReading: true } });
  };

  const handleChangeBook = () => {
    openPickModal("Choose a Book to Read", (b) => b.status !== "reading", async (b) => {
      await changeCurrentBook(current?.id ?? null, b.id);
    });
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-6 py-7 relative">
      <h1 className="font-display text-[34px] font-semibold text-clay mb-1.5">🔖 Currently Reading</h1>

      {readingBooks.length > 0 && current ? (
        <>
          <div className="flex items-center gap-2 w-full max-w-[920px] mt-5">
            <button
              onClick={() => goToIndex((readingIndex - 1 + readingBooks.length) % readingBooks.length, "left")}
              className="flex-none w-[46px] h-[46px] rounded-full border-none bg-parchment shadow-[0_4px_10px_rgba(74,53,39,0.18)] text-xl cursor-pointer text-latte transition-transform hover:-translate-x-0.5 active:scale-90"
            >
              ←
            </button>

            <div
              key={current.id}
              className={`flex-1 flex gap-9 bg-white rounded-[26px] p-8 shadow-[0_12px_30px_rgba(74,53,39,0.18)] relative ${
                direction === "right" ? "motion-safe:animate-swipe-in-right" : "motion-safe:animate-swipe-in-left"
              }`}
            >
              <div className="absolute -top-2.5 left-10 w-[60px] h-6 bg-blush/85 -rotate-[4deg] rounded-sm shadow-[0_3px_6px_rgba(0,0,0,0.12)]" />
              <div className="flex-none w-[190px]">
                <BookCard book={current} size="large" />
              </div>
              <div className="flex-1 flex flex-col gap-3.5 min-w-0">
                <div>
                  <h2 className="font-display text-[30px] font-semibold text-clay mb-1">{current.title}</h2>
                  <div className="text-[17px] text-sand">by {current.author}</div>
                </div>
                <div className="flex gap-2.5 flex-wrap">
                  <span className="py-1.5 px-3.5 rounded-2xl bg-sage/15 text-[#5c7a4d] text-[14.5px] font-bold">
                    {current.format === "digital" ? "Digital" : "Physical"}
                  </span>
                  <span className="py-1.5 px-3.5 rounded-2xl bg-honey/15 text-[#8a5a3f] text-[14.5px] font-bold">{current.language}</span>
                  <span className="py-1.5 px-3.5 rounded-2xl bg-bark/[0.14] text-latte text-[14.5px] font-bold">{current.pages} pages</span>
                </div>
                <div>
                  <div className="flex justify-between text-[15px] text-sand mb-1.5">
                    <span>{current.progressPages} / {current.pages} pages</span>
                    <span>{progressPercent}%</span>
                  </div>
                  <div className="h-3 rounded-lg bg-bark/15 overflow-hidden">
                    <div className="h-full rounded-lg bg-gradient-to-r from-sage-soft to-sage" style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>
                <div className="flex items-center gap-2.5 mt-1">
                  <input
                    type="number"
                    min={0}
                    value={progressInput !== "" ? progressInput : current.progressPages}
                    onChange={(e) => setProgressInput(e.target.value)}
                    className="w-[90px] py-2 px-3 rounded-xl border-[1.5px] border-bark/28 bg-white text-[15.5px] text-clay"
                  />
                  <button onClick={handleSaveProgress} className="py-2 px-4 rounded-xl border-none bg-sand text-parchment font-bold text-[15px] cursor-pointer">
                    Update Progress
                  </button>
                </div>
                <div className="flex gap-2.5 flex-wrap mt-auto pt-2">
                  <button onClick={handleMarkFinished} className="py-2.5 px-5 rounded-[20px] border-none bg-sage text-parchment font-extrabold text-[15.5px] cursor-pointer shadow-[0_4px_10px_rgba(125,157,110,0.3)]">
                    ✔ Mark as Finished
                  </button>
                  <button onClick={() => openEditBookModal(current)} className="py-2.5 px-5 rounded-[20px] border-[1.5px] border-bark/30 bg-transparent text-bark font-bold text-[15.5px] cursor-pointer">
                    Update Info
                  </button>
                  <button onClick={handleChangeBook} className="py-2.5 px-5 rounded-[20px] border-[1.5px] border-bark/30 bg-transparent text-bark font-bold text-[15.5px] cursor-pointer">
                    Change Book
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => goToIndex((readingIndex + 1) % readingBooks.length, "right")}
              className="flex-none w-[46px] h-[46px] rounded-full border-none bg-parchment shadow-[0_4px_10px_rgba(74,53,39,0.18)] text-xl cursor-pointer text-latte transition-transform hover:translate-x-0.5 active:scale-90"
            >
              →
            </button>
          </div>

          <div className="flex gap-2 mt-5">
            {readingBooks.map((b, i) => (
              <div
                key={b.id}
                onClick={() => goToIndex(i, i > readingIndex ? "right" : "left")}
                className="w-[9px] h-[9px] rounded-full cursor-pointer transition-transform hover:scale-125"
                style={{ background: i === readingIndex ? "#7d9d6e" : "rgba(139,105,74,0.25)" }}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-[60px] text-driftwood">
          <div className="text-[46px] mb-2.5">🌱</div>
          <div className="text-lg mb-5">Nothing on your nightstand right now.</div>
          <button onClick={handleChangeBook} className="py-3 px-6 rounded-[20px] border-none bg-sage text-parchment font-extrabold text-base cursor-pointer">
            Start a Book
          </button>
        </div>
      )}
    </div>
  );
}
