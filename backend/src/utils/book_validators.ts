import { z } from "zod";

export const bookFormatSchema = z.enum(["physical", "digital"]);
export const bookStatusSchema = z.enum(["tbr", "reading", "wishlist", "finished"]);

export const createBookSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  author: z.string().trim().min(1, "Author is required"),
  format: bookFormatSchema.default("physical"),
  language: z.string().trim().min(1).default("English"),
  pages: z.coerce.number().int().min(0).default(0),
  status: bookStatusSchema.default("tbr"),
  series: z.string().trim().min(1).nullable().optional(),
  seriesOrder: z.coerce.number().int().min(1).nullable().optional(),
  favorite: z.boolean().default(false),
  coverBg: z.string().trim().min(1).default("#a9c19a"),
});

export const updateBookSchema = createBookSchema.partial();

export const updateStatusSchema = z.object({
  status: bookStatusSchema,
  progressPages: z.coerce.number().int().min(0).optional(),
});

export const updateFavoriteSchema = z.object({
  favorite: z.boolean(),
});

export const updateProgressSchema = z.object({
  progressPages: z.coerce.number().int().min(0),
});

export const saveReviewSchema = z.object({
  rating: z.coerce.number().int().min(0).max(5).default(0),
  startedAt: z.string().trim().optional().default(""),
  finishedAt: z.string().trim().optional().default(""),
  favoriteCharacter: z.string().trim().optional().default(""),
  thoughts: z.string().trim().optional().default(""),
  favorite: z.boolean().default(false),
});

export const createSeriesSchema = z.object({
  name: z.string().trim().min(1, "Series name is required"),
});
