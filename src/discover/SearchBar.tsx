import { Search } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = "Search by title or ISBN" }: SearchBarProps) {
  const [value, setValue] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSearch(value.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="relative mx-auto w-full max-w-xl">
      <Search
        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-moss-600/60"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label="Search catalog"
        className="w-full rounded-full border border-moss-200 bg-ivory-50 py-3 pl-11 pr-4
                   font-sans text-sm text-ink placeholder:text-ink/40
                   shadow-sm transition focus:border-moss-500 focus:outline-none
                   focus:ring-2 focus:ring-moss-500/30"
      />
    </form>
  );
}