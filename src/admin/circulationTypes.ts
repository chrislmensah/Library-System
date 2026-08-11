export type LoanStatus = "active" | "overdue" | "returned";

export interface CirculationRecord {
  id: string;
  bookId: string;
  bookTitle: string;
  memberName: string;
  memberEmail: string;
  checkedOutAt: string; // ISO date
  dueDate: string; // ISO date
  returnedAt?: string; // ISO date, absent while still checked out
}

export function getLoanStatus(record: CirculationRecord): LoanStatus {
  if (record.returnedAt) return "returned";
  return new Date(record.dueDate) < new Date() ? "overdue" : "active";
}