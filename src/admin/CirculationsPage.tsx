import { useMemo, useState } from "react";
import { Inbox, BookMarked, CircleDollarSign, BookPlus } from "lucide-react";
import { LoanRequestsTable } from "../loan/LoanRequestsTable";
import { ApproveRequestDialog } from "../loan/ApproveRequestDialog";
import { LoansTable } from "../loan/LoansTable";
import { StartLoanDialog, type StartLoanFormValues } from "../loan/StartLoanDialog";
import { FinesTable } from "../loan/FinesTable";
import { WaiveFineDialog } from "../loan/WaiveFineDialog";
import { RemoveConfirmDialog } from "../admin/manage/RemoveConfirmDialog";
import {
  getLoanStatusDerived,
  calculateOverdueFine,
  calculateLostBookFine,
  type LoanRequest,
  type Loan,
  type Fine,
  type LibrarySettings,
} from "../loan/loanTypes";
import type { CatalogBook } from "./catalogTypes";
import type { LibraryMember } from "../admin/manage/manageTypes";

interface CirculationsPageProps {
  initialRequests: LoanRequest[];
  initialLoans: Loan[];
  initialFines: Fine[];
  books: CatalogBook[];
  members: LibraryMember[];
  librarySettings: LibrarySettings;
  currentStaffId: string;
}

type Tab = "requests" | "loans" | "fines";

