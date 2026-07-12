import type { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db/connection";
import { users } from "../db/schema/users";
import { asyncHandler, ApiError } from "../middleware/error_handler";
import { verifyPassword, signToken } from "../utils/auth";

const loginSchema = z.object({
  username: z.string().trim().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

function toPublicUser(user: typeof users.$inferSelect) {
  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    isDemo: user.isDemo,
  };
}

// POST /api/auth/login  { username, password }
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = loginSchema.parse(req.body);

  const [user] = await db.select().from(users).where(eq(users.username, username));
  // Same error for "no such user" and "wrong password" — don't reveal
  // which one it was.
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    throw new ApiError(401, "Incorrect username or password");
  }

  const token = signToken({ userId: user.id });
  res.json({ token, user: toPublicUser(user) });
});

// GET /api/auth/me — lets the frontend validate a stored token on load and
// refresh the user info shown in the UI.
export const me = asyncHandler(async (req: Request, res: Response) => {
  const [user] = await db.select().from(users).where(eq(users.id, req.userId));
  if (!user) throw new ApiError(404, "User not found");
  res.json(toPublicUser(user));
});
