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
  const { books } = useLibrary();

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

    return {
      tbrCount,
      wishlistCount,
      finishedCount: finished.length,
      totalPages,
      inPossessionCount,
      completedSeries,
      inProgressSeries,
      totalSeries: seriesNames.length,
    };
  }, [books]);

  return (
    <div className="w-full min-h-full px-4 sm:px-12 pt-9 pb-16">
      <div className="flex items-center gap-3.5 mb-1.5">
        <span className="text-[36px]">📊</span>
        <h1 className="font-display text-5xl font-semibold text-clay m-0">Stats</h1>
      </div>
      <div className="font-body text-sand text-base sm:ml-[50px] mb-8">A little snapshot of your reading life</div>

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
    </div>
  );
}