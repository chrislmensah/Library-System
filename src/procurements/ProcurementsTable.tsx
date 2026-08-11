import { ArrowRight, Ban, PackageX } from "lucide-react";
import type { ProcurementOrder, ProcurementStatus } from "./procurementTypes";

interface ProcurementsTableProps {
  orders: ProcurementOrder[];
  onAdvance: (order: ProcurementOrder) => void;
  onCancel: (order: ProcurementOrder) => void;
}

const statusStyles: Record<ProcurementStatus, string> = {
  requested: "border-ink/10 bg-ivory-100 text-ink/60",
  ordered: "border-blue-200 bg-blue-50 text-blue-700",
  received: "border-moss-200 bg-moss-50 text-moss-700",
  cancelled: "border-red-200 bg-red-50 text-red-700",
};

const statusLabels: Record<ProcurementStatus, string> = {
  requested: "Requested",
  ordered: "Ordered",
  received: "Received",
  cancelled: "Cancelled",
};

// What clicking "advance" does at each stage
const nextStepLabel: Partial<Record<ProcurementStatus, string>> = {
  requested: "Mark ordered",
  ordered: "Mark received",
};

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function ProcurementsTable({ orders, onAdvance, onCancel }: ProcurementsTableProps) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
        <PackageX className="h-8 w-8 text-ink/30" />
        <p className="font-sans text-sm font-medium text-ink/70">No orders match your filters</p>
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
              Title
            </th>
            <th className="px-4 py-3 text-left font-sans text-xs font-semibold uppercase tracking-wide text-ink/50">
              Vendor
            </th>
            <th className="px-4 py-3 text-left font-sans text-xs font-semibold uppercase tracking-wide text-ink/50">
              Qty
            </th>
            <th className="px-4 py-3 text-left font-sans text-xs font-semibold uppercase tracking-wide text-ink/50">
              Cost
            </th>
            <th className="px-4 py-3 text-left font-sans text-xs font-semibold uppercase tracking-wide text-ink/50">
              Expected
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
          {orders.map((order) => {
            const advanceLabel = nextStepLabel[order.status];
            const canCancel = order.status === "requested" || order.status === "ordered";
            const totalCost =
              order.costPerCopy != null ? (order.costPerCopy * order.quantity).toFixed(2) : null;

            return (
              <tr key={order.id} className="hover:bg-ivory-50">
                <td className="px-4 py-3">
                  <div className="font-sans text-sm font-medium text-ink">{order.title}</div>
                  <div className="font-sans text-xs text-ink/40">{order.author}</div>
                </td>
                <td className="px-4 py-3 font-sans text-sm text-ink/70">{order.vendor}</td>
                <td className="px-4 py-3 font-sans text-sm text-ink/70">{order.quantity}</td>
                <td className="px-4 py-3 font-sans text-sm text-ink/70">
                  {totalCost ? `$${totalCost}` : "—"}
                </td>
                <td className="px-4 py-3 font-sans text-sm text-ink/60">{formatDate(order.expectedDate)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-sans text-xs font-medium ${statusStyles[order.status]}`}
                  >
                    {statusLabels[order.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-sm">
                  <div className="flex items-center justify-end gap-3">
                    {advanceLabel && (
                      <button
                        onClick={() => onAdvance(order)}
                        className="inline-flex items-center gap-1 font-sans font-medium text-moss-600 hover:text-moss-800"
                      >
                        {advanceLabel}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                    {canCancel && (
                      <button
                        onClick={() => onCancel(order)}
                        aria-label={`Cancel order for ${order.title}`}
                        className="inline-flex items-center text-red-500 hover:text-red-700"
                      >
                        <Ban className="h-4 w-4" />
                      </button>
                    )}
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