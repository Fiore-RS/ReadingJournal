import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { publicService, type PublicWishlistBook } from "../services/publicService.js";
import BookCard from "../components/BookCard.js";

// Public, unauthenticated page meant to be shared with friends/family so
// they know what to gift. Read-only — no login, no edit actions, just the
// owner's wishlist books rendered with the same cards used in the app.
export default function GiftList() {
  const [books, setBooks] = useState<PublicWishlistBook[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    publicService
      .wishlist()
      .then(setBooks)
      .catch(() => setError(true));
  }, []);

  return (
    <div className="w-full min-h-dvh overflow-y-auto bg-cream font-body flex flex-col items-center px-5 py-10 sm:py-14">
      <div className="w-full max-w-3xl">
        <Link to="/" className="font-body text-sm text-sand hover:text-bark transition-colors">
          ← Back home
        </Link>

        <h1 className="font-display font-bold text-3xl sm:text-4xl text-bark mt-4">
          🎁 My Gift List
        </h1>
        <p className="font-body text-[15px] text-sand mt-2 max-w-xl">
          Books I'd love to add to my shelf — if you're ever looking for something to give me, any of these would make me very happy.
        </p>

        <div className="mt-8">
          {error && (
            <p className="font-body text-sand">Couldn't load the gift list right now — try again in a bit.</p>
          )}

          {!error && books === null && (
            <p className="font-body text-sand">Loading…</p>
          )}

          {!error && books !== null && books.length === 0 && (
            <p className="font-body text-sand">Nothing on the wishlist yet — check back later!</p>
          )}

          {!error && books !== null && books.length > 0 && (
            <div className="flex flex-wrap gap-5 sm:gap-6">
              {books.map((book) => (
                <BookCard key={book.id} book={book} size="normal" metaMode="series" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
