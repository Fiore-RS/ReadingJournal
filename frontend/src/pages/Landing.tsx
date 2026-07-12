import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useLibrary } from "../context/LibraryContext.js";
import { resolveMediaUrl } from "../services/api.js";
import type { Book } from "../types/book.js";

// Fixed slots for the floating finished-book covers around the hero book.
// top/left/right are percentages of the scene; size is the cover width in px.
const FLOAT_POSITIONS = [
  { top: "0%", left: "2%", rotate: -9, size: 92 },
  { top: "38%", left: "-4%", rotate: 6, size: 106 },
  { top: "76%", left: "6%", rotate: -5, size: 84 },
  { top: "0%", right: "2%", rotate: 8, size: 96 },
  { top: "40%", right: "-4%", rotate: -7, size: 108 },
  { top: "78%", right: "8%", rotate: 5, size: 86 },
] as const;

function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function FloatingCover({ book, slot, delay }: { book: Book; slot: (typeof FLOAT_POSITIONS)[number]; delay: number }) {
  const imageUrl = resolveMediaUrl(book.coverImage);
  return (
    <div
      className="hidden sm:block absolute rounded-lg overflow-hidden shadow-[0_10px_20px_rgba(74,53,39,0.22)] opacity-90 animate-floaty"
      style={{
        top: slot.top,
        left: "left" in slot ? slot.left : undefined,
        right: "right" in slot ? slot.right : undefined,
        width: slot.size,
        height: slot.size * 1.5,
        transform: `rotate(${slot.rotate}deg)`,
        animationDelay: `${delay}s`,
        background: imageUrl ? undefined : book.coverBg,
      }}
      title={book.title}
    >
      {imageUrl ? (
        <img src={imageUrl} alt={book.title} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-end p-2">
          <span className="font-body text-[10px] font-bold text-parchment/90 line-clamp-2 [text-shadow:0_1px_2px_rgba(0,0,0,0.4)]">
            {book.title}
          </span>
        </div>
      )}
    </div>
  );
}

export default function Landing() {
  const { books, loading } = useLibrary();

  const readingBooks = useMemo(() => books.filter((b) => b.status === "reading"), [books]);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const current = readingBooks[Math.min(index, readingBooks.length - 1)];

  // Finished books chosen for the floating covers: picked once, the first time
  // data finishes loading, so they stay put during this session and only
  // reshuffle on an actual page refresh (fresh mount).
  const [floatingBooks, setFloatingBooks] = useState<Book[] | null>(null);
  useEffect(() => {
    if (floatingBooks === null && !loading) {
      const finished = books.filter((b) => b.status === "finished");
      setFloatingBooks(pickRandom(finished, Math.min(FLOAT_POSITIONS.length, finished.length)));
    }
  }, [loading, books, floatingBooks]);

  const goToIndex = (nextIndex: number, dir: "left" | "right") => {
    setDirection(dir);
    setIndex(nextIndex);
  };

  const currentImageUrl = current ? resolveMediaUrl(current.coverImage) : undefined;

  return (
    <div
      className="w-full h-full flex flex-col overflow-y-auto overflow-x-hidden"
      style={{ background: "radial-gradient(ellipse at 50% 15%, #fbf5e9 0%, #f6efe2 55%, #ead9bd 100%)" }}
    >
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 relative">

        {/* Encabezado */}
        <div className="text-center mb-10 sm:mb-14 relative z-30">
          <span className="block font-body text-xs tracking-[0.22em] uppercase text-sage font-bold mb-3">
            Personal library
          </span>
          <h1 className="font-display font-bold text-[32px] md:text-[42px] text-clay leading-tight">
            My Reading Journal
          </h1>
        </div>

        {/* Escena central: portadas flotantes (terminados) + libro grande (leyendo) */}
        <div className="relative w-full max-w-[640px] h-auto sm:h-[300px] md:h-[340px] flex items-center justify-center py-2 sm:py-0">

          {floatingBooks?.map((book, i) => (
            <FloatingCover key={book.id} book={book} slot={FLOAT_POSITIONS[i]} delay={i * 0.35} />
          ))}

          {current ? (
            <div className="relative z-10 flex items-center gap-4 md:gap-6">
              {readingBooks.length > 1 && (
                <button
                  onClick={() => goToIndex((index - 1 + readingBooks.length) % readingBooks.length, "left")}
                  aria-label="Previous book"
                  className="flex-none w-[42px] h-[42px] rounded-full border-none bg-sage shadow-[0_4px_10px_rgba(125,157,110,0.35)] text-lg cursor-pointer text-parchment transition-transform hover:-translate-x-0.5 active:scale-90"
                >
                  ←
                </button>
              )}

              <div key={current.id} className="flex flex-col items-center motion-safe:animate-fadein">
                <div
                  className={`relative w-[170px] md:w-[200px] aspect-[2/3] rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(74,53,39,0.28)] border-4 border-parchment ${
                    direction === "right" ? "motion-safe:animate-swipe-in-right" : "motion-safe:animate-swipe-in-left"
                  }`}
                  style={{ background: currentImageUrl ? undefined : current.coverBg }}
                >
                  {currentImageUrl ? (
                    <img src={currentImageUrl} alt={current.title} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-end p-3">
                      <span className="font-display font-semibold text-parchment text-base [text-shadow:0_1px_2px_rgba(0,0,0,0.4)] line-clamp-3">
                        {current.title}
                      </span>
                    </div>
                  )}

                  {readingBooks.length > 1 && (
                    <div className="absolute top-2 left-2 right-2 flex gap-1 z-10">
                      {readingBooks.map((b, i) => (
                        <div
                          key={b.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            goToIndex(i, i > index ? "right" : "left");
                          }}
                          className="flex-1 h-[3px] rounded-full cursor-pointer overflow-hidden bg-parchment/40"
                        >
                          <div
                            className="h-full rounded-full bg-parchment transition-[width] duration-200"
                            style={{ width: i === index ? "100%" : "0%" }}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <span className="absolute top-6 left-2.5 text-[10px] font-body font-bold uppercase tracking-wide text-parchment bg-clay/70 rounded-full px-2 py-0.5">
                    Reading
                  </span>
                </div>
                <p className="font-display font-bold text-clay text-lg mt-3 text-center max-w-[220px] line-clamp-2 min-h-[44px]">
                  {current.title}
                </p>
                <p className="font-body text-sand text-sm">{current.author}</p>
              </div>

              {readingBooks.length > 1 && (
                <button
                  onClick={() => goToIndex((index + 1) % readingBooks.length, "right")}
                  aria-label="Next book"
                  className="flex-none w-[42px] h-[42px] rounded-full border-none bg-sage shadow-[0_4px_10px_rgba(125,157,110,0.35)] text-lg cursor-pointer text-parchment transition-transform hover:translate-x-0.5 active:scale-90"
                >
                  →
                </button>
              )}
            </div>
          ) : (
            <div className="relative z-10 text-center">
              <div className="text-[40px] mb-2">🌱</div>
              <p className="font-body text-sand text-base">
                {loading ? "Loading your library…" : "You're not reading anything yet."}
              </p>
            </div>
          )}
        </div>

        {/* CTA */}
        <Link
          to="/library"
          className="mt-12 sm:mt-14 inline-block py-[15px] px-[34px] rounded-[26px] bg-sage text-parchment font-extrabold text-xl shadow-[0_8px_18px_rgba(125,157,110,0.35)] transition-transform hover:-translate-y-0.5 relative z-30"
        >
          Open my library →
        </Link>
      </div>
    </div>
  );
}