import { Undo2, AlertOctagon, BookX } from "lucide-react";
import { getLoanStatusDerived, type Loan } from "./loanTypes";
import type { CatalogBook } from "../admin/catalogTypes";
import type { LibraryMember } from "../admin/manage/manageTypes";

interface LoansTableProps {
  loans: Loan[]; // active + overdue only (not returned/lost)
  books: CatalogBook[];
  members: LibraryMember[];
  onReturn: (loan: Loan) => void;
  onMarkLost: (loan: Loan) => void;
}

const statusStyles: Record<string, string> = {
  active: "border-moss-200 bg-moss-50 text-moss-700",
  overdue: "border-red-200 bg-red-50 text-red-700",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function LoansTable({ loans, books, members, onReturn, onMarkLost }: LoansTableProps) {
  if (loans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
        <BookX className="h-8 w-8 text-ink/30" />
        <p className="font-sans text-sm font-medium text-ink/70">No active loans</p>
        <p className="font-sans text-sm text-ink/40">Books currently checked out will show up here.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-moss-200">
        <thead className="bg-ivory-50">
          <tr>
            <th className="px-4 py-3 text-left font-sans text-xs font-semibold uppercase tracking-wide text-ink/50">
              Book
            </th>
            <th className="px-4 py-3 text-left font-sans text-xs font-semibold uppercase tracking-wide text-ink/50">
              Member
            </th>
            <th className="px-4 py-3 text-left font-sans text-xs font-semibold uppercase tracking-wide text-ink/50">
              Due
            </th>
            <th className="px-4 py-3 text-left font-sans text-xs font-semibold uppercase tracking-wide text-ink/50">
              Status
            </th>
            <th className="px-4 py-3 text-right font-sans text-xs font-semibold uppercase tracking-wide text-ink/50">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-moss-100 bg-white">
          {loans.map((loan) => {
            const status = getLoanStatusDerived(loan);
            const book = books.find((b) => b.id === loan.bookId);
            const member = members.find((m) => m.id === loan.memberId);
            return (
              <tr key={loan.id} className="hover:bg-ivory-50">
                <td className="px-4 py-3 font-sans text-sm font-medium text-ink">
                  {book?.title ?? "Unknown book"}
                </td>
                <td className="px-4 py-3 font-sans text-sm text-ink/70">
                  {member?.name ?? "Unknown member"}
                </td>
                <td className="px-4 py-3 font-sans text-sm text-ink/60">{formatDate(loan.dueDate)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-sans text-xs font-medium ${statusStyles[status]}`}
                  >
                    {status === "overdue" ? "Overdue" : "Active"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-sm">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => onReturn(loan)}
                      className="inline-flex items-center gap-1 font-sans font-medium text-moss-600 hover:text-moss-800"
                    >
                      <Undo2 className="h-4 w-4" />
                      Return
                    </button>
                    <button
                      onClick={() => onMarkLost(loan)}
                      className="inline-flex items-center gap-1 font-sans font-medium text-red-500 hover:text-red-700"
                    >
                      <AlertOctagon className="h-4 w-4" />
                      Lost
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}