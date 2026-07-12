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
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
