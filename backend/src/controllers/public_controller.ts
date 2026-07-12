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
