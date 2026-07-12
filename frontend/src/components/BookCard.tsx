import type { Book } from "../types/book.js";
import { resolveMediaUrl } from "../services/api.js";

interface BookCardProps {
  book: Partial<Book>;
  onClick?: (book: Partial<Book>) => void;
  size?: "small" | "normal" | "large";
  metaMode?: "progress" | "series";
}

const SIZE_MAP = {
  small: { width: "w-[118px]", title: "text-[14.5px]" },
  normal: { width: "w-[148px]", title: "text-[15.5px]" },
  large: { width: "w-[150px] sm:w-[190px]", title: "text-lg" },
};

export default function BookCard({ book, onClick, size = "normal", metaMode }: BookCardProps) {
  const dims = SIZE_MAP[size];
  const formatIcon = book.format === "digital" ? "📱" : "📖";
  const formatLabel = book.format === "digital" ? "Digital" : "Physical";
  const stripeAngle = ((book.title || "").length * 13) % 180;
  const coverStripes = `repeating-linear-gradient(${stripeAngle}deg, rgba(255,255,255,0.10) 0px, rgba(255,255,255,0.10) 6px, transparent 6px, transparent 16px)`;
  const imageUrl = resolveMediaUrl(book.coverImage);
  const categoryLabel = book.category === "manga" ? "Manga" : book.category === "novel" ? "Novel" : null;

  let metaLine1 = "";
  let metaLine2 = "";
  if (metaMode === "progress") {
    metaLine1 = `${book.progressPages || 0}/${book.pages || 0} pages`;
    metaLine2 = `${Math.round(((book.progressPages || 0) / (book.pages || 1)) * 100)}% complete`;
  } else if (metaMode === "series") {
    metaLine1 = book.series ? `#${book.seriesOrder || 1} in series` : "Standalone";
    metaLine2 = `${book.pages || 0} pages`;
  }

  return (
    <div
      onClick={() => onClick?.(book)}
      className={`group relative ${dims.width} cursor-pointer flex flex-col gap-2 transition-transform duration-150 hover:-translate-y-1`}
    >
      <div
        className="relative w-full aspect-[2/3] rounded-[14px] overflow-hidden shadow-[0_6px_14px_rgba(74,53,39,0.28),inset_-6px_0_12px_rgba(0,0,0,0.12)]"
        style={{ background: imageUrl ? undefined : book.coverBg || "#a9c19a" }}
      >
        {imageUrl ? (
          <img src={imageUrl} alt={book.title || "Book cover"} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 opacity-50" style={{ background: coverStripes }} />
        )}
        <div className="absolute left-0 top-0 bottom-0 w-[9px] bg-black/20" />
        {!!book.favorite && (
          <div
            className="absolute -top-1 right-3.5 w-[26px] h-[38px] bg-blush shadow-[0_3px_6px_rgba(0,0,0,0.2)]"
            style={{ clipPath: "polygon(0 0,100% 0,100% 100%,50% 78%,0 100%)" }}
          />
        )}
        <div className="absolute left-0 right-0 bottom-0 px-2.5 pt-2.5 pb-2 bg-gradient-to-t from-black/80 via-black/5 to-transparent">
          <div className={`font-display font-semibold ${dims.title} leading-[1.15] text-[#faf3e6] [text-shadow:0_1px_2px_rgba(0,0,0,0.4)] line-clamp-2`}>
            {book.title || "Untitled"}
          </div>
          <div className="font-body text-[13.5px] text-[#e9dcc4] mt-0.5 opacity-90 truncate">
            {book.author || "Unknown author"}
          </div>
          {!!categoryLabel && (
            <span className="inline-block mt-1 px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] font-bold text-[#faf3e6] uppercase tracking-wide">
              {categoryLabel}
            </span>
          )}
        </div>
        <div
          className="absolute top-2 left-2 w-6 h-6 rounded-full bg-[#faf3e6]/90 flex items-center justify-center text-sm"
          title={formatLabel}
        >
          {formatIcon}
        </div>
      </div>
      {!!metaMode && (
        <div className="flex flex-col gap-0.5 px-0.5">
          <div className="font-body text-sm text-bark font-bold">{metaLine1}</div>
          <div className="font-body text-[13px] text-sand">{metaLine2}</div>
        </div>
      )}
    </div>
  );
}
