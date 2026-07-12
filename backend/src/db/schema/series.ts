import { pgTable, text, uuid, timestamp, unique } from "drizzle-orm/pg-core";
import { users } from "./users";

// Holds series names created via "+ New Series" before any book has been
// assigned to them yet. Once a book references the name in `books.series`,
// it shows up in the Series page either way — this table just keeps empty
// sections from disappearing.
export const series = pgTable("series", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  // Series names only need to be unique within one user's library, not
  // globally — two different readers can both have a "Hearthglow Trilogy".
  uniqueNamePerUser: unique("series_user_id_name_unique").on(table.userId, table.name),
}));

export type SeriesRow = typeof series.$inferSelect;
export type NewSeriesRow = typeof series.$inferInsert;
