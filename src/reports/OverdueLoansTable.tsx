import { getLoanStatusDerived, type Loan } from "../loan/loanTypes";
import type { CatalogBook } from "../admin/catalogTypes";
import type { LibraryMember } from "../admin/manage/manageTypes";

interface OverdueLoansTableProps {
  loans: Loan[];
  books: CatalogBook[];
  members: LibraryMember[];
}

function daysOverdue(dueDate: string) {
  const ms = Date.now() - new Date(dueDate).getTime();
  return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

export function OverdueLoansTable({ loans, books, members }: OverdueLoansTableProps) {
  const overdue = loans
    .filter((l) => getLoanStatusDerived(l) === "overdue")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  if (overdue.length === 0) {
    return <p className="font-sans text-sm text-ink/40">No overdue loans right now.</p>;
  }

  return (
    <table className="min-w-full divide-y divide-moss-100">
      <thead>
        <tr>
          <th className="py-2 text-left font-sans text-xs font-semibold uppercase tracking-wide text-ink/50">
            Book
          </th>
          <th className="py-2 text-left font-sans text-xs font-semibold uppercase tracking-wide text-ink/50">
            Member
          </th>
          <th className="py-2 text-right font-sans text-xs font-semibold uppercase tracking-wide text-ink/50">
            Days overdue
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-moss-50">
        {overdue.map((loan) => {
          const book = books.find((b) => b.id === loan.bookId);
          const member = members.find((m) => m.id === loan.memberId);
          return (
            <tr key={loan.id}>
              <td className="py-2 font-sans text-sm text-ink">{book?.title ?? "Unknown book"}</td>
              <td className="py-2 font-sans text-sm text-ink/60">{member?.name ?? "Unknown member"}</td>
              <td className="py-2 text-right font-sans text-sm font-medium text-red-600">
                {daysOverdue(loan.dueDate)}d
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}