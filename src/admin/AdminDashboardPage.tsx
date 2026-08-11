import { Link } from "react-router-dom";
import { BookOpen, Users, RefreshCw, AlertTriangle, FolderOpen, UserPlus, FileText } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface DashboardStats {
  totalBooks: number;
  totalMembers: number;
  activeLoans: number;
  overdueLoans: number;
}

// TODO: replace with real tRPC query once wired up, e.g.:
//   const { data: stats } = trpc.admin.dashboardStats.useQuery();
interface AdminDashboardPageProps {
  stats: DashboardStats;
}

export function AdminDashboardPage({ stats }: AdminDashboardPageProps) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl text-ink">Dashboard</h1>
        <p className="mt-1 font-sans text-sm text-ink/60">
          A quick look at what's happening in your library.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard icon={BookOpen} label="Total Books" value={stats.totalBooks} tone="moss" />
        <StatCard icon={Users} label="Total Members" value={stats.totalMembers} tone="moss" />
        <StatCard icon={RefreshCw} label="Active Loans" value={stats.activeLoans} tone="moss" />
        <StatCard
          icon={AlertTriangle}
          label="Overdue"
          value={stats.overdueLoans}
          tone={stats.overdueLoans > 0 ? "stamp" : "moss"}
        />
      </div>

      <div>
        <h2 className="font-display text-lg text-ink">Quick actions</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <QuickLink to="/dashboard/catalogs" icon={FolderOpen} label="Manage Catalogs" />
          <QuickLink to="/dashboard/circulations" icon={FileText} label="View Circulations" />
          <QuickLink to="/dashboard/procurements" icon={UserPlus} label="Procurements" />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  tone: "moss" | "stamp";
}) {
  return (
    <div className="rounded-lg border border-moss-100 bg-ivory-50 p-4 shadow-sm">
      <div
        className={[
          "flex h-9 w-9 items-center justify-center rounded-full",
          tone === "stamp" ? "bg-stamp-500/10 text-stamp-600" : "bg-moss-100 text-moss-700",
        ].join(" ")}
      >
        <Icon className="h-4 w-4" />
      </div>
      <p className="mt-3 font-display text-2xl text-ink">{value.toLocaleString()}</p>
      <p className="font-sans text-xs text-ink/50">{label}</p>
    </div>
  );
}

function QuickLink({
  to,
  icon: Icon,
  label,
}: {
  to: string;
  icon: LucideIcon;
  label: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-lg border border-moss-100 bg-ivory-50 p-4 font-sans text-sm text-ink shadow-sm transition hover:border-moss-300 hover:bg-moss-50"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-moss-100 text-moss-700">
        <Icon className="h-4 w-4" />
      </div>
      {label}
    </Link>
  );
}