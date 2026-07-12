import type { Request, Response } from "express";
import { and, eq } from "drizzle-orm";
import { db } from "../db/connection";
import { books } from "../db/schema/books";
import { asyncHandler, ApiError } from "../middleware/error_handler";
import { deleteUploadedFile } from "../middleware/upload";
import {
  createBookSchema,
  updateBookSchema,
  updateStatusSchema,
  updateFavoriteSchema,
  updateProgressSchema,
  saveReviewSchema,
} from "../utils/book_validators";

// GET /api/books
export const listBooks = asyncHandler(async (req: Request, res: Response) => {
  const all = await db.select().from(books).where(eq(books.userId, req.userId)).orderBy(books.createdAt);
  res.json(all);
});

// GET /api/books/:id
export const getBook = asyncHandler(async (req: Request, res: Response) => {
  const [book] = await db
    .select()
    .from(books)
    .where(and(eq(books.id, req.params.id), eq(books.userId, req.userId)));
  if (!book) throw new ApiError(404, "Book not found");
  res.json(book);
});

// POST /api/books
export const createBook = asyncHandler(async (req: Request, res: Response) => {
  const data = createBookSchema.parse(req.body);
  const [created] = await db
    .insert(books)
    .values({ ...data, userId: req.userId, series: data.series ?? null, seriesOrder: data.seriesOrder ?? null })
    .returning();
  res.status(201).json(created);
});

// PUT /api/books/:id
export const updateBook = asyncHandler(async (req: Request, res: Response) => {
  const data = updateBookSchema.parse(req.body);
  const [existing] = await db
    .select()
    .from(books)
    .where(and(eq(books.id, req.params.id), eq(books.userId, req.userId)));
  if (!existing) throw new ApiError(404, "Book not found");

  const [updated] = await db
    .update(books)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(books.id, req.params.id), eq(books.userId, req.userId)))
    .returning();

  // If the cover image changed (new upload, or removed), delete the old
  // file from disk now that nothing references it anymore.
  if ("coverImage" in data && existing.coverImage && existing.coverImage !== updated.coverImage) {
    deleteUploadedFile(existing.coverImage);
  }

  res.json(updated);
});

// DELETE /api/books/:id
export const deleteBook = asyncHandler(async (req: Request, res: Response) => {
  const [deleted] = await db
    .delete(books)
    .where(and(eq(books.id, req.params.id), eq(books.userId, req.userId)))
    .returning();
  if (!deleted) throw new ApiError(404, "Book not found");
  if (deleted.coverImage) deleteUploadedFile(deleted.coverImage);
  res.status(204).send();
});

// PATCH /api/books/:id/status  { status, progressPages? }
export const updateStatus = asyncHandler(async (req: Request, res: Response) => {
  const data = updateStatusSchema.parse(req.body);
  const [updated] = await db
    .update(books)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(books.id, req.params.id), eq(books.userId, req.userId)))
    .returning();
  if (!updated) throw new ApiError(404, "Book not found");
  res.json(updated);
});

// PATCH /api/books/:id/favorite  { favorite }
export const updateFavorite = asyncHandler(async (req: Request, res: Response) => {
  const data = updateFavoriteSchema.parse(req.body);
  const [updated] = await db
    .update(books)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(books.id, req.params.id), eq(books.userId, req.userId)))
    .returning();
  if (!updated) throw new ApiError(404, "Book not found");
  res.json(updated);
});

// PATCH /api/books/:id/progress  { progressPages }
export const updateProgress = asyncHandler(async (req: Request, res: Response) => {
  const data = updateProgressSchema.parse(req.body);
  const [existing] = await db
    .select()
    .from(books)
    .where(and(eq(books.id, req.params.id), eq(books.userId, req.userId)));
  if (!existing) throw new ApiError(404, "Book not found");

  const clamped = Math.max(0, Math.min(data.progressPages, existing.pages || data.progressPages));
  const [updated] = await db
    .update(books)
    .set({ progressPages: clamped, updatedAt: new Date() })
    .where(and(eq(books.id, req.params.id), eq(books.userId, req.userId)))
    .returning();
  res.json(updated);
});

// PUT /api/books/:id/review  { rating, startedAt, finishedAt, favoriteCharacter, thoughts, favorite }
export const saveReview = asyncHandler(async (req: Request, res: Response) => {
  const data = saveReviewSchema.parse(req.body);
  const [updated] = await db
    .update(books)
    .set({
      reviewRating: data.rating,
      reviewStartedAt: data.startedAt,
      reviewFinishedAt: data.finishedAt,
      reviewFavoriteCharacter: data.favoriteCharacter,
      reviewThoughts: data.thoughts,
      favorite: data.favorite,
      updatedAt: new Date(),
    })
    .where(and(eq(books.id, req.params.id), eq(books.userId, req.userId)))
    .returning();
  if (!updated) throw new ApiError(404, "Book not found");
  res.json(updated);
});
