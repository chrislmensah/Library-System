import { useMemo, useState } from "react";
import { CatalogsToolbar, type AvailabilityFilter } from "./CatalogsToolbar";
import { CatalogsTable } from "./CatalogsTable";
import { BookFormModal } from "./BookFormModal";
import { DeleteBookDialog } from "./DeleteBookDialog";
import type { CatalogBook, CatalogFormValues } from "./catalogTypes";

interface CatalogsPageProps {
  initialBooks: CatalogBook[];
}

export function CatalogsPage({ initialBooks }: CatalogsPageProps) {
  const [books, setBooks] = useState<CatalogBook[]>(initialBooks);
  const [search, setSearch] = useState("");
  const [availability, setAvailability] = useState<AvailabilityFilter>("all");

  const [formOpen, setFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<CatalogBook | null>(null);
  const [deletingBook, setDeletingBook] = useState<CatalogBook | null>(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return books.filter((b) => {
      const matchesSearch =
        !term ||
        b.title.toLowerCase().includes(term) ||
        b.author.toLowerCase().includes(term) ||
        b.isbn.toLowerCase().includes(term);
      const matchesAvailability =
        availability === "all" ||
        (availability === "available" && b.copiesAvailable > 0) ||
        (availability === "unavailable" && b.copiesAvailable === 0);
      return matchesSearch && matchesAvailability;
    });
  }, [books, search, availability]);

  const openAddForm = () => {
    setEditingBook(null);
    setFormOpen(true);
  };

  const openEditForm = (book: CatalogBook) => {
    setEditingBook(book);
    setFormOpen(true);
  };

  const handleSave = (values: CatalogFormValues, existing: CatalogBook | null) => {
    // TODO: replace with real tRPC mutation (create/update) once wired up
    if (existing) {
      setBooks((prev) =>
        prev.map((b) => (b.id === existing.id ? { ...b, ...values } : b))
      );
    } else {
      const newBook: CatalogBook = {
        ...values,
        id: crypto.randomUUID(),
        stats: { likes: 0, reads: 0, views: 0 },
        addedAt: new Date().toISOString(),
      };
      setBooks((prev) => [newBook, ...prev]);
    }
    setFormOpen(false);
  };

  const handleDeleteConfirmed = (book: CatalogBook) => {
    // TODO: replace with real tRPC mutation once wired up
    setBooks((prev) => prev.filter((b) => b.id !== book.id));
    setDeletingBook(null);
  };

  return (
    <div>
      <div className="mb-4">
        <h1 className="font-display text-xl text-ink">Catalogs</h1>
        <p className="mt-1 font-sans text-sm text-ink/50">
          Manage the books in your library — add new titles, update copy counts, and remove
          books you no longer carry.
        </p>
      </div>

      <div className="rounded-lg border border-moss-200 bg-white shadow-sm">
        <CatalogsToolbar
          search={search}
          onSearchChange={setSearch}
          availability={availability}
          onAvailabilityChange={setAvailability}
          resultCount={filtered.length}
          onAddBook={openAddForm}
        />
        <CatalogsTable books={filtered} onEdit={openEditForm} onDelete={setDeletingBook} />
      </div>

      <BookFormModal
        open={formOpen}
        book={editingBook}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
      />

      <DeleteBookDialog
        book={deletingBook}
        onCancel={() => setDeletingBook(null)}
        onConfirm={handleDeleteConfirmed}
      />
    </div>
  );
}