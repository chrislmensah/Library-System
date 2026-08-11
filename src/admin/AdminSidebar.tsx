import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  UserPlus,
  BarChart3,
  MoreHorizontal,
  Wrench,
  BookOpen,
  LifeBuoy,
  type LucideIcon,
} from "lucide-react";

interface SidebarItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

const NAVIGATION: SidebarItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Catalogs", to: "/dashboard/catalogs", icon: FolderOpen },
  { label: "Circulations", to: "/dashboard/circulations", icon: FileText },
  { label: "Procurements", to: "/dashboard/procurements", icon: UserPlus },
  { label: "Reports", to: "/dashboard/reports", icon: BarChart3 },
  { label: "Others", to: "/dashboard/others", icon: MoreHorizontal },
  { label: "Manage", to: "/dashboard/manage", icon: Wrench },
];

const SUPPORT: SidebarItem[] = [
  { label: "Documentation", to: "/dashboard/docs", icon: BookOpen },
  { label: "Need support", to: "/dashboard/support", icon: LifeBuoy },
];

interface AdminSidebarProps {
  libraryName: string;
}

export function AdminSidebar({ libraryName }: AdminSidebarProps) {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col bg-moss-900 text-ivory-100/80">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-ivory-50/10">
          <BookOpen className="h-4 w-4 text-ivory-50" />
        </div>
        <span className="font-display text-base text-ivory-50">{libraryName}</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3">
        <SectionLabel>Navigation</SectionLabel>
        <ul className="flex flex-col gap-0.5">
          {NAVIGATION.map((item) => (
            <SidebarLink key={item.to} {...item} end={item.to === "/dashboard"} />
          ))}
        </ul>

        <SectionLabel>Support</SectionLabel>
        <ul className="flex flex-col gap-0.5 pb-4">
          {SUPPORT.map((item) => (
            <SidebarLink key={item.to} {...item} />
          ))}
        </ul>
      </nav>
    </aside>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-2 pb-2 pt-4 font-sans text-[11px] font-semibold uppercase tracking-wide text-ivory-100/40">
      {children}
    </p>
  );
}

function SidebarLink({
  label,
  to,
  icon: Icon,
  end,
}: SidebarItem & { end?: boolean }) {
  return (
    <li>
      <NavLink
        to={to}
        end={end}
        className={({ isActive }) =>
          [
            "flex items-center gap-2.5 rounded px-2.5 py-2 font-sans text-sm transition",
            isActive
              ? "border-l-2 border-stamp-500 bg-ivory-50/10 pl-2 text-ivory-50"
              : "text-ivory-100/70 hover:bg-ivory-50/5 hover:text-ivory-50",
          ].join(" ")
        }
      >
        <Icon className="h-4 w-4 shrink-0" />
        {label}
      </NavLink>
    </li>
  );
}