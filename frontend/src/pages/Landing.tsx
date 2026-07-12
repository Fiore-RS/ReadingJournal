import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.js";

// Fixed slots for the decorative floating covers around the hero stack.
// top/left/right are percentages of the scene; size is the cover width in px.
const FLOAT_SLOTS = [
  { top: "0%", left: "2%", rotate: -9, size: 92, bg: "#c98a6b", emoji: "📗" },
  { top: "38%", left: "-4%", rotate: 6, size: 106, bg: "#8fae7d", emoji: "📘" },
  { top: "76%", left: "6%", rotate: -5, size: 84, bg: "#e3b8c4", emoji: "📓" },
  { top: "0%", right: "2%", rotate: 8, size: 96, bg: "#d9a05b", emoji: "📙" },
  { top: "40%", right: "-4%", rotate: -7, size: 108, bg: "#9fb8a3", emoji: "📕" },
  { top: "78%", right: "8%", rotate: 5, size: 86, bg: "#cf9a7a", emoji: "📗" },
] as const;

function FloatingCover({ slot, delay }: { slot: (typeof FLOAT_SLOTS)[number]; delay: number }) {
  return (
    <div
      className="hidden sm:flex absolute rounded-lg overflow-hidden shadow-[0_10px_20px_rgba(74,53,39,0.22)] opacity-90 animate-floaty items-center justify-center text-2xl"
      style={{
        top: slot.top,
        left: "left" in slot ? slot.left : undefined,
        right: "right" in slot ? slot.right : undefined,
        width: slot.size,
        height: slot.size * 1.5,
        transform: `rotate(${slot.rotate}deg)`,
        animationDelay: `${delay}s`,
        background: slot.bg,
      }}
    >
      {slot.emoji}
    </div>
  );
}

export default function Landing() {
  const { user, checkingSession } = useAuth();

  // Already signed in on this device — skip the marketing page entirely.
  if (!checkingSession && user) {
    return <Navigate to="/library" replace />;
  }

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
          <p className="font-body text-sand text-[15px] mt-3 max-w-[360px] mx-auto">
            Track what you're reading, rate what you've finished, and keep your whole library in one cozy place.
          </p>
        </div>

        {/* Escena central: pila de libros decorativa (sin datos reales — eso vive detrás del login) */}
        <div className="relative w-full max-w-[640px] h-auto sm:h-[300px] md:h-[340px] flex items-center justify-center py-2 sm:py-0">

          {FLOAT_SLOTS.map((slot, i) => (
            <FloatingCover key={i} slot={slot} delay={i * 0.35} />
          ))}

          <div className="relative z-10 flex flex-col items-center">
            <div
              className="relative w-[170px] md:w-[200px] aspect-[2/3] rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(74,53,39,0.28)] border-4 border-parchment flex items-center justify-center text-6xl"
              style={{ background: "#a9c19a" }}
            >
              📖
            </div>
            <p className="font-display font-bold text-clay text-lg mt-3 text-center max-w-[220px]">
              Your shelf is waiting
            </p>
          </div>
        </div>

        {/* CTA */}
        <Link
          to="/login"
          className="mt-12 sm:mt-14 inline-block py-[15px] px-[34px] rounded-[26px] bg-sage text-parchment font-extrabold text-xl shadow-[0_8px_18px_rgba(125,157,110,0.35)] transition-transform hover:-translate-y-0.5 relative z-30"
        >
          Open my library →
        </Link>
      </div>
    </div>
  );
}
