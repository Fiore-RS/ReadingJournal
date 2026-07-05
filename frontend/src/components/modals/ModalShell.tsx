import type { ReactNode } from "react";

interface ModalShellProps {
  onClose: () => void;
  maxWidth?: number;
  children: ReactNode;
}

export default function ModalShell({ onClose, maxWidth = 420, children }: ModalShellProps) {
  return (
    <div
      onClick={onClose}
      className="absolute inset-0 bg-clay/40 flex items-center justify-center z-[100] animate-fadein p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-parchment rounded-3xl p-8 w-full max-h-[88vh] overflow-y-auto shadow-[0_20px_50px_rgba(0,0,0,0.3)] animate-popin"
        style={{ maxWidth }}
      >
        <div className="absolute -top-2.5 left-9 w-[50px] h-5 bg-blush/85 -rotate-6" />
        {children}
      </div>
    </div>
  );
}
