import { useState } from "react";
import { useBooks } from "./useBooks.js";
import type { Book, BookFormData } from "../types/book.js";
import type { ModalState } from "../types/modal.js";

const COVER_PALETTE = [
  "#c98a6b", "#8fae7d", "#b98a5e", "#e3b8c4", "#9fb8a3",
  "#d9a05b", "#7d9d8f", "#cf9a7a", "#a97c50", "#88a878",
];

export function useLibraryStore() {
  const data = useBooks();
  const [modal, setModal] = useState<ModalState>(null);

  const openAddBookModal = (defaultStatus: BookFormData["status"] = "tbr") => {
    setModal({
      type: "bookForm",
      mode: "add",
      formData: {
        title: "", author: "", format: "physical", language: "English", pages: "",
        status: defaultStatus, category: "book", series: "", seriesOrder: "", favorite: false,
        coverBg: COVER_PALETTE[Math.floor(Math.random() * COVER_PALETTE.length)],
        coverImage: null,
      },
    });
  };

  const openEditBookModal = (book: Book) => {
    setModal({
      type: "bookForm",
      mode: "edit",
      formData: {
        id: book.id, title: book.title, author: book.author, format: book.format, language: book.language,
        pages: book.pages, status: book.status, category: book.category, series: book.series || "", seriesOrder: book.seriesOrder || "",
        favorite: !!book.favorite, coverBg: book.coverBg, coverImage: book.coverImage,
      },
    });
  };

  const openPickModal = (title: string, filterFn: (b: Book) => boolean, onPick: (b: Book) => void) => {
    setModal({ type: "pickExisting", title, filterFn, onPick, search: "" });
  };

  const closeModal = () => setModal(null);

  const patchFormData = (patch: Partial<BookFormData>) => {
    setModal((m) => (m && m.type === "bookForm" ? { ...m, formData: { ...m.formData, ...patch } } : m));
  };

  const saveBookForm = async () => {
    if (!modal || modal.type !== "bookForm") return;
    const fd = modal.formData;
    if (!fd.title.trim()) return;
    await data.saveBook(fd);
    closeModal();
  };

  const confirmNewSeries = async () => {
    if (!modal || modal.type !== "newSeries") return;
    const name = modal.name.trim();
    if (!name) return;
    await data.createSeries(name);
    closeModal();
  };

  return {
    ...data,
    modal,
    setModal,
    openAddBookModal,
    openEditBookModal,
    openPickModal,
    closeModal,
    patchFormData,
    saveBookForm,
    confirmNewSeries,
  };
}

export type LibraryStore = ReturnType<typeof useLibraryStore>;
