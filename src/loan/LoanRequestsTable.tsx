import { Check, X as XIcon, Inbox } from "lucide-react";
import type { LoanRequest } from "./loanTypes";
import type { CatalogBook } from "../admin/catalogTypes";
import type { LibraryMember } from "../admin/manage/manageTypes";

interface LoanRequestsTableProps {
  requests: LoanRequest[]; // pending only
  books: CatalogBook[];
  members: LibraryMember[];
  onApprove: (request: LoanRequest) => void;
  onDeny: (request: LoanRequest) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function LoanRequestsTable({ requests, books, members, onApprove, onDeny }: LoanRequestsTableProps) {
  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
        <Inbox className="h-8 w-8 text-ink/30" />
        <p className="font-sans text-sm font-medium text-ink/70">No pending requests</p>
        <p className="font-sans text-sm text-ink/40">New borrow requests from members will show up here.</p>
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
              Requested
            </th>
            <th className="px-4 py-3 text-right font-sans text-xs font-semibold uppercase tracking-wide text-ink/50">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-moss-100 bg-white">
          {requests.map((req) => {
            const book = books.find((b) => b.id === req.bookId);
            const member = members.find((m) => m.id === req.memberId);
            return (
              <tr key={req.id} className="hover:bg-ivory-50">
                <td className="px-4 py-3 font-sans text-sm font-medium text-ink">
                  {book?.title ?? "Unknown book"}
                </td>
                <td className="px-4 py-3 font-sans text-sm text-ink/70">
                  {member?.name ?? "Unknown member"}
                </td>
                <td className="px-4 py-3 font-sans text-sm text-ink/60">{formatDate(req.requestedAt)}</td>
                <td className="px-4 py-3 text-right text-sm">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => onApprove(req)}
                      className="inline-flex items-center gap-1 font-sans font-medium text-moss-600 hover:text-moss-800"
                    >
                      <Check className="h-4 w-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => onDeny(req)}
                      className="inline-flex items-center gap-1 font-sans font-medium text-red-500 hover:text-red-700"
                    >
                      <XIcon className="h-4 w-4" />
                      Deny
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