import ModalShell from "./ModalShell.js";

interface NewSeriesModalProps {
  name: string;
  onChange: (name: string) => void;
  onConfirm: () => void;
  onClose: () => void;
}

export default function NewSeriesModal({ name, onChange, onConfirm, onClose }: NewSeriesModalProps) {
  return (
    <ModalShell onClose={onClose} maxWidth={420}>
      <h2 className="font-display text-[24px] text-clay mt-1.5 mb-5">New Series</h2>
      <input
        type="text"
        placeholder="Series name"
        value={name}
        onChange={(e) => onChange(e.target.value)}
        className="w-full py-2.5 px-3.5 rounded-2xl border-[1.5px] border-bark/25 mb-5 text-base"
      />
      <div className="flex gap-2.5">
        <button onClick={onConfirm} className="py-3 px-6 rounded-[20px] border-none bg-sage text-parchment font-extrabold text-base cursor-pointer">
          Create Section
        </button>
        <button onClick={onClose} className="py-3 px-6 rounded-[20px] border-[1.5px] border-bark/30 bg-transparent text-bark font-bold text-base cursor-pointer">
          Cancel
        </button>
      </div>
    </ModalShell>
  );
}
