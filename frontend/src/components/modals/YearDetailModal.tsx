import { useMemo } from "react";
import { useLibrary } from "../../context/LibraryContext.js";
import BookCard from "../BookCard.js";
import ModalShell from "./ModalShell.js";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function YearDetailModal({ year }: { year: string }) {
  const { books, closeModal, openDetailsModal } = useLibrary();

  const monthGroups = useMemo(() => {
    const finishedThisYear = books.filter(
      (b) => b.status === "finished" && b.reviewFinishedAt && b.reviewFinishedAt.slice(0, 4) === year
    );

    const groups: { monthIndex: number; monthName: string; books: typeof books }[] = [];
    for (let i = 0; i < 12; i++) {
      const monthBooks = finishedThisYear.filter((b) => Number(b.reviewFinishedAt!.slice(5, 7)) - 1 === i);
      if (monthBooks.length > 0) {
        groups.push({ monthIndex: i, monthName: MONTH_NAMES[i], books: monthBooks });
      }
    }
    return groups;
  }, [books, year]);

  const totalCount = monthGroups.reduce((sum, g) => sum + g.books.length, 0);

  return (
    <ModalShell onClose={closeModal} maxWidth={720} bgClassName="bg-white" showCloseButton>
      <div className="flex items-center gap-3.5 mb-1">
        <span className="text-[32px]">📅</span>
        <h1 className="font-display text-[30px] font-semibold text-clay m-0">{year}</h1>
      </div>
      <div className="font-body text-sand text-base ml-[46px] mb-6">
        {totalCount} book{totalCount === 1 ? "" : "s"} finished this year
      </div>

      {monthGroups.length > 0 ? (
        <div className="flex flex-col gap-6">
          {monthGroups.map((group) => (
            <div key={group.monthIndex}>
              <div className="flex items-baseline gap-2.5 mb-3">
                <div className="w-[26px] h-1.5 rounded-full bg-sage-soft" />
                <h2 className="font-display text-xl font-semibold text-clay m-0">{group.monthName}</h2>
                <span className="text-sm text-driftwood">
                  {group.books.length} book{group.books.length === 1 ? "" : "s"}
                </span>
              </div>
              <div className="flex justify-center gap-4 flex-wrap p-4 rounded-2xl bg-bark/[0.06]">
                {group.books.map((book) => (
                  <BookCard key={book.id} book={book} size="small" onClick={() => openDetailsModal(book.id)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-driftwood">No books finished in {year} yet.</div>
      )}
    </ModalShell>
  );
}
