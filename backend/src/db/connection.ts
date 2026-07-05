import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "../../env";
import * as schema from "./schema/index";

// Neon requires SSL. `sslmode=require` in the connection string handles most
// setups, but we also set `rejectUnauthorized: false` here so this works
// out of the box against Neon's pooled connection string in local dev.
export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export const db = drizzle(pool, { schema });
