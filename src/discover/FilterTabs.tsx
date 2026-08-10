import type { BookFilter } from "./types";

const FILTERS: { id: BookFilter; label: string }[] = [
  { id: "popular", label: "Popular" },
  { id: "most-liked", label: "Most Liked" },
  { id: "most-read", label: "Most Read" },
  { id: "most-viewed", label: "Most Viewed" },
  { id: "latest", label: "Latest" },
];

interface FilterTabsProps {
  active: BookFilter;
  onChange: (filter: BookFilter) => void;
}

export function FilterTabs({ active, onChange }: FilterTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Sort books"
      className="flex flex-wrap justify-center gap-2"
    >
      {FILTERS.map(({ id, label }) => {
        const isActive = id === active;
        return (
          <button
            key={id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(id)}
            className={[
              "rounded-full px-4 py-1.5 font-sans text-sm font-medium transition",
              "focus:outline-none focus:ring-2 focus:ring-moss-500/40",
              isActive
                ? "bg-moss-700 text-ivory-50 shadow-sm"
                : "bg-ivory-100 text-ink/70 hover:bg-moss-100 hover:text-moss-800",
            ].join(" ")}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}