export function CirculationsPage({
  initialRequests,
  initialLoans,
  initialFines,
  books,
  members,
  librarySettings,
  currentStaffId,
}: CirculationsPageProps) {
  const [tab, setTab] = useState<Tab>("requests");

  const [requests, setRequests] = useState<LoanRequest[]>(initialRequests);
  const [loans, setLoans] = useState<Loan[]>(initialLoans);
  const [fines, setFines] = useState<Fine[]>(initialFines);

  const [approving, setApproving] = useState<LoanRequest | null>(null);
  const [denying, setDenying] = useState<LoanRequest | null>(null);
  const [startLoanOpen, setStartLoanOpen] = useState(false);
  const [markingLost, setMarkingLost] = useState<Loan | null>(null);
  const [waivingFine, setWaivingFine] = useState<Fine | null>(null);

  const pendingRequests = useMemo(() => requests.filter((r) => r.status === "pending"), [requests]);
  const openLoans = useMemo(
    () => loans.filter((l) => l.status !== "returned" && l.status !== "lost"),
    [loans]
  );
  const availableBooks = useMemo(() => books.filter((b) => b.copiesAvailable > 0), [books]);

  // --- Requests -----------------------------------------------------------

  const handleApproveConfirmed = (request: LoanRequest, dueDate: string) => {
    // TODO: replace with real tRPC mutation once wired up.
    // Should also decrement copiesAvailable on the matching catalog book.
    const now = new Date().toISOString();
    setRequests((prev) =>
      prev.map((r) => (r.id === request.id ? { ...r, status: "approved", decidedBy: currentStaffId, decidedAt: now } : r))
    );
    const newLoan: Loan = {
      id: crypto.randomUUID(),
      libraryId: request.libraryId,
      bookId: request.bookId,
      memberId: request.memberId,
      loanRequestId: request.id,
      checkedOutAt: now,
      checkedOutBy: currentStaffId,
      dueDate: new Date(dueDate).toISOString(),
      returnedAt: null,
      returnedTo: null,
      status: "active",
    };
    setLoans((prev) => [newLoan, ...prev]);
    setApproving(null);
  };

  const handleDenyConfirmed = () => {
    if (!denying) return;
    // TODO: replace with real tRPC mutation once wired up
    setRequests((prev) =>
      prev.map((r) =>
        r.id === denying.id ? { ...r, status: "denied", decidedBy: currentStaffId, decidedAt: new Date().toISOString() } : r
      )
    );
    setDenying(null);
  };

  // --- Loans ----------------------------------------------------------------

  const handleStartLoan = (values: StartLoanFormValues) => {
    // TODO: replace with real tRPC mutation — should also decrement copiesAvailable
    const newLoan: Loan = {
      id: crypto.randomUUID(),
      libraryId: librarySettings.libraryId,
      bookId: values.bookId,
      memberId: values.memberId,
      loanRequestId: null, // walk-in checkout, no prior request
      checkedOutAt: new Date().toISOString(),
      checkedOutBy: currentStaffId,
      dueDate: new Date(values.dueDate).toISOString(),
      returnedAt: null,
      returnedTo: null,
      status: "active",
    };
    setLoans((prev) => [newLoan, ...prev]);
    setStartLoanOpen(false);
  };

  const handleReturn = (loan: Loan) => {
    // TODO: replace with real tRPC mutation — should also increment copiesAvailable
    const now = new Date().toISOString();
    setLoans((prev) =>
      prev.map((l) => (l.id === loan.id ? { ...l, returnedAt: now, returnedTo: currentStaffId, status: "returned" } : l))
    );

    // A fine is only created here, at the point of return — not when the loan
    // first became overdue — since the amount depends on how late it actually was.
    const wasOverdue = getLoanStatusDerived(loan) === "overdue";
    if (wasOverdue) {
      const amount = calculateOverdueFine(loan.dueDate, now, librarySettings);
      if (amount > 0) {
        const newFine: Fine = {
          id: crypto.randomUUID(),
          libraryId: loan.libraryId,
          loanId: loan.id,
          memberId: loan.memberId,
          amount,
          reason: "overdue",
          status: "unpaid",
          issuedAt: now,
          resolvedAt: null,
          resolvedBy: null,
        };
        setFines((prev) => [newFine, ...prev]);
      }
    }
  };

  const handleMarkLostConfirmed = () => {
    if (!markingLost) return;
    // TODO: replace with real tRPC mutation once wired up
    const now = new Date().toISOString();
    setLoans((prev) => prev.map((l) => (l.id === markingLost.id ? { ...l, status: "lost" } : l)));

    const amount = calculateLostBookFine(librarySettings);
    const newFine: Fine = {
      id: crypto.randomUUID(),
      libraryId: markingLost.libraryId,
      loanId: markingLost.id,
      memberId: markingLost.memberId,
      amount,
      reason: "lost",
      status: "unpaid",
      issuedAt: now,
      resolvedAt: null,
      resolvedBy: null,
    };
    setFines((prev) => [newFine, ...prev]);
    setMarkingLost(null);
  };

  // --- Fines ------------------------------------------------------------

  const handleMarkPaid = (fine: Fine) => {
    // TODO: replace with real tRPC mutation once wired up
    setFines((prev) =>
      prev.map((f) =>
        f.id === fine.id ? { ...f, status: "paid", resolvedAt: new Date().toISOString(), resolvedBy: currentStaffId } : f
      )
    );
  };

  const handleWaiveConfirmed = (fine: Fine, reason: string) => {
    // TODO: replace with real tRPC mutation once wired up
    setFines((prev) =>
      prev.map((f) =>
        f.id === fine.id
          ? {
              ...f,
              status: "waived",
              resolvedAt: new Date().toISOString(),
              resolvedBy: currentStaffId,
              waivedReason: reason,
            }
          : f
      )
    );
    setWaivingFine(null);
  };

  const unpaidFinesCount = fines.filter((f) => f.status === "unpaid").length;

  return (
    <div>
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h1 className="font-display text-xl text-ink">Circulations</h1>
          <p className="mt-1 font-sans text-sm text-ink/50">
            Approve borrow requests, track active loans, and manage fines.
          </p>
        </div>
        <button
          onClick={() => setStartLoanOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-moss-600 px-4 py-2 font-sans text-sm font-medium text-white transition-colors hover:bg-moss-700 focus:outline-none focus:ring-2 focus:ring-moss-500 focus:ring-offset-1"
        >
          <BookPlus className="h-4 w-4" />
          Check out a book
        </button>
      </div>

      <div className="mb-4 flex gap-1 border-b border-moss-200">
        <button
          onClick={() => setTab("requests")}
          className={`inline-flex items-center gap-1.5 border-b-2 px-4 py-2 font-sans text-sm font-medium ${
            tab === "requests" ? "border-moss-600 text-moss-700" : "border-transparent text-ink/50 hover:text-ink"
          }`}
        >
          <Inbox className="h-3.5 w-3.5" />
          Requests ({pendingRequests.length})
        </button>
        <button
          onClick={() => setTab("loans")}
          className={`inline-flex items-center gap-1.5 border-b-2 px-4 py-2 font-sans text-sm font-medium ${
            tab === "loans" ? "border-moss-600 text-moss-700" : "border-transparent text-ink/50 hover:text-ink"
          }`}
        >
          <BookMarked className="h-3.5 w-3.5" />
          Active loans ({openLoans.length})
        </button>
        <button
          onClick={() => setTab("fines")}
          className={`inline-flex items-center gap-1.5 border-b-2 px-4 py-2 font-sans text-sm font-medium ${
            tab === "fines" ? "border-moss-600 text-moss-700" : "border-transparent text-ink/50 hover:text-ink"
          }`}
        >
          <CircleDollarSign className="h-3.5 w-3.5" />
          Fines ({unpaidFinesCount})
        </button>
      </div>

      <div className="rounded-lg border border-moss-200 bg-white shadow-sm">
        {tab === "requests" && (
          <LoanRequestsTable
            requests={pendingRequests}
            books={books}
            members={members}
            onApprove={setApproving}
            onDeny={setDenying}
          />
        )}
        {tab === "loans" && (
          <LoansTable loans={openLoans} books={books} members={members} onReturn={handleReturn} onMarkLost={setMarkingLost} />
        )}
        {tab === "fines" && (
          <FinesTable fines={fines} members={members} onMarkPaid={handleMarkPaid} onWaive={setWaivingFine} />
        )}
      </div>

      <ApproveRequestDialog
        request={approving}
        books={books}
        members={members}
        onClose={() => setApproving(null)}
        onConfirm={handleApproveConfirmed}
      />

      <RemoveConfirmDialog
        open={denying !== null}
        title="Deny this request?"
        description="The member will be notified their request was denied."
        confirmLabel="Deny request"
        onCancel={() => setDenying(null)}
        onConfirm={handleDenyConfirmed}
      />

      <StartLoanDialog
        open={startLoanOpen}
        availableBooks={availableBooks}
        members={members}
        onClose={() => setStartLoanOpen(false)}
        onSubmit={handleStartLoan}
      />

      <RemoveConfirmDialog
        open={markingLost !== null}
        title="Mark this book as lost?"
        description={`A ${librarySettings.lostBookFineMode === "flat" ? `$${librarySettings.lostBookFlatFee?.toFixed(2)}` : "replacement-cost"} fine will be issued to the member.`}
        confirmLabel="Mark lost"
        onCancel={() => setMarkingLost(null)}
        onConfirm={handleMarkLostConfirmed}
      />

      <WaiveFineDialog fine={waivingFine} onClose={() => setWaivingFine(null)} onConfirm={handleWaiveConfirmed} />
    </div>
  );
}