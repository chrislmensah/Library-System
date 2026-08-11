import type { LucideIcon } from "lucide-react";

interface ReportStatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: "default" | "warning";
}

export function ReportStatCard({ label, value, icon: Icon, tone = "default" }: ReportStatCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-moss-200 bg-white p-4 shadow-sm">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
          tone === "warning" ? "bg-red-50 text-red-600" : "bg-moss-50 text-moss-600"
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="font-sans text-xs uppercase tracking-wide text-ink/50">{label}</p>
        <p className="font-display text-xl text-ink">{value}</p>
      </div>
    </div>
  );
}