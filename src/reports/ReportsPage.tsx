import { useMemo } from "react";
import { BookMarked, Clock, AlertTriangle, TimerReset } from "lucide-react";
import { ReportStatCard } from "./ReportStatCard";
import { TopBooksChart } from "./TopBooksChart";
import { OverdueLoansTable } from "./OverdueLoansTable";
import { getLoanStatus, type CirculationRecord } from "../admin/circulationTypes";
import type { CatalogBook } from "../admin/catalogTypes";

interface ReportsPageProps {
  books: CatalogBook[];
  circulations: CirculationRecord[];
}

export function ReportsPage({ books, circulations }: ReportsPageProps) {
  const stats = useMemo(() => {
    const active = circulations.filter((r) => getLoanStatus(r) === "active").length;
    const overdue = circulations.filter((r) => getLoanStatus(r) === "overdue").length;
    const returned = circulations.filter((r) => getLoanStatus(r) === "returned");

    const avgLoanDays =
      returned.length === 0
        ? 0
        : Math.round(
            returned.reduce((sum, r) => {
              const days =
                (new Date(r.returnedAt!).getTime() - new Date(r.checkedOutAt).getTime()) /
                (1000 * 60 * 60 * 24);
              return sum + days;
            }, 0) / returned.length
          );

    return {
      totalLoans: circulations.length,
      active,
      overdue,
      avgLoanDays,
    };
  }, [circulations]);

  return (
    <div>
      <div className="mb-4">
        <h1 className="font-display text-xl text-ink">Reports</h1>
        <p className="mt-1 font-sans text-sm text-ink/50">
          A snapshot of how your catalog is being used — what's popular and what's overdue.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-moss-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 font-display text-base text-ink">Most read</h2>
          <TopBooksChart books={books} />
        </div>

        <div className="rounded-lg border border-moss-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 font-display text-base text-ink">Overdue loans</h2>
          <OverdueLoansTable records={circulations} />
        </div>
      </div>
    </div>
  );
}