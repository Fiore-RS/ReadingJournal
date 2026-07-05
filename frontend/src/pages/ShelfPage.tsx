import { useLibrary } from "../context/LibraryContext.js";
import BookShelf from "../components/BookShelf.js";
import type { Book, BookStatus } from "../types/book.js";

interface ShelfPageConfig {
  filter: (b: Book) => boolean;
  title: string;
  icon: string;
  addLabel?: string;
  onAdd?: "addBook" | "addChoice" | "addFavorite";
  addStatus?: BookStatus;
  emptyText: string;
}

const CONFIGS: Record<string, ShelfPageConfig> = {
  library: {
    filter: () => true,
    title: "My Library",
    icon: "📚",
    addLabel: "Add New Book",
    onAdd: "addBook",
    addStatus: "tbr",
    emptyText: "Your shelf is empty — add a book to begin!",
  },
  tbr: {
    filter: (b) => b.status === "tbr",
    title: "To Be Read",
    icon: "📖",
    addLabel: "Add Book",
    onAdd: "addChoice",
    emptyText: "Nothing waiting patiently yet.",
  },
  wishlist: {
    filter: (b) => b.status === "wishlist",
    title: "Wishlist",
    icon: "✨",
    addLabel: "Add New Book",
    onAdd: "addBook",
    addStatus: "wishlist",
    emptyText: "Dream a little — add a book you're longing for.",
  },
  finished: {
    filter: (b) => b.status === "finished",
    title: "Finished",
    icon: "🍃",
    emptyText: "No finished books yet — your first is waiting!",
  },
  favorites: {
    filter: (b) => b.status === "finished" && b.favorite,
    title: "Top Favorites",
    icon: "💚",
    addLabel: "Add Existing Book",
    onAdd: "addFavorite",
    emptyText: "Mark a finished book as favorite to see it here.",
  },
};

export default function ShelfPage({ variant }: { variant: keyof typeof CONFIGS }) {
  const { books, openAddBookModal, setModal, openPickModal, setFavorite, closeModal, openDetailsModal } = useLibrary();
  const config = CONFIGS[variant];

  const handleAdd = () => {
    if (config.onAdd === "addBook") openAddBookModal(config.addStatus);
    if (config.onAdd === "addChoice") setModal({ type: "addChoice" });
    if (config.onAdd === "addFavorite") {
      openPickModal("Mark a Finished Book as Favorite", (b) => b.status === "finished" && !b.favorite, (b) => {
        setFavorite(b.id, true);
        closeModal();
      });
    }
  };

  return (
    <BookShelf
      books={books.filter(config.filter)}
      pageTitle={config.title}
      pageIcon={config.icon}
      addLabel={config.addLabel}
      onAddClick={config.addLabel ? handleAdd : undefined}
      onOpenBook={(book) => openDetailsModal(book.id)}
      emptyText={config.emptyText}
    />
  );
}
