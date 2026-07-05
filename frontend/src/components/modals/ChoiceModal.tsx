import ModalShell from "./ModalShell.js";

interface ChoiceModalProps {
  title: string;
  onNew: () => void;
  onExisting: () => void;
  onClose: () => void;
}

export default function ChoiceModal({ title, onNew, onExisting, onClose }: ChoiceModalProps) {
  return (
    <ModalShell onClose={onClose} maxWidth={420}>
      <h2 className="font-display text-[24px] text-clay mt-1.5 mb-5">{title}</h2>
      <div className="flex flex-col gap-3">
        <button
          onClick={onNew}
          className="p-4 rounded-2xl border-[1.5px] border-bark/25 bg-white text-left cursor-pointer text-[16.5px] text-clay font-bold"
        >
          ➕ Add a New Book
        </button>
        <button
          onClick={onExisting}
          className="p-4 rounded-2xl border-[1.5px] border-bark/25 bg-white text-left cursor-pointer text-[16.5px] text-clay font-bold"
        >
          🔍 Pick an Existing Book
        </button>
      </div>
    </ModalShell>
  );
}
