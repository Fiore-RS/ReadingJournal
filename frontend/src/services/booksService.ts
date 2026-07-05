import { apiFetch } from "./api.js";
import type { Book, BookFormData, ReviewDraft, BookStatus } from "../types/book.js";

export const booksService = {
  list: () => apiFetch<Book[]>("/books"),

  create: (data: Omit<BookFormData, "id">) =>
    apiFetch<Book>("/books", {
      method: "POST",
      body: JSON.stringify({
        ...data,
        pages: Number(data.pages) || 0,
        series: data.series ? data.series.trim() : null,
        seriesOrder: data.seriesOrder ? Number(data.seriesOrder) : null,
      }),
    }),

  update: (id: string, data: Omit<BookFormData, "id">) =>
    apiFetch<Book>(`/books/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        ...data,
        pages: Number(data.pages) || 0,
        series: data.series ? data.series.trim() : null,
        seriesOrder: data.seriesOrder ? Number(data.seriesOrder) : null,
      }),
    }),

  remove: (id: string) => apiFetch<void>(`/books/${id}`, { method: "DELETE" }),

  setStatus: (id: string, status: BookStatus, progressPages?: number) =>
    apiFetch<Book>(`/books/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, progressPages }),
    }),

  setFavorite: (id: string, favorite: boolean) =>
    apiFetch<Book>(`/books/${id}/favorite`, {
      method: "PATCH",
      body: JSON.stringify({ favorite }),
    }),

  setProgress: (id: string, progressPages: number) =>
    apiFetch<Book>(`/books/${id}/progress`, {
      method: "PATCH",
      body: JSON.stringify({ progressPages }),
    }),

  saveReview: (id: string, review: ReviewDraft) =>
    apiFetch<Book>(`/books/${id}/review`, {
      method: "PUT",
      body: JSON.stringify(review),
    }),
};
