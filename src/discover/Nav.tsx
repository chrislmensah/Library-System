import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, User, ChevronDown, LayoutDashboard, Compass, LogOut, Plus } from "lucide-react";

interface NavLinkItem {
  label: string;
  to: string;
}

const NAV_LINKS: NavLinkItem[] = [
  { label: "Home", to: "/" },
  { label: "Catalog", to: "/catalog" },
  { label: "Search Catalog", to: "/search" },
  { label: "Database A-Z", to: "/database" },
  { label: "Top Collections", to: "/top-collections" },
  { label: "New Collections", to: "/new-collections" },
  { label: "Ask a Librarian?", to: "/ask-a-librarian" },
];

interface NavProps {
  isLoggedIn: boolean;
  brandName?: string;
  onLogOut?: () => void;
}

export function Nav({ isLoggedIn, brandName = "Sankofa Library", onLogOut }: NavProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "font-sans text-sm transition",
      isActive
        ? "font-semibold text-ivory-50 underline underline-offset-4"
        : "text-ivory-100/80 hover:text-ivory-50",
    ].join(" ");

  return (
    <nav className="bg-moss-700 text-ivory-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="font-display text-lg font-medium">
          {brandName}
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-5 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}

          {isLoggedIn ? (
            <AccountMenu onLogOut={onLogOut} />
          ) : (
            <> 
            <Link
            to = "/create-library"
            className="font-sans text-sm text-ivory-100/80 hover:text-ivory-50"
            >
                Create Library
                </Link>
                <Link
              to="/register"
              className="rounded-full bg-ivory-50 px-4 py-1.5 font-sans text-sm font-medium text-moss-800 shadow-sm transition hover:bg-ivory-100"
            >
              Sign Up
            </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="flex flex-col gap-3 border-t border-ivory-50/20 px-4 py-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className="font-sans text-sm text-ivory-100/90"
            >
              {link.label}
            </NavLink>
          ))}

          {isLoggedIn ? (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="font-sans text-sm text-ivory-100/90">
                Dashboard
              </Link>
              <Link to="/account" onClick={() => setMenuOpen(false)} className="font-sans text-sm text-ivory-100/90">
                My Account
              </Link>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onLogOut?.();
                }}
                className="w-fit font-sans text-sm text-ivory-100/90"
              >
                Log Out
              </button>
            </>
          ) : (
            <Link
              to="/register"
              onClick={() => setMenuOpen(false)}
              className="w-fit rounded-full bg-ivory-50 px-4 py-1.5 font-sans text-sm font-medium text-moss-800"
            >
              Sign Up
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

function AccountMenu({ onLogOut }: { onLogOut?: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close the dropdown on outside click - handled inline, no external hook dependency
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
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
        className="flex items-center gap-1.5 rounded-full bg-ivory-50/10 px-3 py-1.5 text-ivory-50 transition hover:bg-ivory-50/20"
      >
        <User className="h-4 w-4" />
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-44 overflow-hidden rounded-lg border border-moss-100 bg-ivory-50 py-1 text-ink shadow-lg"
        >
          <MenuLink to="/dashboard" icon={LayoutDashboard} label="Dashboard" onClick={() => setOpen(false)} />
          <MenuLink to="/account" icon={Compass} label="My Account" onClick={() => setOpen(false)} />
          <MenuLink to="/create-library" icon={Plus} label="Create Library" onClick={() => setOpen(false)} />       
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

function MenuLink({
  to,
  icon: Icon,
  label,
  onClick,
}: {
  to: string;
  icon: typeof LayoutDashboard;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      to={to}
      role="menuitem"
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 font-sans text-sm text-ink transition hover:bg-moss-50"
    >
      <Icon className="h-4 w-4 text-moss-600" />
      {label}
    </Link>
  );
}