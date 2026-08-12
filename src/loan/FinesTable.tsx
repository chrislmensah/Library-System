import { CircleDollarSign, ShieldOff } from "lucide-react";
import type { Fine } from "./loanTypes";
import type { LibraryMember } from "../admin/manage/manageTypes";

interface FinesTableProps {
  fines: Fine[];
  members: LibraryMember[];
  onMarkPaid: (fine: Fine) => void;
  onWaive: (fine: Fine) => void;
}

const statusStyles: Record<Fine["status"], string> = {
  unpaid: "border-red-200 bg-red-50 text-red-700",
  paid: "border-moss-200 bg-moss-50 text-moss-700",
  waived: "border-ink/10 bg-ivory-100 text-ink/50",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function FinesTable({ fines, members, onMarkPaid, onWaive }: FinesTableProps) {
  if (fines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
        <CircleDollarSign className="h-8 w-8 text-ink/30" />
        <p className="font-sans text-sm font-medium text-ink/70">No fines</p>
        <p className="font-sans text-sm text-ink/40">Fines from late returns or lost books will show up here.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-moss-200">
        <thead className="bg-ivory-50">
          <tr>
            <th className="px-4 py-3 text-left font-sans text-xs font-semibold uppercase tracking-wide text-ink/50">
              Member
            </th>
            <th className="px-4 py-3 text-left font-sans text-xs font-semibold uppercase tracking-wide text-ink/50">
              Reason
            </th>
            <th className="px-4 py-3 text-left font-sans text-xs font-semibold uppercase tracking-wide text-ink/50">
              Amount
            </th>
            <th className="px-4 py-3 text-left font-sans text-xs font-semibold uppercase tracking-wide text-ink/50">
              Issued
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
          {fines.map((fine) => {
            const member = members.find((m) => m.id === fine.memberId);
            return (
              <tr key={fine.id} className="hover:bg-ivory-50">
                <td className="px-4 py-3 font-sans text-sm font-medium text-ink">
                  {member?.name ?? "Unknown member"}
                </td>
                <td className="px-4 py-3 font-sans text-sm capitalize text-ink/70">{fine.reason}</td>
                <td className="px-4 py-3 font-sans text-sm text-ink/70">${fine.amount.toFixed(2)}</td>
                <td className="px-4 py-3 font-sans text-sm text-ink/60">{formatDate(fine.issuedAt)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-sans text-xs font-medium capitalize ${statusStyles[fine.status]}`}
                  >
                    {fine.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-sm">
                  {fine.status === "unpaid" && (
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => onMarkPaid(fine)}
                        className="inline-flex items-center gap-1 font-sans font-medium text-moss-600 hover:text-moss-800"
                      >
                        <CircleDollarSign className="h-4 w-4" />
                        Mark paid
                      </button>
                      <button
                        onClick={() => onWaive(fine)}
                        className="inline-flex items-center gap-1 font-sans font-medium text-ink/60 hover:text-ink"
                      >
                        <ShieldOff className="h-4 w-4" />
                        Waive
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}