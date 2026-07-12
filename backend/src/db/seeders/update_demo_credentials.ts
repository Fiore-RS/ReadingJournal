import { eq } from "drizzle-orm";
import { db, pool } from "../connection";
import { users } from "../schema/users";
import { hashPassword } from "../../utils/auth";

// Unlike seed.ts (which only ever *creates* accounts if they don't exist
// yet), this script updates the credentials of whichever account already
// has is_demo = true, to match whatever DEMO_* values are currently in your
// .env. Safe to run any time you want to rotate the demo password/username
// — it never touches the demo account's books, and never touches the owner
// account at all.

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name} in your .env file.`);
  }
  return value;
}

async function updateDemoCredentials() {
  const [demo] = await db.select().from(users).where(eq(users.isDemo, true));

  if (!demo) {
    console.error("❌ No demo account found yet — run `npm run db:seed` first to create one.");
    await pool.end();
    process.exit(1);
  }

  const username = requireEnv("DEMO_USERNAME");
  const password = requireEnv("DEMO_PASSWORD");
  const displayName = requireEnv("DEMO_DISPLAY_NAME");

  const passwordHash = await hashPassword(password);

  await db
    .update(users)
    .set({ username, passwordHash, displayName })
    .where(eq(users.id, demo.id));

  console.log(`✅ Demo account updated — username is now "${username}".`);
  console.log(`   Its sample library is untouched.`);
  await pool.end();
}

updateDemoCredentials().catch(async (err) => {
  console.error("❌ Update failed:", err);
  await pool.end();
  process.exit(1);
});
