import type { Request, Response } from "express";
import { z } from "zod";
import { asyncHandler, ApiError } from "../middleware/error_handler";
import { deleteUploadedFile } from "../middleware/upload";

// POST /api/uploads/cover — accepts one image file under the "cover" field
// and returns the relative URL where it's now served from.
export const uploadCover = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw new ApiError(400, "No image file was uploaded");
  const relativeUrl = `/uploads/covers/${req.file.filename}`;
  res.status(201).json({ url: relativeUrl });
});

const deleteCoverSchema = z.object({ url: z.string().min(1) });

// DELETE /api/uploads/cover  { url }
// Used to clean up an image that was uploaded (e.g. while editing a book)
// but never ended up attached to a saved book — replaced, removed, or the
// form was closed without saving.
export const deleteCover = asyncHandler(async (req: Request, res: Response) => {
  const { url } = deleteCoverSchema.parse(req.body);
  deleteUploadedFile(url);
  res.status(204).send();
});
