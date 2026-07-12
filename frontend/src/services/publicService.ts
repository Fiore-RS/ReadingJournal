import { apiFetch } from "./api.js";

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

export const publicService = {
  preview: () => apiFetch<PreviewResponse>("/public/preview"),
};
