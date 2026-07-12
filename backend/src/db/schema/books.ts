import { pgTable, text, integer, boolean, uuid, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { users } from "./users";

export const bookFormatEnum = pgEnum("book_format", ["physical", "digital"]);
export const bookStatusEnum = pgEnum("book_status", ["tbr", "reading", "wishlist", "finished"]);
export const bookCategoryEnum = pgEnum("book_category", ["book", "novel", "manga"]);

export const books = pgTable("books", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Every book belongs to exactly one user's library. Deleting a user
  // cascades to their books — no orphaned rows left behind.
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),

  title: text("title").notNull(),
  author: text("author").notNull(),
  format: bookFormatEnum("format").notNull().default("physical"),
  language: text("language").notNull().default("English"),
  pages: integer("pages").notNull().default(0),
  status: bookStatusEnum("status").notNull().default("tbr"),
  category: bookCategoryEnum("category").notNull().default("book"),

  series: text("series"),
  seriesOrder: integer("series_order"),

  favorite: boolean("favorite").notNull().default(false),
  progressPages: integer("progress_pages").notNull().default(0),
  coverBg: text("cover_bg").notNull().default("#a9c19a"),
  coverImage: text("cover_image"),

  // Review fields (null until the reader writes a review)
  reviewRating: integer("review_rating"),
  reviewStartedAt: text("review_started_at"),
  reviewFinishedAt: text("review_finished_at"),
  reviewFavoriteCharacter: text("review_favorite_character"),
  reviewThoughts: text("review_thoughts"),

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type BookRow = typeof books.$inferSelect;
export type NewBookRow = typeof books.$inferInsert;
