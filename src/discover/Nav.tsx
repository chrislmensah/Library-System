import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

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
}

export function Nav({ isLoggedIn, brandName = "Sankofa Library" }: NavProps) {
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
          <Link
            to={isLoggedIn ? "/account" : "/register"}
            className="rounded-full bg-ivory-50 px-4 py-1.5 font-sans text-sm font-medium text-moss-800 shadow-sm transition hover:bg-ivory-100"
          >
            {isLoggedIn ? "My Account" : "Sign Up"}
          </Link>
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
          <Link
            to={isLoggedIn ? "/account" : "/register"}
            onClick={() => setMenuOpen(false)}
            className="w-fit rounded-full bg-ivory-50 px-4 py-1.5 font-sans text-sm font-medium text-moss-800"
          >
            {isLoggedIn ? "My Account" : "Sign Up"}
          </Link>
        </div>
      )}
    </nav>
  );
}