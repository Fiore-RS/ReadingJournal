export type BookFormat = "physical" | "digital";
export type BookStatus = "tbr" | "reading" | "wishlist" | "finished";
export type BookCategory = "book" | "novel" | "manga";

export interface Book {
  id: string;
  title: string;
  author: string;
  format: BookFormat;
  language: string;
  pages: number;
  status: BookStatus;
  category: BookCategory;
  series: string | null;
  seriesOrder: number | null;
  favorite: boolean;
  progressPages: number;
  coverBg: string;
  coverImage: string | null;
  reviewRating: number | null;
  reviewStartedAt: string | null;
  reviewFinishedAt: string | null;
  reviewFavoriteCharacter: string | null;
  reviewThoughts: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BookFormData {
  id?: string;
  title: string;
  author: string;
  format: BookFormat;
  language: string;
  pages: number | string;
  status: BookStatus;
  category: BookCategory;
  series: string;
  seriesOrder: number | string;
  favorite: boolean;
  coverBg: string;
  coverImage: string | null;
}

export interface ReviewDraft {
  rating: number;
  startedAt: string;
  finishedAt: string;
  favoriteCharacter: string;
  thoughts: string;
  favorite: boolean;
}

export interface SeriesEntry {
  id: string;
  name: string;
  createdAt: string;
}
