import { Link, useLocation } from "react-router-dom";

export const NAV_ITEMS = [
  { path: "/library", label: "Library", icon: "📚" },
  { path: "/reading", label: "Currently Reading", icon: "🔖" },
  { path: "/tbr", label: "To Be Read", icon: "📖" },
  { path: "/wishlist", label: "Wishlist", icon: "✨" },
  { path: "/finished", label: "Finished", icon: "🍃" },
  { path: "/favorites", label: "Top Favorites", icon: "💚" },
  { path: "/series", label: "Series", icon: "🩷" },
];

export function LandingNav() {
  return (
    <div className="flex items-center justify-center gap-2.5 flex-wrap pt-6 px-5 pb-2">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className="py-2 px-[18px] rounded-full border-[1.5px] border-latte/25 bg-parchment/70 text-bark font-bold text-[19px] hover:bg-sage/20 transition-colors"
        >
          {item.icon} {item.label}
        </Link>
      ))}
    </div>
  );
}

export function AppNavBar() {
  const location = useLocation();

  return (
    <div className="flex-none flex items-center gap-2 py-3.5 px-7 bg-gradient-to-b from-latte to-espresso shadow-[0_4px_12px_rgba(0,0,0,0.18)] overflow-x-auto z-30">
      <Link to="/" className="flex items-center gap-2 py-1.5 pl-1 pr-3.5 flex-none">
        <span className="text-[24px]">📕</span>
        <span className="font-display font-semibold text-[28px] text-parchment">Cozy Journal</span>
      </Link>
      <div className="w-px h-6 bg-parchment/20 flex-none mr-1" />
      {NAV_ITEMS.map((item) => {
        const active = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className="flex-none py-2 px-4 rounded-[18px] font-bold text-[19px] whitespace-nowrap transition-colors"
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
  );
}
