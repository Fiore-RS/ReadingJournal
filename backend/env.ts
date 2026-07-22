import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required — copy your Neon connection string into .env"),
  CORS_ORIGIN: z
  .string()
  .default("http://localhost:5173")
  .transform((val) => val.split(",").map((origin) => origin.trim())),
  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET is required and should be at least 32 characters — generate one with `openssl rand -hex 32`"),
  JWT_EXPIRES_IN: z.string().default("30d"),

  // Cover images are stored on Cloudinary rather than local disk — Render's
  // free tier wipes local files on every restart, which was silently
  // breaking covers. Get these from your Cloudinary dashboard (Settings ->
  // API Keys) after creating a free account at cloudinary.com.
  CLOUDINARY_CLOUD_NAME: z.string().min(1, "CLOUDINARY_CLOUD_NAME is required — see your Cloudinary dashboard"),
  CLOUDINARY_API_KEY: z.string().min(1, "CLOUDINARY_API_KEY is required — see your Cloudinary dashboard"),
  CLOUDINARY_API_SECRET: z.string().min(1, "CLOUDINARY_API_SECRET is required — see your Cloudinary dashboard"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
