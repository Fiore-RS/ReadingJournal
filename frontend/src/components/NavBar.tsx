import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export const NAV_ITEMS = [
  { path: "/library", label: "Library", icon: "📚" },
  { path: "/reading", label: "Reading", icon: "🔖" },
  { path: "/finished", label: "Finished", icon: "🍃" },
  { path: "/tbr", label: "To Be Read", icon: "📖" },
  { path: "/wishlist", label: "Wishlist", icon: "✨" },
  { path: "/favorites", label: "Top Favorites", icon: "💚" },
  { path: "/reviews", label: "Reviews", icon: "📝" },
  { path: "/series", label: "Series", icon: "🩷" },
  { path: "/stats", label: "Stats", icon: "📊" },
];

export function LandingNav() {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-2.5 flex-wrap pt-4 sm:pt-6 px-3 sm:px-5 pb-2">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className="py-1.5 px-3 sm:py-2 sm:px-[18px] rounded-full border-[1.5px] border-latte/25 bg-parchment/70 text-bark font-bold text-sm sm:text-lg lg:text-[19px] hover:bg-sage/20 transition-colors"
        >
          {item.icon} {item.label}
        </Link>
      ))}
    </div>
  );
}

export function AppNavBar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu automatically whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Compact bar with hamburger toggle — mobile only */}
      <div className="flex sm:hidden flex-none items-center justify-between py-2.5 px-4 bg-gradient-to-b from-latte to-espresso shadow-[0_4px_12px_rgba(0,0,0,0.18)] relative z-30">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl">📕</span>
          <span className="font-display font-bold text-parchment text-[15px]">Reading Journal</span>
        </Link>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="w-10 h-10 rounded-full bg-parchment/12 flex items-center justify-center text-parchment text-xl cursor-pointer"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Slide-down menu panel — mobile only */}
      {menuOpen && (
        <div className="sm:hidden fixed inset-0 z-40" onClick={() => setMenuOpen(false)}>
          <div className="absolute inset-0 bg-clay/40 animate-fadein" />
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute top-0 left-0 right-0 bg-espresso rounded-b-[28px] shadow-[0_12px_30px_rgba(0,0,0,0.3)] pt-[62px] pb-4 px-4 flex flex-col gap-1.5 max-h-[85vh] overflow-y-auto motion-safe:animate-popin"
          >
            {NAV_ITEMS.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="py-3 px-4 rounded-2xl font-bold text-base flex items-center gap-3 transition-colors"
                  style={{
                    background: active ? "#fbf5e9" : "rgba(251,245,233,0.08)",
                    color: active ? "#4a3527" : "#e9dcc4",
                  }}
                >
                  <span className="text-lg">{item.icon}</span> {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Horizontal scrollable bar — tablet and up */}
      <div className="hidden sm:flex flex-none items-center gap-2 py-3.5 px-7 bg-gradient-to-b from-latte to-espresso shadow-[0_4px_12px_rgba(0,0,0,0.18)] overflow-x-auto z-30">
        <Link to="/" className="flex items-center gap-2 py-1.5 pl-1 pr-3.5 flex-none">
          <span className="text-[24px]">📕</span>
        </Link>
        <div className="w-px h-6 bg-parchment/20 flex-none mr-1" />
        {NAV_ITEMS.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex-none py-2 px-4 rounded-[18px] font-bold text-lg lg:text-[19px] whitespace-nowrap transition-colors"
              style={{
                background: active ? "#fbf5e9" : "rgba(251,245,233,0.12)",
                color: active ? "#4a3527" : "#e9dcc4",
              }}
            >
              {item.icon} {item.label}
            </Link>
          );
        })}
      </div>
    </>
  );
}