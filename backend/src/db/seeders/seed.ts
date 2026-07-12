import { eq, sql } from "drizzle-orm";
import { db, pool } from "../connection";
import { users } from "../schema/users";
import { books } from "../schema/books";
import { hashPassword } from "../../utils/auth";

// ---------------------------------------------------------------------------
// This script is safe to run more than once (on a brand-new database or on
// an existing one with real data already in it). Each step only does
// something if it hasn't already been done:
//
//   1. Create the `users` table and the `user_id` columns on `books` /
//      `series`, if they don't exist yet (raw SQL — see note below).
//   2. Create the owner account and the public demo account, if they don't
//      already exist (from OWNER_* / DEMO_* env vars).
//   3. Assign any pre-existing books/series that don't belong to a user yet
//      (i.e. rows created before this migration) to the OWNER account.
//   4. Make `user_id` required now that every row has one.
//   5. Give the demo account its sample library, if it doesn't have books
//      of its own yet.
//
// We use raw SQL for steps 1 and 4 instead of `drizzle-kit push` because
// push can't safely sequence "add a NOT NULL foreign key to a table that
// already has rows" — it needs the users to exist and the backfill to run
// first. This script does that in the right order automatically.
// ---------------------------------------------------------------------------

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing ${name} in your .env file. Set OWNER_USERNAME, OWNER_PASSWORD, OWNER_DISPLAY_NAME, ` +
        `DEMO_USERNAME, DEMO_PASSWORD, and DEMO_DISPLAY_NAME before running this script.`
    );
  }
  return value;
}

const COVER_PALETTE = [
  "#c98a6b", "#8fae7d", "#b98a5e", "#e3b8c4", "#9fb8a3",
  "#d9a05b", "#7d9d8f", "#cf9a7a", "#a97c50", "#88a878",
];

function mk(o: Partial<typeof books.$inferInsert>, i: number) {
  return {
    format: "physical" as const,
    language: "English",
    favorite: false,
    series: null,
    seriesOrder: null,
    progressPages: 0,
    coverBg: COVER_PALETTE[i % COVER_PALETTE.length],
    ...o,
  };
}

// This is the original seed library — now used for the public DEMO account
// instead of a fresh install, so visitors have something to explore.
const demoBooks = [
  mk({ title: "The Quiet Orchard", author: "Wren Halloway", format: "physical", pages: 312, status: "reading", progressPages: 140 }, 0),
  mk({ title: "The Weaver's Code", author: "Selin Marsh", format: "digital", pages: 344, status: "reading", progressPages: 90, series: "Marsh & Willow Mysteries", seriesOrder: 2 }, 1),
  mk({ title: "Hearthglow", author: "Junia Prescott", pages: 288, status: "finished", favorite: true, series: "The Hearthglow Trilogy", seriesOrder: 1,
    reviewRating: 5, reviewStartedAt: "2026-05-01", reviewFinishedAt: "2026-05-14", reviewFavoriteCharacter: "Marigold Finch",
    reviewThoughts: "Warm, slow, and utterly comforting — like tea by the fire." }, 2),
  mk({ title: "Emberfall", author: "Junia Prescott", pages: 301, status: "finished", series: "The Hearthglow Trilogy", seriesOrder: 2 }, 3),
  mk({ title: "Winter's Ledger", author: "Junia Prescott", format: "digital", pages: 276, status: "tbr", series: "The Hearthglow Trilogy", seriesOrder: 3 }, 4),
  mk({ title: "The Cartographer's Daughter", author: "Selin Marsh", pages: 402, status: "finished", series: "Marsh & Willow Mysteries", seriesOrder: 1 }, 5),
  mk({ title: "Salt and Cinder", author: "Selin Marsh", pages: 260, status: "wishlist", series: "Marsh & Willow Mysteries", seriesOrder: 3 }, 6),
  mk({ title: "Letters from the Hollow", author: "Wren Halloway", format: "digital", pages: 288, status: "tbr" }, 7),
  mk({ title: "Moth & Marigold", author: "Junia Prescott", pages: 256, status: "finished", favorite: true }, 8),
  mk({ title: "Whistling Season", author: "Elowen Pryce", format: "digital", language: "Spanish", pages: 210, status: "wishlist" }, 9),
  mk({ title: "A Recipe for Rain", author: "Odette Vance", pages: 198, status: "finished" }, 10),
  mk({ title: "The Paper Lighthouse", author: "Odette Vance", language: "French", pages: 322, status: "tbr" }, 11),
  mk({ title: "Six Ways to Sunday", author: "Callum Reyes", format: "digital", pages: 288, status: "wishlist" }, 12),
  mk({ title: "The Bee Keeper's Almanac", author: "Marisol Fenn", pages: 240, status: "finished", favorite: true }, 13),
  mk({ title: "Nettle & Stone", author: "Marisol Fenn", pages: 356, status: "tbr" }, 14),
  mk({ title: "The Long Way to Amberlea", author: "Callum Reyes", format: "digital", pages: 410, status: "wishlist" }, 15),
  mk({ title: "Sparrow's Rest", author: "Elowen Pryce", pages: 224, status: "finished" }, 16),
];

async function ensureSchema() {
  console.log("🔧 Making sure the users table and user_id columns exist...");

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      username text NOT NULL UNIQUE,
      password_hash text NOT NULL,
      display_name text NOT NULL,
      is_demo boolean NOT NULL DEFAULT false,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `);

  await pool.query(`ALTER TABLE books ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES users(id) ON DELETE CASCADE;`);
  await pool.query(`ALTER TABLE series ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES users(id) ON DELETE CASCADE;`);
}

