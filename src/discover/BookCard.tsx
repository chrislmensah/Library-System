import type { Book } from "./types";

interface BookCardProps {
  book: Book;
  onSelect?: (book: Book) => void;
}

export function BookCard({ book, onSelect }: BookCardProps) {
  return (
    <button
      onClick={() => onSelect?.(book)}
      className="group flex flex-col overflow-hidden rounded-lg border border-moss-100
                 bg-ivory-50 text-left shadow-sm transition
                 hover:-translate-y-0.5 hover:shadow-md focus:outline-none
                 focus:ring-2 focus:ring-moss-500/40"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-moss-100">
        <img
          src={book.coverUrl}
          alt={`Cover of ${book.title}`}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
        />
        {book.isFree && (
          <span
            className="absolute right-2 top-2 rounded-sm bg-stamp-600 px-2 py-0.5
                       font-sans text-[11px] font-semibold uppercase tracking-wide
                       text-ivory-50 shadow-sm"
          >
            Free
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-2 font-display text-base leading-snug text-ink">
          {book.title}
        </h3>
        <p className="font-sans text-xs text-ink/60">{book.author}</p>
      </div>
    </button>
  );
}