import type { CatalogBook } from "../admin/catalogTypes";

interface TopBooksChartProps {
  books: CatalogBook[];
  limit?: number;
}

export function TopBooksChart({ books, limit = 5 }: TopBooksChartProps) {
  const top = [...books]
    .sort((a, b) => b.stats.reads - a.stats.reads)
    .slice(0, limit);

  const max = Math.max(...top.map((b) => b.stats.reads), 1);

  if (top.length === 0) {
    return <p className="font-sans text-sm text-ink/40">No read data yet.</p>;
  }

  return (
    <ul className="space-y-3">
      {top.map((book, i) => (
        <li key={book.id} className="flex items-center gap-3">
          <span className="w-5 shrink-0 font-sans text-xs text-ink/40">{i + 1}</span>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-2">
              <p className="truncate font-sans text-sm font-medium text-ink">{book.title}</p>
              <span className="shrink-0 font-sans text-xs text-ink/50">{book.stats.reads} reads</span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-ivory-100">
              <div
                className="h-full rounded-full bg-moss-500"
                style={{ width: `${(book.stats.reads / max) * 100}%` }}
              />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}