async function ensureUser(username: string, password: string, displayName: string, isDemo: boolean) {
  const [existing] = await db.select().from(users).where(eq(users.username, username));
  if (existing) return existing;

  const passwordHash = await hashPassword(password);
  const [created] = await db.insert(users).values({ username, passwordHash, displayName, isDemo }).returning();
  console.log(`   Created ${isDemo ? "demo" : "owner"} account: ${username}`);
  return created;
}

async function backfillOwnership(ownerId: string) {
  const orphanBooks = await pool.query(`UPDATE books SET user_id = $1 WHERE user_id IS NULL RETURNING id`, [ownerId]);
  const orphanSeries = await pool.query(`UPDATE series SET user_id = $1 WHERE user_id IS NULL RETURNING id`, [ownerId]);
  if (orphanBooks.rowCount || orphanSeries.rowCount) {
    console.log(`   Assigned ${orphanBooks.rowCount} existing book(s) and ${orphanSeries.rowCount} existing series to the owner account.`);
  }
}

async function lockDownSchema() {
  // Safe to run every time — these are all no-ops once already applied.
  await pool.query(`ALTER TABLE books ALTER COLUMN user_id SET NOT NULL;`);
  await pool.query(`ALTER TABLE series ALTER COLUMN user_id SET NOT NULL;`);

  // Series names used to be globally unique; now they only need to be
  // unique per user. Drop the old constraint (name may vary by Postgres
  // version, so we try the common variants) and add the new composite one.
  await pool.query(`ALTER TABLE series DROP CONSTRAINT IF EXISTS series_name_key;`);
  await pool.query(`ALTER TABLE series DROP CONSTRAINT IF EXISTS series_name_unique;`);
  await pool.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'series_user_id_name_unique'
      ) THEN
        ALTER TABLE series ADD CONSTRAINT series_user_id_name_unique UNIQUE (user_id, name);
      END IF;
    END $$;
  `);
}

async function seedDemoLibrary(demoId: string) {
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(books)
    .where(eq(books.userId, demoId));

  if (count > 0) {
    console.log(`   Skipped demo library — demo account already has ${count} book(s).`);
    return;
  }

  await db.insert(books).values(demoBooks.map((b) => ({ ...b, userId: demoId })));
  console.log(`   Gave the demo account ${demoBooks.length} sample books.`);
}

async function seed() {
  console.log("🌱 Setting up accounts for the Cozy Reading Journal...");

  await ensureSchema();

  const owner = await ensureUser(
    requireEnv("OWNER_USERNAME"),
    requireEnv("OWNER_PASSWORD"),
    requireEnv("OWNER_DISPLAY_NAME"),
    false
  );
  const demo = await ensureUser(
    requireEnv("DEMO_USERNAME"),
    requireEnv("DEMO_PASSWORD"),
    requireEnv("DEMO_DISPLAY_NAME"),
    true
  );

  await backfillOwnership(owner.id);
  await lockDownSchema();
  await seedDemoLibrary(demo.id);

  console.log("✅ Done.");
  await pool.end();
}

seed().catch(async (err) => {
  console.error("❌ Setup failed:", err);
  await pool.end();
  process.exit(1);
});
