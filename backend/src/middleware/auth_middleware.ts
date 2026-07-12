import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/auth";
import { ApiError } from "./error_handler";

// Augment Express's Request type so `req.userId` is recognized everywhere
// without needing a cast at every call site.
declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

// Reads "Authorization: Bearer <token>", verifies it, and attaches the
// decoded user id to the request. Every books/series/uploads route sits
// behind this — there is no "browse without an account" mode.
export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    next(new ApiError(401, "Missing or invalid authorization header"));
    return;
  }

  try {
    const payload = verifyToken(token);
    req.userId = payload.userId;
    next();
  } catch {
    next(new ApiError(401, "Invalid or expired session — please log in again"));
  }
}
