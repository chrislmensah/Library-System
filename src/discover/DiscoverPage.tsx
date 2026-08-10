import { useMemo, useState } from "react";
import { SearchBar } from "./SearchBar";
import { FilterTabs } from "./FilterTabs";
import { BookCard } from "./BookCard";
import type { Book, BookFilter } from "./types";

// TODO: replace with real tRPC queries once auth/data layer is wired up, e.g.:
//   const { data: books = [] } = trpc.catalog.list.useQuery({ filter, query });
//   const { data: freeBooks = [] } = trpc.catalog.list.useQuery({ isFree: true });
interface DiscoverPageProps {
  books: Book[];
  isLoading?: boolean;
}

export function DiscoverPage({ books, isLoading }: DiscoverPageProps) {
  const [filter, setFilter] = useState<BookFilter>("popular");
  const [query, setQuery] = useState("");

  const filteredBooks = useMemo(() => {
    const q = query.toLowerCase();
    const matches = books.filter(
      (b) =>
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.isbn.toLowerCase().includes(q)
    );

    switch (filter) {
      case "most-liked":
        return [...matches].sort((a, b) => b.stats.likes - a.stats.likes);
      case "most-read":
        return [...matches].sort((a, b) => b.stats.reads - a.stats.reads);
      case "most-viewed":
        return [...matches].sort((a, b) => b.stats.views - a.stats.views);
      case "latest":
        return [...matches].sort(
          (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
        );
      case "popular":
      default:
        return [...matches].sort(
          (a, b) => b.stats.likes + b.stats.views - (a.stats.likes + a.stats.views)
        );
    }
  }, [books, filter, query]);

  const freeBooks = useMemo(() => books.filter((b) => b.isFree), [books]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-4xl text-ink">
          Discover <span className="text-moss-600">#amazing</span> books here.
        </h1>
        <p className="mt-2 font-sans text-ink/60">
          Share, discover &amp; read books you love.
        </p>
      </header>

      <div className="mt-6 flex flex-col items-center gap-4">
        <FilterTabs active={filter} onChange={setFilter} />
        <SearchBar onSearch={setQuery} />
      </div>

      <section className="mt-10">
        {isLoading ? (
          <GridSkeleton />
        ) : filteredBooks.length === 0 ? (
          <EmptyState query={query} />
        ) : (
          <BookGrid books={filteredBooks} />
        )}
      </section>

      {freeBooks.length > 0 && (
        <section className="mt-14">
          <div className="mb-4 flex items-center gap-3">
            <h2 className="font-display text-2xl text-ink">Free to read</h2>
            <span className="h-px flex-1 bg-moss-200" />
          </div>
          <BookGrid books={freeBooks} />
        </section>
      )}
    </div>
  );
}

function BookGrid({ books }: { books: Book[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="rounded-lg border border-dashed border-moss-200 bg-ivory-50 py-16 text-center">
      <p className="font-display text-lg text-ink">
        {query ? `No books match "${query}"` : "No books here yet"}
      </p>
      <p className="mt-1 font-sans text-sm text-ink/50">
        Try a different title, author, or ISBN.
      </p>
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="aspect-[2/3] animate-pulse rounded-lg bg-moss-100" />
      ))}
    </div>
  );
}