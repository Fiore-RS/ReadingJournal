import { createContext, useContext, type ReactNode } from "react";
import { useLibraryStore, type LibraryStore } from "../hooks/useLibraryStore.js";
import { useAuth } from "./AuthContext.js";

const LibraryContext = createContext<LibraryStore | null>(null);

export function LibraryProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const store = useLibraryStore(!!user);
  return <LibraryContext.Provider value={store}>{children}</LibraryContext.Provider>;
}

export function useLibrary(): LibraryStore {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error("useLibrary must be used within a LibraryProvider");
  return ctx;
}
