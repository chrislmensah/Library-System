import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Fine } from "./loanTypes";

interface WaiveFineDialogProps {
  fine: Fine | null;
  onClose: () => void;
  onConfirm: (fine: Fine, reason: string) => void;
}

export function WaiveFineDialog({ fine, onClose, onConfirm }: WaiveFineDialogProps) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (fine) {
      setReason("");
      setError("");
    }
  }, [fine]);

  if (!fine) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError("A reason is required to waive a fine.");
      return;
    }
    onConfirm(fine, reason.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
      <div className="w-full max-w-sm rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-moss-200 px-5 py-4">
          <h2 className="font-display text-lg text-ink">Waive fine</h2>
          <button onClick={onClose} aria-label="Close" className="text-ink/40 hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-4">
          <p className="font-sans text-sm text-ink/70">
            Waiving the ${fine.amount.toFixed(2)} {fine.reason} fine. This can't be undone.
          </p>

          <div>
            <label className="mb-1 block font-sans text-sm font-medium text-ink/80">Reason</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="e.g. first-time offense, book returned in good condition after all"
              className="w-full rounded-md border border-moss-200 px-3 py-2 font-sans text-sm focus:border-moss-500 focus:outline-none focus:ring-1 focus:ring-moss-500"
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
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
              className="rounded-md bg-ink px-4 py-2 font-sans text-sm font-medium text-white hover:bg-ink/80"
            >
              Waive fine
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}