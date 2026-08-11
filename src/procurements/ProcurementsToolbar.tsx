import { Search, PackagePlus } from "lucide-react";
import type { ProcurementStatus } from "./procurementTypes";

export type ProcurementStatusFilter = "all" | ProcurementStatus;

interface ProcurementsToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: ProcurementStatusFilter;
  onStatusChange: (value: ProcurementStatusFilter) => void;
  resultCount: number;
  onNewOrder: () => void;
}

export function ProcurementsToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  resultCount,
  onNewOrder,
}: ProcurementsToolbarProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-moss-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title, author, or vendor"
            className="w-full rounded-md border border-moss-200 bg-ivory-50 py-2 pl-9 pr-3 font-sans text-sm text-ink placeholder-ink/40 focus:border-moss-500 focus:outline-none focus:ring-1 focus:ring-moss-500"
          />
        </div>

        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as ProcurementStatusFilter)}
          className="rounded-md border border-moss-200 bg-ivory-50 px-3 py-2 font-sans text-sm text-ink focus:border-moss-500 focus:outline-none focus:ring-1 focus:ring-moss-500"
        >
          <option value="all">All orders</option>
          <option value="requested">Requested</option>
          <option value="ordered">Ordered</option>
          <option value="received">Received</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <span className="font-sans text-sm text-ink/50 sm:ml-1">
          {resultCount} {resultCount === 1 ? "order" : "orders"}
        </span>
      </div>

      <button
        onClick={onNewOrder}
        className="inline-flex items-center justify-center gap-2 rounded-md bg-moss-600 px-4 py-2 font-sans text-sm font-medium text-white transition-colors hover:bg-moss-700 focus:outline-none focus:ring-2 focus:ring-moss-500 focus:ring-offset-1"
      >
        <PackagePlus className="h-4 w-4" />
        New order
      </button>
    </div>
  );
}