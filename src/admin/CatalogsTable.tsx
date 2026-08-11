import { useState } from "react";
import { Pencil, Trash2, BookX } from "lucide-react";
import type { CatalogBook } from "./catalogTypes";

type SortKey = "title" | "author" | "copiesAvailable";

interface CatalogsTableProps {
  books: CatalogBook[];
  onEdit: (book: CatalogBook) => void;
  onDelete: (book: CatalogBook) => void;
}

export function CatalogsTable({ books, onEdit, onDelete }: CatalogsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("title");
  const [sortAsc, setSortAsc] = useState(true);

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const sorted = [...books].sort((a, b) => {
    const dir = sortAsc ? 1 : -1;
    if (sortKey === "copiesAvailable") {
      return (a.copiesAvailable - b.copiesAvailable) * dir;
    }
    return a[sortKey].localeCompare(b[sortKey]) * dir;
  });

  const SortHeader = ({ label, sortKeyName }: { label: string; sortKeyName: SortKey }) => (
    <th
      onClick={() => toggleSort(sortKeyName)}
      className="cursor-pointer select-none px-4 py-3 text-left font-sans text-xs font-semibold uppercase tracking-wide text-ink/50 hover:text-ink"
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {sortKey === sortKeyName && <span>{sortAsc ? "\u2191" : "\u2193"}</span>}
      </span>
    </th>
  );

  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
        <BookX className="h-8 w-8 text-ink/30" />
        <p className="font-sans text-sm font-medium text-ink/70">No books match your filters</p>
        <p className="font-sans text-sm text-ink/40">Try a different search term or clear your filters.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-moss-200">
        <thead className="bg-ivory-50">
          <tr>
            <th className="px-4 py-3 text-left font-sans text-xs font-semibold uppercase tracking-wide text-ink/50">
              Cover
            </th>
            <SortHeader label="Title" sortKeyName="title" />
            <SortHeader label="Author" sortKeyName="author" />
            <th className="px-4 py-3 text-left font-sans text-xs font-semibold uppercase tracking-wide text-ink/50">
              ISBN
            </th>
            <SortHeader label="Copies" sortKeyName="copiesAvailable" />
            <th className="px-4 py-3 text-left font-sans text-xs font-semibold uppercase tracking-wide text-ink/50">
              Access
            </th>
            <th className="px-4 py-3 text-right font-sans text-xs font-semibold uppercase tracking-wide text-ink/50">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-moss-100 bg-white">
          {sorted.map((book) => (
            <tr key={book.id} className="hover:bg-ivory-50">
              <td className="px-4 py-3">
                <div className="h-12 w-9 overflow-hidden rounded bg-ivory-100">
                  {book.coverUrl ? (
                    <img src={book.coverUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] text-ink/30">
                      No cover
                    </div>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 font-sans text-sm font-medium text-ink">{book.title}</td>
              <td className="px-4 py-3 font-sans text-sm text-ink/70">{book.author}</td>
              <td className="px-4 py-3 font-mono text-xs text-ink/50">{book.isbn}</td>
              <td className="px-4 py-3 font-sans text-sm text-ink/70">
                {book.copiesAvailable} / {book.copiesTotal}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-sans text-xs font-medium ${
                    book.isFree
                      ? "border-moss-200 bg-moss-50 text-moss-700"
                      : "border-ink/10 bg-ivory-100 text-ink/60"
                  }`}
                >
                  {book.isFree ? "Free" : "Members"}
                </span>
              </td>
              <td className="px-4 py-3 text-right text-sm">
                <button
                  onClick={() => onEdit(book)}
                  aria-label={`Edit ${book.title}`}
                  className="mr-3 inline-flex items-center text-moss-600 hover:text-moss-800"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(book)}
                  aria-label={`Remove ${book.title}`}
                  className="inline-flex items-center text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}