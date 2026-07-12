import { Outlet, useNavigate } from "react-router-dom";
import { AppNavBar } from "./NavBar.js";
import ModalRoot from "./modals/ModalRoot.js";
import { useLibrary } from "../context/LibraryContext.js";
import { useAuth } from "../context/AuthContext.js";

export default function AppLayout() {
  const { loading, error, refresh } = useLibrary();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <AppNavBar />

      <div className="flex-1 min-h-0 overflow-y-auto relative">
        {/* Account pill — positioned to land at the same height as each
            page's title (they share the same top padding), in the opposite
            corner, so it never competes with per-page layout. */}
        <div className="hidden sm:flex absolute top-6 sm:top-9 right-4 sm:right-8 lg:right-12 z-20 items-center gap-2 bg-white/80 border-[1.5px] border-bark/15 rounded-full py-1.5 pl-1.5 pr-2 shadow-[0_4px_10px_rgba(74,53,39,0.12)]">
          <div className="w-7 h-7 rounded-full bg-sage flex items-center justify-center text-parchment font-bold text-sm flex-none">
            {user?.displayName?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div className="flex flex-col leading-tight pr-1">
            <span className="text-clay text-sm font-bold whitespace-nowrap">{user?.displayName}</span>
            {user?.isDemo && <span className="text-driftwood text-[11px] -mt-0.5">Demo account</span>}
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            aria-label="Log out"
            className="w-7 h-7 rounded-full bg-bark/8 hover:bg-bark/15 flex items-center justify-center text-bark text-sm cursor-pointer flex-none transition-colors"
          >
            ⏻
          </button>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center h-full text-driftwood gap-3">
            <div className="text-5xl animate-pulse">📖</div>
            <div>Loading your library...</div>
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-3 px-6">
            <div className="text-5xl">⚠️</div>
            <div className="text-clay font-bold">Couldn't reach the library.</div>
            <div className="text-sand text-base max-w-md">{error}</div>
            <button
              onClick={refresh}
              className="mt-2 py-2.5 px-5 rounded-2xl border-none bg-sage text-parchment font-bold text-base cursor-pointer"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && <Outlet />}

        <ModalRoot />
      </div>
    </>
  );
}
