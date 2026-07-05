import { createContext, useContext, type ReactNode } from "react";
import { useLibraryStore, type LibraryStore } from "../hooks/useLibraryStore.js";

const LibraryContext = createContext<LibraryStore | null>(null);

export function LibraryProvider({ children }: { children: ReactNode }) {
  const store = useLibraryStore();
  return <LibraryContext.Provider value={store}>{children}</LibraryContext.Provider>;
}

export function useLibrary(): LibraryStore {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error("useLibrary must be used within a LibraryProvider");
  return ctx;
}
