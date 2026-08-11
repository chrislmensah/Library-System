import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ExternalLink, Compass, Bell, Settings, ChevronDown, LogOut, User } from "lucide-react";

const BREADCRUMB_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  catalogs: "Catalogs",
  circulations: "Circulations",
  procurements: "Procurements",
  reports: "Reports",
  others: "Others",
  manage: "Manage",
  docs: "Documentation",
  support: "Need support",
};

interface AdminTopbarProps {
  libraryName: string;
  onLogOut?: () => void;
}

export function AdminTopbar({ libraryName, onLogOut }: AdminTopbarProps) {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean); // e.g. ["dashboard", "catalogs"]

  return (
    <header className="flex items-center justify-between border-b border-moss-100 bg-ivory-50 px-6 py-3">
      <div>
        <p className="font-sans text-sm text-ink/60">
          <span className="text-ink/40">{libraryName}</span>
        </p>
        <nav aria-label="Breadcrumb" className="mt-0.5 font-sans text-sm">
          {segments.map((seg, i) => {
            const label = BREADCRUMB_LABELS[seg] ?? seg;
            const isLast = i === segments.length - 1;
            return (
              <span key={seg}>
                <span className={isLast ? "font-semibold text-ink" : "text-ink/50"}>{label}</span>
                {!isLast && <span className="mx-1.5 text-ink/30">/</span>}
              </span>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <Link
          to="/discover"
          target="_blank"
          className="flex items-center gap-1.5 font-sans text-sm text-ink/60 hover:text-moss-700"
        >
          <ExternalLink className="h-4 w-4" />
          OPAC
        </Link>
        <Link
          to="/discover"
          className="flex items-center gap-1.5 font-sans text-sm text-ink/60 hover:text-moss-700"
        >
          <Compass className="h-4 w-4" />
          Discover
        </Link>
        <button aria-label="Notifications" className="text-ink/60 hover:text-moss-700">
          <Bell className="h-4 w-4" />
        </button>
        <AdminAccountMenu onLogOut={onLogOut} />
      </div>
    </header>
  );
}

function AdminAccountMenu({ onLogOut }: { onLogOut?: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-1 rounded-full bg-moss-100 px-2 py-1.5 text-moss-700 transition hover:bg-moss-200"
      >
        <User className="h-4 w-4" />
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-44 overflow-hidden rounded-lg border border-moss-100 bg-ivory-50 py-1 shadow-lg"
        >
          <Link
            to="/dashboard/settings"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 font-sans text-sm text-ink transition hover:bg-moss-50"
          >
            <Settings className="h-4 w-4 text-moss-600" />
            Settings
          </Link>
          <button
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onLogOut?.();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 font-sans text-sm text-stamp-600 transition hover:bg-stamp-500/5"
          >
            <LogOut className="h-4 w-4" />
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}