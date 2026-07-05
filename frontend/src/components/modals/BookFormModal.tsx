import type { BookFormData } from "../../types/book.js";
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
  return (
    <ModalShell onClose={onClose} maxWidth={560}>
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
              <option value="reading">Currently Reading</option>
              <option value="wishlist">Wishlist</option>
              <option value="finished">Finished</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3.5">
          <div className="flex-1">
            <label className={labelClass}>Language</label>
            <input type="text" value={formData.language} onChange={(e) => onChange({ language: e.target.value })} className={inputClass} />
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
          <label className={labelClass}>Cover Color</label>
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
          <button onClick={onClose} className="py-3 px-6 rounded-[20px] border-[1.5px] border-bark/30 bg-transparent text-bark font-bold text-base cursor-pointer">
            Cancel
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
