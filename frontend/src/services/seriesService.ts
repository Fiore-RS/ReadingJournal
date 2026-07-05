import { apiFetch } from "./api.js";
import type { SeriesEntry } from "../types/book.js";

export const seriesService = {
  list: () => apiFetch<SeriesEntry[]>("/series"),
  create: (name: string) =>
    apiFetch<SeriesEntry>("/series", {
      method: "POST",
      body: JSON.stringify({ name }),
    }),
};
