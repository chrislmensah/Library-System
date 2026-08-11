import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { CatalogBook, CatalogFormValues } from "./catalogTypes";

interface BookFormModalProps {
  open: boolean;
  book: CatalogBook | null; // null = adding a new book
  onClose: () => void;
  onSave: (values: CatalogFormValues, existing: CatalogBook | null) => void;
}

const emptyForm: CatalogFormValues = {
  title: "",
  author: "",
  isbn: "",
  coverUrl: "",
  isFree: false,
  copiesTotal: 1,
  copiesAvailable: 1,
};

export function BookFormModal({ open, book, onClose, onSave }: BookFormModalProps) {
  const [form, setForm] = useState<CatalogFormValues>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (book) {
      setForm({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        coverUrl: book.coverUrl,
        isFree: book.isFree,
        copiesTotal: book.copiesTotal,
        copiesAvailable: book.copiesAvailable,
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [book, open]);

  if (!open) return null;

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.title.trim()) next.title = "Title is required.";
    if (!form.author.trim()) next.author = "Author is required.";
    if (!form.isbn.trim()) next.isbn = "ISBN is required.";
    if (form.copiesTotal < 0) next.copiesTotal = "Total copies can't be negative.";
    if (form.copiesAvailable < 0) next.copiesAvailable = "Available copies can't be negative.";
    if (form.copiesAvailable > form.copiesTotal)
      next.copiesAvailable = "Available copies can't exceed total copies.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(form, book);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-moss-200 px-5 py-4">
          <h2 className="font-display text-lg text-ink">{book ? "Edit book" : "Add book"}</h2>
          <button onClick={onClose} aria-label="Close" className="text-ink/40 hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-4">
          <div>
            <label className="mb-1 block font-sans text-sm font-medium text-ink/80">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-md border border-moss-200 px-3 py-2 font-sans text-sm focus:border-moss-500 focus:outline-none focus:ring-1 focus:ring-moss-500"
            />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
          </div>

          <div>
            <label className="mb-1 block font-sans text-sm font-medium text-ink/80">Author</label>
            <input
              type="text"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              className="w-full rounded-md border border-moss-200 px-3 py-2 font-sans text-sm focus:border-moss-500 focus:outline-none focus:ring-1 focus:ring-moss-500"
            />
            {errors.author && <p className="mt-1 text-xs text-red-500">{errors.author}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block font-sans text-sm font-medium text-ink/80">ISBN</label>
              <input
                type="text"
                value={form.isbn}
                onChange={(e) => setForm({ ...form, isbn: e.target.value })}
                className="w-full rounded-md border border-moss-200 px-3 py-2 font-mono text-sm focus:border-moss-500 focus:outline-none focus:ring-1 focus:ring-moss-500"
              />
              {errors.isbn && <p className="mt-1 text-xs text-red-500">{errors.isbn}</p>}
            </div>

            <div>
              <label className="mb-1 block font-sans text-sm font-medium text-ink/80">Cover URL</label>
              <input
                type="text"
                value={form.coverUrl}
                onChange={(e) => setForm({ ...form, coverUrl: e.target.value })}
                placeholder="Optional"
                className="w-full rounded-md border border-moss-200 px-3 py-2 font-sans text-sm focus:border-moss-500 focus:outline-none focus:ring-1 focus:ring-moss-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 items-end gap-4">
            <div>
              <label className="mb-1 block font-sans text-sm font-medium text-ink/80">Total copies</label>
              <input
                type="number"
                min={0}
                value={form.copiesTotal}
                onChange={(e) => setForm({ ...form, copiesTotal: Number(e.target.value) })}
                className="w-full rounded-md border border-moss-200 px-3 py-2 font-sans text-sm focus:border-moss-500 focus:outline-none focus:ring-1 focus:ring-moss-500"
              />
              {errors.copiesTotal && <p className="mt-1 text-xs text-red-500">{errors.copiesTotal}</p>}
            </div>

            <div>
              <label className="mb-1 block font-sans text-sm font-medium text-ink/80">Available</label>
              <input
                type="number"
                min={0}
                value={form.copiesAvailable}
                onChange={(e) => setForm({ ...form, copiesAvailable: Number(e.target.value) })}
                className="w-full rounded-md border border-moss-200 px-3 py-2 font-sans text-sm focus:border-moss-500 focus:outline-none focus:ring-1 focus:ring-moss-500"
              />
              {errors.copiesAvailable && (
                <p className="mt-1 text-xs text-red-500">{errors.copiesAvailable}</p>
              )}
            </div>

            <label className="mb-2 inline-flex items-center gap-2 font-sans text-sm text-ink/80">
              <input
                type="checkbox"
                checked={form.isFree}
                onChange={(e) => setForm({ ...form, isFree: e.target.checked })}
                className="h-4 w-4 rounded border-moss-300 text-moss-600 focus:ring-moss-500"
              />
              Free to read
            </label>
          </div>

          <div className="flex justify-end gap-3 border-t border-moss-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-4 py-2 font-sans text-sm font-medium text-ink/70 hover:bg-ivory-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-moss-600 px-4 py-2 font-sans text-sm font-medium text-white hover:bg-moss-700"
            >
              {book ? "Save changes" : "Add book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}