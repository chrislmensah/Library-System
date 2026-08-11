import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { MemberFormValues } from "./manageTypes";

interface AddMemberDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: MemberFormValues) => void;
}

const emptyForm: MemberFormValues = { name: "", email: "" };

export function AddMemberDialog({ open, onClose, onSubmit }: AddMemberDialogProps) {
  const [form, setForm] = useState<MemberFormValues>(emptyForm);
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
    if (!form.name.trim()) next.name = "Name is required.";
    if (!form.email.trim()) next.email = "Email is required.";
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
          <h2 className="font-display text-lg text-ink">Add member</h2>
          <button onClick={onClose} aria-label="Close" className="text-ink/40 hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-4">
          <div>
            <label className="mb-1 block font-sans text-sm font-medium text-ink/80">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-md border border-moss-200 px-3 py-2 font-sans text-sm focus:border-moss-500 focus:outline-none focus:ring-1 focus:ring-moss-500"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label className="mb-1 block font-sans text-sm font-medium text-ink/80">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-md border border-moss-200 px-3 py-2 font-sans text-sm focus:border-moss-500 focus:outline-none focus:ring-1 focus:ring-moss-500"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
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
              Add member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}