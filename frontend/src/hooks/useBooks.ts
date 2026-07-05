import { useCallback, useEffect, useState } from "react";
import { booksService } from "../services/booksService.js";
import { seriesService } from "../services/seriesService.js";
import type { Book, BookFormData, BookStatus, ReviewDraft, SeriesEntry } from "../types/book.js";

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [extraSeries, setExtraSeries] = useState<SeriesEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [booksData, seriesData] = await Promise.all([booksService.list(), seriesService.list()]);
      setBooks(booksData);
      setExtraSeries(seriesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong loading your library.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const saveBook = useCallback(async (data: BookFormData) => {
    const payload = { ...data };
    const updated = data.id ? await booksService.update(data.id, payload) : await booksService.create(payload);
    setBooks((prev) => {
      const exists = prev.some((b) => b.id === updated.id);
      return exists ? prev.map((b) => (b.id === updated.id ? updated : b)) : [...prev, updated];
    });
    return updated;
  }, []);

  const removeBook = useCallback(async (id: string) => {
    await booksService.remove(id);
    setBooks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const setStatus = useCallback(async (id: string, status: BookStatus, progressPages?: number) => {
    const updated = await booksService.setStatus(id, status, progressPages);
    setBooks((prev) => prev.map((b) => (b.id === id ? updated : b)));
    return updated;
  }, []);

  const setFavorite = useCallback(async (id: string, favorite: boolean) => {
    const updated = await booksService.setFavorite(id, favorite);
    setBooks((prev) => prev.map((b) => (b.id === id ? updated : b)));
    return updated;
  }, []);

  const setProgress = useCallback(async (id: string, progressPages: number) => {
    const updated = await booksService.setProgress(id, progressPages);
    setBooks((prev) => prev.map((b) => (b.id === id ? updated : b)));
    return updated;
  }, []);

  const saveReview = useCallback(async (id: string, review: ReviewDraft) => {
    const updated = await booksService.saveReview(id, review);
    setBooks((prev) => prev.map((b) => (b.id === id ? updated : b)));
    return updated;
  }, []);

  const createSeries = useCallback(async (name: string) => {
    const created = await seriesService.create(name);
    setExtraSeries((prev) => [...prev, created]);
    return created;
  }, []);

  // Swap the currently-reading book: move the old one to `tbr`, the new one to `reading`.
  const changeCurrentBook = useCallback(
    async (currentId: string | null, nextId: string) => {
      if (currentId) await booksService.setStatus(currentId, "tbr");
      const updatedNext = await booksService.setStatus(nextId, "reading");
      setBooks((prev) =>
        prev.map((b) => {
          if (b.id === currentId) return { ...b, status: "tbr" };
          if (b.id === nextId) return updatedNext;
          return b;
        })
      );
    },
    []
  );

  return {
    books,
    extraSeries,
    loading,
    error,
    refresh,
    saveBook,
    removeBook,
    setStatus,
    setFavorite,
    setProgress,
    saveReview,
    createSeries,
    changeCurrentBook,
  };
}
