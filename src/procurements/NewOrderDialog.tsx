import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { ProcurementFormValues } from "./procurementTypes";

interface NewOrderDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: ProcurementFormValues) => void;
}

const emptyForm: ProcurementFormValues = {
  title: "",
  author: "",
  isbn: "",
  quantity: 1,
  vendor: "",
  costPerCopy: undefined,
  expectedDate: "",
};

export function NewOrderDialog({ open, onClose, onSubmit }: NewOrderDialogProps) {
  const [form, setForm] = useState<ProcurementFormValues>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setForm(emptyForm);
      setErrors({});
    }
  }, [open]);

  if (!open) return null;

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.title.trim()) next.title = "Title is required.";
    if (!form.author.trim()) next.author = "Author is required.";
    if (!form.vendor.trim()) next.vendor = "Vendor is required.";
    if (form.quantity < 1) next.quantity = "Quantity must be at least 1.";
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
      <div className="w-full max-w-lg rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-moss-200 px-5 py-4">
          <h2 className="font-display text-lg text-ink">New order</h2>
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

          <div className="grid grid-cols-2 gap-4">
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

            <div>
              <label className="mb-1 block font-sans text-sm font-medium text-ink/80">ISBN</label>
              <input
                type="text"
                value={form.isbn}
                onChange={(e) => setForm({ ...form, isbn: e.target.value })}
                placeholder="Optional"
                className="w-full rounded-md border border-moss-200 px-3 py-2 font-mono text-sm focus:border-moss-500 focus:outline-none focus:ring-1 focus:ring-moss-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block font-sans text-sm font-medium text-ink/80">Vendor</label>
            <input
              type="text"
              value={form.vendor}
              onChange={(e) => setForm({ ...form, vendor: e.target.value })}
              placeholder="e.g. Ingram, local distributor"
              className="w-full rounded-md border border-moss-200 px-3 py-2 font-sans text-sm focus:border-moss-500 focus:outline-none focus:ring-1 focus:ring-moss-500"
            />
            {errors.vendor && <p className="mt-1 text-xs text-red-500">{errors.vendor}</p>}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block font-sans text-sm font-medium text-ink/80">Quantity</label>
              <input
                type="number"
                min={1}
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                className="w-full rounded-md border border-moss-200 px-3 py-2 font-sans text-sm focus:border-moss-500 focus:outline-none focus:ring-1 focus:ring-moss-500"
              />
              {errors.quantity && <p className="mt-1 text-xs text-red-500">{errors.quantity}</p>}
            </div>

            <div>
              <label className="mb-1 block font-sans text-sm font-medium text-ink/80">Cost/copy</label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={form.costPerCopy ?? ""}
                onChange={(e) =>
                  setForm({ ...form, costPerCopy: e.target.value === "" ? undefined : Number(e.target.value) })
                }
                placeholder="Optional"
                className="w-full rounded-md border border-moss-200 px-3 py-2 font-sans text-sm focus:border-moss-500 focus:outline-none focus:ring-1 focus:ring-moss-500"
              />
            </div>

            <div>
              <label className="mb-1 block font-sans text-sm font-medium text-ink/80">Expected</label>
              <input
                type="date"
                value={form.expectedDate}
                onChange={(e) => setForm({ ...form, expectedDate: e.target.value })}
                className="w-full rounded-md border border-moss-200 px-3 py-2 font-sans text-sm focus:border-moss-500 focus:outline-none focus:ring-1 focus:ring-moss-500"
              />
            </div>
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
              Place order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}