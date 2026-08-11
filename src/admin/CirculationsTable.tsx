import { Undo2, BookX } from "lucide-react";
import { type CirculationRecord, getLoanStatus } from "./circulationTypes";

interface CirculationsTableProps {
  records: CirculationRecord[];
  onReturn: (record: CirculationRecord) => void;
}

const statusStyles: Record<string, string> = {
  active: "border-moss-200 bg-moss-50 text-moss-700",
  overdue: "border-red-200 bg-red-50 text-red-700",
  returned: "border-ink/10 bg-ivory-100 text-ink/50",
};

const statusLabels: Record<string, string> = {
  active: "Active",
  overdue: "Overdue",
  returned: "Returned",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function CirculationsTable({ records, onReturn }: CirculationsTableProps) {
  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
        <BookX className="h-8 w-8 text-ink/30" />
        <p className="font-sans text-sm font-medium text-ink/70">No loans match your filters</p>
        <p className="font-sans text-sm text-ink/40">Try a different search term or clear your filters.</p>
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
              Checked out
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
          {records.map((record) => {
            const status = getLoanStatus(record);
            return (
              <tr key={record.id} className="hover:bg-ivory-50">
                <td className="px-4 py-3 font-sans text-sm font-medium text-ink">{record.bookTitle}</td>
                <td className="px-4 py-3 font-sans text-sm text-ink/70">
                  <div>{record.memberName}</div>
                  <div className="text-xs text-ink/40">{record.memberEmail}</div>
                </td>
                <td className="px-4 py-3 font-sans text-sm text-ink/60">{formatDate(record.checkedOutAt)}</td>
                <td className="px-4 py-3 font-sans text-sm text-ink/60">{formatDate(record.dueDate)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-sans text-xs font-medium ${statusStyles[status]}`}
                  >
                    {statusLabels[status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-sm">
                  {status !== "returned" && (
                    <button
                      onClick={() => onReturn(record)}
                      className="inline-flex items-center gap-1 font-sans font-medium text-moss-600 hover:text-moss-800"
                    >
                      <Undo2 className="h-4 w-4" />
                      Mark returned
                    </button>
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