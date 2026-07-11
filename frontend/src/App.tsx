import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LibraryProvider } from "./context/LibraryContext.js";
import AppLayout from "./components/AppLayout.js";
import Landing from "./pages/Landing.js";
import ShelfPage from "./pages/ShelfPage.js";
import Series from "./pages/Series.js";
import Reading from "./pages/Reading.js";
import Reviews from "./pages/Reviews.js";
import Stats from "./pages/Stats.js";

export default function App() {
  return (
    <LibraryProvider>
      <BrowserRouter>
        <div className="w-full h-screen overflow-hidden bg-cream font-body flex flex-col relative">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route element={<AppLayout />}>
              <Route
                path="/library"
                element={<ShelfPage variant="library" />}
              />
              <Route path="/tbr" element={<ShelfPage variant="tbr" />} />
              <Route
                path="/wishlist"
                element={<ShelfPage variant="wishlist" />}
              />
              <Route
                path="/finished"
                element={<ShelfPage variant="finished" />}
              />
              <Route
                path="/favorites"
                element={<ShelfPage variant="favorites" />}
              />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/series" element={<Series />} />
              <Route path="/reading" element={<Reading />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </LibraryProvider>
  );
}
