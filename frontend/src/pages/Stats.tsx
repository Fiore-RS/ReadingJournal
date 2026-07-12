import { useMemo } from "react";
import { useLibrary } from "../context/LibraryContext.js";

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  sub?: string;
}

function StatCard({ icon, label, value, sub }: StatCardProps) {
  return (
    <div className="bg-white rounded-[22px] p-6 shadow-[0_8px_20px_rgba(74,53,39,0.12)] flex flex-col gap-2">
      <div className="text-[32px]">{icon}</div>
      <div className="font-display text-4xl font-semibold text-clay leading-none">{value}</div>
      <div className="font-body text-base text-sand font-bold">{label}</div>
      {!!sub && <div className="font-body text-sm text-driftwood">{sub}</div>}
    </div>
  );
}

export default function Stats() {
  const { books, openYearDetailModal } = useLibrary();

  const stats = useMemo(() => {
    const tbrCount = books.filter((b) => b.status === "tbr").length;
    const wishlistCount = books.filter((b) => b.status === "wishlist").length;
    const finished = books.filter((b) => b.status === "finished");
    const totalPages = finished.reduce((sum, b) => sum + (b.pages || 0), 0);

    // Books already owned: read already, or waiting on the shelf to be read.
    const inPossessionCount = finished.length + tbrCount;

    // Group books by series name (standalones excluded) to work out
    // which series are fully finished vs. still have books left to go.
    const seriesNames = Array.from(new Set(books.filter((b) => b.series).map((b) => b.series as string)));
    let completedSeries = 0;
    let inProgressSeries = 0;
    seriesNames.forEach((name) => {
      const seriesBooks = books.filter((b) => b.series === name);
      if (seriesBooks.length === 0) return;
      const allFinished = seriesBooks.every((b) => b.status === "finished");
      if (allFinished) completedSeries += 1;
      else inProgressSeries += 1;
    });

    // Books finished per year, based on the review's "finished" date.
    const yearCounts = new Map<string, number>();
    finished.forEach((b) => {
      if (!b.reviewFinishedAt) return;
      const year = b.reviewFinishedAt.slice(0, 4);
      yearCounts.set(year, (yearCounts.get(year) || 0) + 1);
    });
    const yearsSorted = Array.from(yearCounts.entries())
      .sort((a, b) => b[0].localeCompare(a[0])); // most recent year first

    return {
      tbrCount,
      wishlistCount,
      finishedCount: finished.length,
      totalPages,
      inPossessionCount,
      completedSeries,
      inProgressSeries,
      totalSeries: seriesNames.length,
      yearsSorted,
    };
  }, [books]);

  return (
    <div className="w-full min-h-full px-4 sm:px-8 lg:px-12 pt-6 sm:pt-9 pb-16">
      <div className="flex items-center gap-2.5 sm:gap-3.5 mb-6 sm:mb-8">
        <span className="text-2xl sm:text-3xl lg:text-[36px]">📊</span>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-clay m-0">Stats</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard icon="📖" label="To Be Read" value={stats.tbrCount} />
        <StatCard icon="✨" label="Wishlist" value={stats.wishlistCount} />
        <StatCard icon="🍃" label="Books Finished" value={stats.finishedCount} />
        <StatCard icon="📄" label="Pages Read" value={stats.totalPages.toLocaleString()} />
        <StatCard
          icon="🏠"
          label="Books in Possession"
          value={stats.inPossessionCount}
          sub="Finished + To Be Read"
        />
        <StatCard
          icon="🩷"
          label="Series"
          value={stats.totalSeries}
          sub={`${stats.completedSeries} completed · ${stats.inProgressSeries} in progress`}
        />
      </div>

      {stats.yearsSorted.length > 0 && (
        <div className="mt-10">
          <div className="flex items-baseline gap-2.5 mb-4">
            <div className="w-[30px] h-1.5 rounded-full bg-sage-soft" />
            <h2 className="font-display text-2xl font-semibold text-clay m-0">Finished by Year</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {stats.yearsSorted.map(([year, count]) => (
              <button
                key={year}
                onClick={() => openYearDetailModal(year)}
                className="bg-white rounded-[22px] p-6 shadow-[0_8px_20px_rgba(74,53,39,0.12)] flex flex-col gap-2 text-left cursor-pointer transition-transform hover:-translate-y-1"
              >
                <div className="text-[32px]">📅</div>
                <div className="font-display text-4xl font-semibold text-clay leading-none">{year}</div>
                <div className="font-body text-base text-sand font-bold">
                  {count} book{count === 1 ? "" : "s"} finished
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
