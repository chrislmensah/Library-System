import { useMemo, useState } from "react";
import { CirculationsToolbar, type LoanStatusFilter } from "./CirculationsToolbar";
import { CirculationsTable } from "./CirculationsTable";
import { CheckOutBookDialog, type CheckOutFormValues } from "./CheckOutBookDialog";
import { type CirculationRecord, getLoanStatus } from "./circulationTypes";
import type { CatalogBook } from "./catalogTypes";

interface CirculationsPageProps {
  initialRecords: CirculationRecord[];
  catalogBooks: CatalogBook[]; // used to populate the "check out" book picker
}

export function CirculationsPage({ initialRecords, catalogBooks }: CirculationsPageProps) {
  const [records, setRecords] = useState<CirculationRecord[]>(initialRecords);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<LoanStatusFilter>("all");
  const [checkOutOpen, setCheckOutOpen] = useState(false);

  const availableBooks = useMemo(
    () => catalogBooks.filter((b) => b.copiesAvailable > 0),
    [catalogBooks]
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return records.filter((r) => {
      const matchesSearch =
        !term ||
        r.bookTitle.toLowerCase().includes(term) ||
        r.memberName.toLowerCase().includes(term) ||
        r.memberEmail.toLowerCase().includes(term);
      const matchesStatus = status === "all" || getLoanStatus(r) === status;
      return matchesSearch && matchesStatus;
    });
  }, [records, search, status]);

  const handleReturn = (record: CirculationRecord) => {
    // TODO: replace with real tRPC mutation — should also increment copiesAvailable on the book
    setRecords((prev) =>
      prev.map((r) => (r.id === record.id ? { ...r, returnedAt: new Date().toISOString() } : r))
    );
  };

  const handleCheckOut = (values: CheckOutFormValues) => {
    // TODO: replace with real tRPC mutation — should also decrement copiesAvailable on the book
    const book = catalogBooks.find((b) => b.id === values.bookId);
    if (!book) return;

    const newRecord: CirculationRecord = {
      id: crypto.randomUUID(),
      bookId: book.id,
      bookTitle: book.title,
      memberName: values.memberName,
      memberEmail: values.memberEmail,
      checkedOutAt: new Date().toISOString(),
      dueDate: new Date(values.dueDate).toISOString(),
    };
    setRecords((prev) => [newRecord, ...prev]);
    setCheckOutOpen(false);
  };

  return (
    <div>
      <div className="mb-4">
        <h1 className="font-display text-xl text-ink">Circulations</h1>
        <p className="mt-1 font-sans text-sm text-ink/50">
          Track which books are checked out, to whom, and when they're due back.
        </p>
      </div>

      <div className="rounded-lg border border-moss-200 bg-white shadow-sm">
        <CirculationsToolbar
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
          resultCount={filtered.length}
          onCheckOut={() => setCheckOutOpen(true)}
        />
        <CirculationsTable records={filtered} onReturn={handleReturn} />
      </div>

      <CheckOutBookDialog
        open={checkOutOpen}
        availableBooks={availableBooks}
        onClose={() => setCheckOutOpen(false)}
        onSubmit={handleCheckOut}
      />
    </div>
  );
}