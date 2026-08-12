import { useMemo } from "react";
import { BookMarked, Clock, AlertTriangle, TimerReset, CircleDollarSign } from "lucide-react";
import { ReportStatCard } from "./ReportStatCard";
import { TopBooksChart } from "./TopBooksChart";
import { OverdueLoansTable } from "./OverdueLoansTable";
import { getLoanStatusDerived, type Loan, type Fine } from "../loan/loanTypes";
import type { CatalogBook } from "../admin/catalogTypes";
import type { LibraryMember } from "../admin/manage/manageTypes";

interface ReportsPageProps {
  books: CatalogBook[];
  loans: Loan[];
  fines: Fine[];
  members: LibraryMember[];
}

export function ReportsPage({ books, loans, fines, members }: ReportsPageProps) {
  const stats = useMemo(() => {
    const active = loans.filter((l) => getLoanStatusDerived(l) === "active").length;
    const overdue = loans.filter((l) => getLoanStatusDerived(l) === "overdue").length;
    const returned = loans.filter((l) => l.status === "returned");
    const unpaidFines = fines.filter((f) => f.status === "unpaid");

    const avgLoanDays =
      returned.length === 0
        ? 0
        : Math.round(
            returned.reduce((sum, l) => {
              const days =
                (new Date(l.returnedAt!).getTime() - new Date(l.checkedOutAt).getTime()) /
                (1000 * 60 * 60 * 24);
              return sum + days;
            }, 0) / returned.length
          );

    return {
      totalLoans: loans.length,
      active,
      overdue,
      avgLoanDays,
      unpaidFinesTotal: unpaidFines.reduce((sum, f) => sum + f.amount, 0),
    };
  }, [loans, fines]);

  return (
    <div>
      <div className="mb-4">
        <h1 className="font-display text-xl text-ink">Reports</h1>
        <p className="mt-1 font-sans text-sm text-ink/50">
          A snapshot of how your catalog is being used — what's popular and what's overdue.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <ReportStatCard label="Total loans" value={stats.totalLoans} icon={BookMarked} />
        <ReportStatCard label="Active loans" value={stats.active} icon={Clock} />
        <ReportStatCard
          label="Overdue loans"
          value={stats.overdue}
          icon={AlertTriangle}
          tone={stats.overdue > 0 ? "warning" : "default"}
        />
        <ReportStatCard
          label="Avg. loan length"
          value={stats.avgLoanDays > 0 ? `${stats.avgLoanDays}d` : "—"}
          icon={TimerReset}
        />
        <ReportStatCard
          label="Unpaid fines"
          value={`$${stats.unpaidFinesTotal.toFixed(2)}`}
          icon={CircleDollarSign}
          tone={stats.unpaidFinesTotal > 0 ? "warning" : "default"}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-moss-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 font-display text-base text-ink">Most read</h2>
          <TopBooksChart books={books} />
        </div>

        <div className="rounded-lg border border-moss-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 font-display text-base text-ink">Overdue loans</h2>
          <OverdueLoansTable loans={loans} books={books} members={members} />
        </div>
      </div>
    </div>
  );
}