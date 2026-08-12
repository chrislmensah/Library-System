import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { LoanRequest } from "./loanTypes";
import type { CatalogBook } from "../admin/catalogTypes";
import type { LibraryMember } from "../admin/manage/manageTypes";

interface ApproveRequestDialogProps {
  request: LoanRequest | null;
  books: CatalogBook[];
  members: LibraryMember[];
  onClose: () => void;
  onConfirm: (request: LoanRequest, dueDate: string) => void;
}

function twoWeeksFromNow() {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d.toISOString().slice(0, 10);
}

export function ApproveRequestDialog({ request, books, members, onClose, onConfirm }: ApproveRequestDialogProps) {
  const [dueDate, setDueDate] = useState(twoWeeksFromNow());

  useEffect(() => {
    if (request) setDueDate(twoWeeksFromNow());
  }, [request]);

  if (!request) return null;

  const book = books.find((b) => b.id === request.bookId);
  const member = members.find((m) => m.id === request.memberId);
  const noCopiesLeft = book ? book.copiesAvailable <= 0 : true;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
      <div className="w-full max-w-sm rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-moss-200 px-5 py-4">
          <h2 className="font-display text-lg text-ink">Approve request</h2>
          <button onClick={onClose} aria-label="Close" className="text-ink/40 hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-4">
          <p className="font-sans text-sm text-ink/70">
            Checking out <span className="font-medium text-ink">{book?.title ?? "this book"}</span> to{" "}
            <span className="font-medium text-ink">{member?.name ?? "this member"}</span>.
          </p>

          {noCopiesLeft && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 font-sans text-xs text-red-700">
              No copies currently available — approving anyway will over-commit the catalog.
            </p>
          )}

          <div>
            <label className="mb-1 block font-sans text-sm font-medium text-ink/80">Due date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-md border border-moss-200 px-3 py-2 font-sans text-sm focus:border-moss-500 focus:outline-none focus:ring-1 focus:ring-moss-500"
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-moss-100 pt-4">
            <button
              onClick={onClose}
              className="rounded-md px-4 py-2 font-sans text-sm font-medium text-ink/70 hover:bg-ivory-100"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(request, dueDate)}
              className="rounded-md bg-moss-600 px-4 py-2 font-sans text-sm font-medium text-white hover:bg-moss-700"
            >
              Approve & check out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}