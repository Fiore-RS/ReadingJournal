import type { Request, Response, NextFunction, RequestHandler } from "express";
import { ZodError } from "zod";
import multer from "multer";

// Wraps async route handlers so thrown errors reach the error middleware
// instead of crashing the process.
export function asyncHandler(fn: RequestHandler): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    res.status(400).json({ error: "Validation failed", details: err.flatten().fieldErrors });
    return;
  }
  if (err instanceof ApiError) {
    res.status(err.status).json({ error: err.message });
    return;
  }
  if (err instanceof multer.MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE" ? "Image is too large — max size is 5MB" : err.message;
    res.status(400).json({ error: message });
    return;
  }
  // multer's fileFilter rejects bad file types via a plain Error
  if (err instanceof Error && /images are allowed/i.test(err.message)) {
    res.status(400).json({ error: err.message });
    return;
  }
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
}
