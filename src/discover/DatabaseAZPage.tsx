import { useMemo, useState } from "react";
import { AlphabetIndex } from "./AlphabetIndex";
import { BookGrid, EmptyState, GridSkeleton } from "./BookGrid";
import type { Book } from "./types";

// TODO: once wired to real data, swap this for a server-side query, e.g.:
//   const { data: books = [], isLoading } = trpc.catalog.byLetter.useQuery({ letter: active });
interface DatabaseAZPageProps {
  books: Book[];
  isLoading?: boolean;
}

export function DatabaseAZPage({ books, isLoading }: DatabaseAZPageProps) {
  const [active, setActive] = useState<string | null>(null);

  const filteredBooks = useMemo(() => {
    if (!active) return [];
    return books
      .filter((b) => b.title.trim()[0]?.toUpperCase() === active)
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [books, active]);

  function handleSelect(char: string) {
    setActive((current) => (current === char ? null : char));
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="text-center">
        <h1 className="font-display text-3xl text-ink">Database A-Z</h1>
        <p className="mt-2 font-sans text-ink/60">
          Browse the full catalog by the first letter of the title.
        </p>
      </header>

      <div className="mt-8">
        <AlphabetIndex active={active} onSelect={handleSelect} />
      </div>

      <section className="mt-10">
        {isLoading ? (
          <GridSkeleton />
        ) : !active ? (
          <EmptyState message="Pick a letter to browse the catalog." />
        ) : filteredBooks.length === 0 ? (
          <EmptyState message={`No titles starting with "${active}".`} />
        ) : (
          <BookGrid books={filteredBooks} />
        )}
      </section>
    </div>
  );
}