import { db, pool } from "../connection";
import { books } from "../schema/books";

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

const seedBooks = [
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

async function seed() {
  console.log("🌱 Seeding cozy_reading_journal database...");

  const existing = await db.select().from(books);
  if (existing.length > 0) {
    console.log(`   Skipped — ${existing.length} books already exist. Delete rows first if you want to reseed.`);
    await pool.end();
    return;
  }

  await db.insert(books).values(seedBooks);
  console.log(`✅ Inserted ${seedBooks.length} books.`);
  await pool.end();
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
