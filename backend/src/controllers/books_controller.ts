import type { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db/connection";
import { books } from "../db/schema/books";
import { asyncHandler, ApiError } from "../middleware/error_handler";
import {
  createBookSchema,
  updateBookSchema,
  updateStatusSchema,
  updateFavoriteSchema,
  updateProgressSchema,
  saveReviewSchema,
} from "../utils/book_validators";

// GET /api/books
export const listBooks = asyncHandler(async (_req: Request, res: Response) => {
  const all = await db.select().from(books).orderBy(books.createdAt);
  res.json(all);
});

// GET /api/books/:id
export const getBook = asyncHandler(async (req: Request, res: Response) => {
  const [book] = await db.select().from(books).where(eq(books.id, req.params.id));
  if (!book) throw new ApiError(404, "Book not found");
  res.json(book);
});

// POST /api/books
export const createBook = asyncHandler(async (req: Request, res: Response) => {
  const data = createBookSchema.parse(req.body);
  const [created] = await db
    .insert(books)
    .values({ ...data, series: data.series ?? null, seriesOrder: data.seriesOrder ?? null })
    .returning();
  res.status(201).json(created);
});

// PUT /api/books/:id
export const updateBook = asyncHandler(async (req: Request, res: Response) => {
  const data = updateBookSchema.parse(req.body);
  const [updated] = await db
    .update(books)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(books.id, req.params.id))
    .returning();
  if (!updated) throw new ApiError(404, "Book not found");
  res.json(updated);
});

// DELETE /api/books/:id
export const deleteBook = asyncHandler(async (req: Request, res: Response) => {
  const [deleted] = await db.delete(books).where(eq(books.id, req.params.id)).returning();
  if (!deleted) throw new ApiError(404, "Book not found");
  res.status(204).send();
});

// PATCH /api/books/:id/status  { status, progressPages? }
export const updateStatus = asyncHandler(async (req: Request, res: Response) => {
  const data = updateStatusSchema.parse(req.body);
  const [updated] = await db
    .update(books)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(books.id, req.params.id))
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
    .where(eq(books.id, req.params.id))
    .returning();
  if (!updated) throw new ApiError(404, "Book not found");
  res.json(updated);
});

// PATCH /api/books/:id/progress  { progressPages }
export const updateProgress = asyncHandler(async (req: Request, res: Response) => {
  const data = updateProgressSchema.parse(req.body);
  const [existing] = await db.select().from(books).where(eq(books.id, req.params.id));
  if (!existing) throw new ApiError(404, "Book not found");

  const clamped = Math.max(0, Math.min(data.progressPages, existing.pages || data.progressPages));
  const [updated] = await db
    .update(books)
    .set({ progressPages: clamped, updatedAt: new Date() })
    .where(eq(books.id, req.params.id))
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
    .where(eq(books.id, req.params.id))
    .returning();
  if (!updated) throw new ApiError(404, "Book not found");
  res.json(updated);
});
