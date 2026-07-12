import type { ReactNode } from "react";

interface ModalShellProps {
  onClose: () => void;
  maxWidth?: number;
  bgClassName?: string;
  showCloseButton?: boolean;
  children: ReactNode;
}

export default function ModalShell({ onClose, maxWidth = 420, bgClassName = "bg-parchment", showCloseButton = false, children }: ModalShellProps) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-clay/40 flex items-center justify-center z-[100] animate-fadein p-3 sm:p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative ${bgClassName} rounded-3xl p-5 sm:p-8 w-full max-h-[88vh] overflow-y-auto shadow-[0_20px_50px_rgba(0,0,0,0.3)] animate-popin`}
        style={{ maxWidth }}
      >
        <div className="absolute -top-2.5 left-9 w-[50px] h-5 bg-blush/85 -rotate-6" />
        {showCloseButton && (
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-bark/10 hover:bg-bark/20 flex items-center justify-center text-clay text-lg font-bold cursor-pointer transition-colors z-10"
          >
            ✕
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
