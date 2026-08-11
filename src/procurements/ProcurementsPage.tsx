import { useMemo, useState } from "react";
import { ProcurementsToolbar, type ProcurementStatusFilter } from "./ProcurementsToolbar";
import { ProcurementsTable } from "./ProcurementsTable";
import { NewOrderDialog } from "./NewOrderDialog";
import { RemoveConfirmDialog } from "../admin/manage/RemoveConfirmDialog";
import type { ProcurementOrder, ProcurementFormValues } from "./procurementTypes";

interface ProcurementsPageProps {
  initialOrders: ProcurementOrder[];
  requestedBy: string; // current staff member's name, attached to new orders
}

// Moves an order to its next status: requested -> ordered -> received
function advanceStatus(status: ProcurementOrder["status"]): ProcurementOrder["status"] {
  if (status === "requested") return "ordered";
  if (status === "ordered") return "received";
  return status;
}

export function ProcurementsPage({ initialOrders, requestedBy }: ProcurementsPageProps) {
  const [orders, setOrders] = useState<ProcurementOrder[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ProcurementStatusFilter>("all");
  const [newOrderOpen, setNewOrderOpen] = useState(false);
  const [cancellingOrder, setCancellingOrder] = useState<ProcurementOrder | null>(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return orders.filter((o) => {
      const matchesSearch =
        !term ||
        o.title.toLowerCase().includes(term) ||
        o.author.toLowerCase().includes(term) ||
        o.vendor.toLowerCase().includes(term);
      const matchesStatus = status === "all" || o.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, status]);

  const handlePlaceOrder = (values: ProcurementFormValues) => {
    // TODO: replace with real tRPC mutation once wired up
    const newOrder: ProcurementOrder = {
      id: crypto.randomUUID(),
      ...values,
      status: "requested",
      requestedBy,
      requestedAt: new Date().toISOString(),
    };
    setOrders((prev) => [newOrder, ...prev]);
    setNewOrderOpen(false);
  };

  const handleAdvance = (order: ProcurementOrder) => {
    // TODO: replace with real tRPC mutation — marking "received" should also
    // add the copies to the matching catalog book (or create a new one)
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, status: advanceStatus(o.status) } : o))
    );
  };

  const handleCancelConfirmed = () => {
    if (!cancellingOrder) return;
    // TODO: replace with real tRPC mutation once wired up
    setOrders((prev) =>
      prev.map((o) => (o.id === cancellingOrder.id ? { ...o, status: "cancelled" } : o))
    );
    setCancellingOrder(null);
  };

  return (
    <div>
      <div className="mb-4">
        <h1 className="font-display text-xl text-ink">Procurements</h1>
        <p className="mt-1 font-sans text-sm text-ink/50">
          Order new titles or additional copies, and track them from request through delivery.
        </p>
      </div>

      <div className="rounded-lg border border-moss-200 bg-white shadow-sm">
        <ProcurementsToolbar
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
          resultCount={filtered.length}
          onNewOrder={() => setNewOrderOpen(true)}
        />
        <ProcurementsTable orders={filtered} onAdvance={handleAdvance} onCancel={setCancellingOrder} />
      </div>

      <NewOrderDialog open={newOrderOpen} onClose={() => setNewOrderOpen(false)} onSubmit={handlePlaceOrder} />

      <RemoveConfirmDialog
        open={cancellingOrder !== null}
        title="Cancel this order?"
        description={`The order for "${cancellingOrder?.title ?? ""}" will be marked as cancelled.`}
        confirmLabel="Cancel order"
        onCancel={() => setCancellingOrder(null)}
        onConfirm={handleCancelConfirmed}
      />
    </div>
  );
}