import { apiFetch } from "./api.js";
import type { BookCategory } from "../types/book.js";

export interface PreviewBook {
  id: string;
  title: string;
  author: string;
  format: "physical" | "digital";
  coverBg: string;
  coverImage: string | null;
}

interface PreviewResponse {
  reading: PreviewBook[];
  finished: PreviewBook[];
}

export interface PublicWishlistBook extends PreviewBook {
  category: BookCategory;
  series: string | null;
  seriesOrder: number | null;
  pages: number;
}

export const publicService = {
  preview: () => apiFetch<PreviewResponse>("/public/preview"),
  wishlist: () => apiFetch<PublicWishlistBook[]>("/public/wishlist"),
};
