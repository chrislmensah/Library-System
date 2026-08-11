import type { CatalogBook } from "./catalogTypes";

interface DeleteBookDialogProps {
  book: CatalogBook | null;
  onCancel: () => void;
  onConfirm: (book: CatalogBook) => void;
}

export function DeleteBookDialog({ book, onCancel, onConfirm }: DeleteBookDialogProps) {
  if (!book) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-xl">
        <h2 className="font-display text-base text-ink">Remove this book?</h2>
        <p className="mt-2 font-sans text-sm text-ink/60">
          "{book.title}" will be removed from your catalog. This can't be undone.
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-md px-4 py-2 font-sans text-sm font-medium text-ink/70 hover:bg-ivory-100"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(book)}
            className="rounded-md bg-red-500 px-4 py-2 font-sans text-sm font-medium text-white hover:bg-red-600"
          >
            Remove book
          </button>
        </div>
      </div>
    </div>
  );
}