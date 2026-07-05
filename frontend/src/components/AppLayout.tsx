import { Outlet } from "react-router-dom";
import { AppNavBar } from "./NavBar.js";
import ModalRoot from "./modals/ModalRoot.js";
import { useLibrary } from "../context/LibraryContext.js";

export default function AppLayout() {
  const { loading, error, refresh } = useLibrary();

  return (
    <>
      <AppNavBar />
      <div className="flex-1 min-h-0 overflow-y-auto relative">
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
