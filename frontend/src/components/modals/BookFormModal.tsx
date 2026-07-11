import { useRef, useState } from "react";
import type { BookFormData } from "../../types/book.js";
import { resolveMediaUrl } from "../../services/api.js";
import { uploadsService } from "../../services/uploadsService.js";
import ModalShell from "./ModalShell.js";

const COVER_PALETTE = [
  "#c98a6b", "#8fae7d", "#b98a5e", "#e3b8c4", "#9fb8a3",
  "#d9a05b", "#7d9d8f", "#cf9a7a", "#a97c50", "#88a878",
];

interface BookFormModalProps {
  mode: "add" | "edit";
  formData: BookFormData;
  onChange: (patch: Partial<BookFormData>) => void;
  onSave: () => void;
  onClose: () => void;
}

const inputClass =
  "w-full py-2.5 px-3 rounded-xl border-[1.5px] border-bark/25 mt-1 text-base";
const labelClass = "text-sm font-bold text-sand uppercase";

export default function BookFormModal({ mode, formData, onChange, onSave, onClose }: BookFormModalProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Captured once per modal session (ModalRoot keys this component so it
  // remounts fresh for each add/edit). Anything that differs from this by
  // the time we upload again, remove, or close is an unsaved upload that
  // nothing else references — safe to delete.
  const initialCoverImage = useRef(formData.coverImage).current;

  const cleanupIfAbandoned = async (current: string | null) => {
    if (current && current !== initialCoverImage) {
      try {
        await uploadsService.deleteCover(current);
      } catch {
        // best-effort cleanup — not worth surfacing to the user
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;

    setUploadError(null);
    setUploading(true);
    try {
      const { url } = await uploadsService.uploadCover(file);
      await cleanupIfAbandoned(formData.coverImage);
      onChange({ coverImage: url });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed — try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    await cleanupIfAbandoned(formData.coverImage);
    onChange({ coverImage: null });
  };

  const handleClose = async () => {
    await cleanupIfAbandoned(formData.coverImage);
    onClose();
  };

  return (
    <ModalShell onClose={handleClose} maxWidth={560}>
      <h2 className="font-display text-[24px] text-clay mt-1.5 mb-5">{mode === "edit" ? "Edit Book" : "Add a New Book"}</h2>
      <div className="flex flex-col gap-3.5">
        <div>
          <label className={labelClass}>Title</label>
          <input type="text" value={formData.title} onChange={(e) => onChange({ title: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Author</label>
          <input type="text" value={formData.author} onChange={(e) => onChange({ author: e.target.value })} className={inputClass} />
        </div>
        <div className="flex gap-3.5">
          <div className="flex-1">
            <label className={labelClass}>Format</label>
            <div className="flex gap-2 mt-1.5">
              <button
                onClick={() => onChange({ format: "physical" })}
                className="flex-1 py-2 rounded-xl border-[1.5px] border-bark/25 font-bold text-[15px]"
                style={{
                  background: formData.format === "physical" ? "#7d9d6e" : "#fff",
                  color: formData.format === "physical" ? "#fbf5e9" : "#5c4632",
                }}
              >
                📖 Physical
              </button>
              <button
                onClick={() => onChange({ format: "digital" })}
                className="flex-1 py-2 rounded-xl border-[1.5px] border-bark/25 font-bold text-[15px]"
                style={{
                  background: formData.format === "digital" ? "#7d9d6e" : "#fff",
                  color: formData.format === "digital" ? "#fbf5e9" : "#5c4632",
                }}
              >
                📱 Digital
              </button>
            </div>
          </div>
          <div className="flex-1">
            <label className={labelClass}>Status</label>
            <select
              value={formData.status}
              onChange={(e) => onChange({ status: e.target.value as BookFormData["status"] })}
              className="w-full py-2.5 px-3 rounded-xl border-[1.5px] border-bark/25 mt-[5px] text-[15.5px] bg-white"
            >
              <option value="tbr">To Be Read</option>
              <option value="reading">Reading</option>
              <option value="wishlist">Wishlist</option>
              <option value="finished">Finished</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3.5">
          <div className="flex-1">
            <label className={labelClass}>Language</label>
            <select
              value={formData.language}
              onChange={(e) => onChange({ language: e.target.value })}
              className="w-full py-2.5 px-3 rounded-xl border-[1.5px] border-bark/25 mt-1 text-base bg-white"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
            </select>
          </div>
          <div className="flex-1">
            <label className={labelClass}>Pages</label>
            <input type="number" min={0} value={formData.pages} onChange={(e) => onChange({ pages: e.target.value })} className={inputClass} />
          </div>
        </div>
        <div className="flex gap-3.5">
          <div className="flex-1">
            <label className={labelClass}>Series (optional)</label>
            <input
              type="text"
              placeholder="e.g. Hearthglow Trilogy"
              value={formData.series}
              onChange={(e) => onChange({ series: e.target.value })}
              className={inputClass}
            />
          </div>
          <div className="flex-none w-[110px]">
            <label className={labelClass}>Order #</label>
            <input type="number" min={1} value={formData.seriesOrder} onChange={(e) => onChange({ seriesOrder: e.target.value })} className={inputClass} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Category</label>
          <div className="flex gap-2 mt-1.5">
            {(["book", "novel", "manga"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => onChange({ category: cat })}
                className="flex-1 py-2 rounded-xl border-[1.5px] border-bark/25 font-bold text-[15px] capitalize"
                style={{
                  background: formData.category === cat ? "#7d9d6e" : "#fff",
                  color: formData.category === cat ? "#fbf5e9" : "#5c4632",
                }}
              >
                {cat === "book" ? "📘 Book" : cat === "novel" ? "📗 Novel" : "📓 Manga"}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className={labelClass}>Cover Photo</label>
          <div className="flex items-center gap-3 mt-1.5">
            <div
              className="w-16 h-24 rounded-lg overflow-hidden shrink-0 shadow-sm flex items-center justify-center text-2xl"
              style={{ background: formData.coverImage ? undefined : formData.coverBg }}
            >
              {formData.coverImage ? (
                <img
                  src={resolveMediaUrl(formData.coverImage)}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                "📕"
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="inline-block py-2 px-4 rounded-xl border-[1.5px] border-bark/25 bg-white text-sm font-bold text-bark cursor-pointer text-center">
                {uploading ? "Uploading..." : formData.coverImage ? "Change Photo" : "Upload Photo"}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
              {!!formData.coverImage && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-xs text-[#a15b3d] font-bold underline text-left"
                >
                  Remove photo
                </button>
              )}
            </div>
          </div>
          {!!uploadError && <div className="text-xs text-[#a15b3d] mt-1.5">{uploadError}</div>}
        </div>
        <div>
          <label className={labelClass}>Cover Color {!!formData.coverImage && <span className="normal-case font-normal text-driftwood">(used if you remove the photo)</span>}</label>
          <div className="flex gap-2 mt-1.5 flex-wrap">
            {COVER_PALETTE.map((c) => (
              <div
                key={c}
                onClick={() => onChange({ coverBg: c })}
                className="w-7 h-7 rounded-full cursor-pointer"
                style={{ background: c, border: `3px solid ${formData.coverBg === c ? "#4a3527" : "transparent"}` }}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <input type="checkbox" checked={formData.favorite} onChange={(e) => onChange({ favorite: e.target.checked })} className="w-[18px] h-[18px]" />
          <label className="text-[15.5px] text-bark">Mark as favorite</label>
        </div>
        <div className="flex gap-2.5 mt-2">
          <button onClick={onSave} className="py-3 px-6 rounded-[20px] border-none bg-sage text-parchment font-extrabold text-base cursor-pointer">
            Save Book
          </button>
          <button onClick={handleClose} className="py-3 px-6 rounded-[20px] border-[1.5px] border-bark/30 bg-transparent text-bark font-bold text-base cursor-pointer">
            Cancel
          </button>
        </div>
      </div>
    </ModalShell>
  );
}