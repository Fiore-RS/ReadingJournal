import type { Request, Response } from "express";
import { and, eq } from "drizzle-orm";
import { db } from "../db/connection";
import { users } from "../db/schema/users";
import { books } from "../db/schema/books";
import { asyncHandler } from "../middleware/error_handler";

// A deliberately small slice of a book — just enough for the landing page's
// decorative hero. No progress, reviews, dates, or anything else personal.
const previewColumns = {
  id: books.id,
  title: books.title,
  author: books.author,
  format: books.format,
  coverBg: books.coverBg,
  coverImage: books.coverImage,
};

// GET /api/public/preview — unauthenticated. Shows a taste of the owner's
// library (currently-reading + a few finished covers) so the landing page
// isn't just an empty shell, without exposing anything editable or private.
// This is read-only and scoped to the owner account specifically — never
// the demo account, and never anything that requires a login to fetch.
export const getPreview = asyncHandler(async (_req: Request, res: Response) => {
  const [owner] = await db.select({ id: users.id }).from(users).where(eq(users.isDemo, false)).limit(1);

  if (!owner) {
    res.json({ reading: [], finished: [] });
    return;
  }

  const [reading, finished] = await Promise.all([
    db
      .select(previewColumns)
      .from(books)
      .where(and(eq(books.userId, owner.id), eq(books.status, "reading")))
      .orderBy(books.createdAt),
    db
      .select(previewColumns)
      .from(books)
      .where(and(eq(books.userId, owner.id), eq(books.status, "finished")))
      .orderBy(books.createdAt),
  ]);

  res.json({ reading, finished });
});

// A slightly richer slice than the landing preview — enough for a friend
// browsing the gift list to know what to look for (title, author, series,
// format), but still nothing editable or private (no progress/review data).
const wishlistColumns = {
  id: books.id,
  title: books.title,
  author: books.author,
  format: books.format,
  category: books.category,
  series: books.series,
  seriesOrder: books.seriesOrder,
  pages: books.pages,
  coverBg: books.coverBg,
  coverImage: books.coverImage,
};

// GET /api/public/wishlist — unauthenticated. Read-only list of the owner's
// wishlist books, meant to be shared with friends/family as a gift list.
// Same "owner account, never demo" scoping as the preview endpoint above.
export const getPublicWishlist = asyncHandler(async (_req: Request, res: Response) => {
  const [owner] = await db.select({ id: users.id }).from(users).where(eq(users.isDemo, false)).limit(1);

  if (!owner) {
    res.json([]);
    return;
  }

  const wishlist = await db
    .select(wishlistColumns)
    .from(books)
    .where(and(eq(books.userId, owner.id), eq(books.status, "wishlist")))
    .orderBy(books.createdAt);

  res.json(wishlist);
});
