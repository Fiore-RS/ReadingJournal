import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";

// Holds series names created via "+ New Series" before any book has been
// assigned to them yet. Once a book references the name in `books.series`,
// it shows up in the Series page either way — this table just keeps empty
// sections from disappearing.
export const series = pgTable("series", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type SeriesRow = typeof series.$inferSelect;
export type NewSeriesRow = typeof series.$inferInsert;
