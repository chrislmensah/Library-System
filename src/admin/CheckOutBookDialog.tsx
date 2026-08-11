import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { CatalogBook } from "./catalogTypes";

export interface CheckOutFormValues {
  bookId: string;
  memberName: string;
  memberEmail: string;
  dueDate: string; // yyyy-mm-dd
}

interface CheckOutBookDialogProps {
  open: boolean;
  availableBooks: CatalogBook[]; // books with copiesAvailable > 0
  onClose: () => void;
  onSubmit: (values: CheckOutFormValues) => void;
}

function twoWeeksFromNow() {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d.toISOString().slice(0, 10);
}

const emptyForm: CheckOutFormValues = {
  bookId: "",
  memberName: "",
  memberEmail: "",
  dueDate: twoWeeksFromNow(),
};

export function CheckOutBookDialog({ open, availableBooks, onClose, onSubmit }: CheckOutBookDialogProps) {
  const [form, setForm] = useState<CheckOutFormValues>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setForm({ ...emptyForm, bookId: availableBooks[0]?.id ?? "" });
      setErrors({});
    }
  }, [open, availableBooks]);

  if (!open) return null;

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.bookId) next.bookId = "Choose a book — none are currently available.";
    if (!form.memberName.trim()) next.memberName = "Member name is required.";
    if (!form.memberEmail.trim()) next.memberEmail = "Member email is required.";
    if (!form.dueDate) next.dueDate = "Due date is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-moss-200 px-5 py-4">
          <h2 className="font-display text-lg text-ink">Check out a book</h2>
          <button onClick={onClose} aria-label="Close" className="text-ink/40 hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-4">
          <div>
            <label className="mb-1 block font-sans text-sm font-medium text-ink/80">Book</label>
            <select
              value={form.bookId}
              onChange={(e) => setForm({ ...form, bookId: e.target.value })}
              className="w-full rounded-md border border-moss-200 px-3 py-2 font-sans text-sm focus:border-moss-500 focus:outline-none focus:ring-1 focus:ring-moss-500"
            >
              {availableBooks.length === 0 && <option value="">No copies available</option>}
              {availableBooks.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title} ({b.copiesAvailable} available)
                </option>
              ))}
            </select>
            {errors.bookId && <p className="mt-1 text-xs text-red-500">{errors.bookId}</p>}
          </div>

          <div>
            <label className="mb-1 block font-sans text-sm font-medium text-ink/80">Member name</label>
            <input
              type="text"
              value={form.memberName}
              onChange={(e) => setForm({ ...form, memberName: e.target.value })}
              className="w-full rounded-md border border-moss-200 px-3 py-2 font-sans text-sm focus:border-moss-500 focus:outline-none focus:ring-1 focus:ring-moss-500"
            />
            {errors.memberName && <p className="mt-1 text-xs text-red-500">{errors.memberName}</p>}
          </div>

          <div>
            <label className="mb-1 block font-sans text-sm font-medium text-ink/80">Member email</label>
            <input
              type="email"
              value={form.memberEmail}
              onChange={(e) => setForm({ ...form, memberEmail: e.target.value })}
              className="w-full rounded-md border border-moss-200 px-3 py-2 font-sans text-sm focus:border-moss-500 focus:outline-none focus:ring-1 focus:ring-moss-500"
            />
            {errors.memberEmail && <p className="mt-1 text-xs text-red-500">{errors.memberEmail}</p>}
          </div>

          <div>
            <label className="mb-1 block font-sans text-sm font-medium text-ink/80">Due date</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className="w-full rounded-md border border-moss-200 px-3 py-2 font-sans text-sm focus:border-moss-500 focus:outline-none focus:ring-1 focus:ring-moss-500"
            />
            {errors.dueDate && <p className="mt-1 text-xs text-red-500">{errors.dueDate}</p>}
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
              disabled={availableBooks.length === 0}
              className="rounded-md bg-moss-600 px-4 py-2 font-sans text-sm font-medium text-white hover:bg-moss-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Check out
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}