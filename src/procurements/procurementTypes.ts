export type ProcurementStatus = "requested" | "ordered" | "received" | "cancelled";

export interface ProcurementOrder {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  quantity: number;
  vendor: string;
  costPerCopy?: number;
  status: ProcurementStatus;
  requestedBy: string;
  requestedAt: string; // ISO date
  expectedDate?: string; // ISO date
}

export type ProcurementFormValues = Pick<
  ProcurementOrder,
  "title" | "author" | "isbn" | "quantity" | "vendor" | "costPerCopy" | "expectedDate"
>;