// ---------------------------------------------------------------------------
// Loan workflow entities, per the Loaning Workflow plan.
//
// Note on `CirculationRecord` (in circulationTypes.ts): that type maps
// conceptually onto `Loan` below. It's kept as-is for now since CirculationsPage
// still consumes it — migrating that page to `Loan` is a separate step.
// ---------------------------------------------------------------------------

export type LoanRequestStatus = "pending" | "approved" | "denied" | "cancelled";

export interface LoanRequest {
  id: string;
  libraryId: string;
  bookId: string;
  memberId: string;
  requestedAt: string; // ISO date
  status: LoanRequestStatus;
  decidedBy: string | null; // staff user id, null while pending
  decidedAt: string | null; // ISO date, null while pending
}

export type LoanStatus = "active" | "returned" | "overdue" | "lost";

export interface Loan {
  id: string;
  libraryId: string;
  bookId: string;
  memberId: string;
  loanRequestId: string | null; // null when staff checked the book out directly
  checkedOutAt: string; // ISO date
  checkedOutBy: string; // staff user id
  dueDate: string; // ISO date
  returnedAt: string | null; // null while the loan is active
  returnedTo: string | null; // staff user id, null until returned
  status: LoanStatus;
}

/**
 * `Loan.status` of "overdue" is derived, not stored — this mirrors what
 * getLoanStatus() already does for CirculationRecord. Only "active"/"overdue"
 * need deriving; "returned" and "lost" are set directly by staff actions.
 */
export function getLoanStatusDerived(loan: Pick<Loan, "status" | "dueDate">): LoanStatus {
  if (loan.status === "returned" || loan.status === "lost") return loan.status;
  return new Date(loan.dueDate) < new Date() ? "overdue" : "active";
}

export type FineReason = "overdue" | "lost";
export type FineStatus = "unpaid" | "paid" | "waived";

export interface Fine {
  id: string;
  libraryId: string;
  loanId: string;
  memberId: string;
  amount: number;
  reason: FineReason;
  status: FineStatus;
  issuedAt: string; // ISO date
  resolvedAt: string | null; // null while unpaid
  resolvedBy: string | null; // staff user id, null until resolved
  waivedReason?: string; // only set if status is "waived"
}

export type LostBookFineMode = "flat" | "replacement_cost";

export interface LibrarySettings {
  libraryId: string;
  finePerDay: number; // e.g. 0.50
  finePerDayCurrency: string; // e.g. "GHS"
  gracePeriodDays: number; // days after due date before a fine starts accruing, default 0
  maxFineAmount?: number; // cap per loan, optional
  lostBookFineMode: LostBookFineMode;
  lostBookFlatFee?: number; // used if lostBookFineMode is "flat"
}

/**
 * daysLate = max(0, (returnedAt - dueDate, in days) - gracePeriodDays)
 * fineAmount = min(daysLate * finePerDay, maxFineAmount)
 */
export function calculateOverdueFine(
  dueDate: string,
  returnedAt: string,
  settings: Pick<LibrarySettings, "finePerDay" | "gracePeriodDays" | "maxFineAmount">
): number {
  const rawDaysLate = Math.max(
    0,
    (new Date(returnedAt).getTime() - new Date(dueDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  const daysLate = Math.max(0, Math.floor(rawDaysLate) - settings.gracePeriodDays);
  const amount = daysLate * settings.finePerDay;
  return settings.maxFineAmount != null ? Math.min(amount, settings.maxFineAmount) : amount;
}

export function calculateLostBookFine(
  settings: Pick<LibrarySettings, "lostBookFineMode" | "lostBookFlatFee">,
  replacementCost?: number
): number {
  if (settings.lostBookFineMode === "flat") return settings.lostBookFlatFee ?? 0;
  return replacementCost ?? 0;
}