import type { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db/connection";
import { series } from "../db/schema/series";
import { asyncHandler, ApiError } from "../middleware/error_handler";
import { createSeriesSchema } from "../utils/book_validators";

// GET /api/series — extra series names created before any book joins them
export const listSeries = asyncHandler(async (req: Request, res: Response) => {
  const all = await db.select().from(series).where(eq(series.userId, req.userId)).orderBy(series.name);
  res.json(all);
});

// POST /api/series  { name }
export const createSeries = asyncHandler(async (req: Request, res: Response) => {
  const data = createSeriesSchema.parse(req.body);
  try {
    const [created] = await db.insert(series).values({ ...data, userId: req.userId }).returning();
    res.status(201).json(created);
  } catch (err: any) {
    if (err?.code === "23505") throw new ApiError(409, "A series with this name already exists");
    throw err;
  }
});
