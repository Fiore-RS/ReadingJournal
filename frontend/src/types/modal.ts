import type { Book, BookFormData, BookStatus } from "./book.js";

export type ModalState =
  | { type: "bookForm"; mode: "add" | "edit"; formData: BookFormData }
  | { type: "addChoice" }
  | { type: "pickExisting"; title: string; search: string; filterFn: (b: Book) => boolean; onPick: (b: Book) => void }
  | { type: "newSeries"; name: string }
  | { type: "bookDetails"; bookId: string }
  | { type: "reviewView"; bookId: string }
  | { type: "reviewEdit"; bookId: string }
  | { type: "yearDetail"; year: string }
  | null;

export type { BookStatus };
