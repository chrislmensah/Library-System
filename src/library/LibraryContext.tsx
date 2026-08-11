import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type LibraryRole = "owner" | "librarian" | "member";

export interface Library {
  id: string;
  name: string;
  slug: string;
  plan: "free" | "paid";
  createdAt: string;
}

export interface LibraryMembership {
  library: Library;
  role: LibraryRole;
}

const STORAGE_KEY = "sankofa:libraries";

interface LibraryContextValue {
  memberships: LibraryMembership[];
  currentLibrary: Library | null;
  setCurrentLibraryId: (id: string) => void;
  // TODO: replace with a real tRPC mutation once a backend exists, e.g.:
  //   const createLibrary = trpc.library.create.useMutation();
  createLibrary: (name: string, slug: string) => Library;
}

const LibraryContext = createContext<LibraryContextValue | null>(null);

function loadFromStorage(): LibraryMembership[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LibraryMembership[]) : [];
  } catch {
    return [];
  }
}

function saveToStorage(memberships: LibraryMembership[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memberships));
  } catch {
    // Storage can fail (private browsing, quota) - fine to silently no-op here,
    // this is a simulated persistence layer, not the real data store.
  }
}

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [memberships, setMemberships] = useState<LibraryMembership[]>([]);
  const [currentLibraryId, setCurrentLibraryIdState] = useState<string | null>(null);

  // Load once on mount
  useEffect(() => {
    const loaded = loadFromStorage();
    setMemberships(loaded);
    if (loaded.length > 0) setCurrentLibraryIdState(loaded[0].library.id);
  }, []);

  function setCurrentLibraryId(id: string) {
    setCurrentLibraryIdState(id);
  }

  function createLibrary(name: string, slug: string): Library {
    const newLibrary: Library = {
      id: crypto.randomUUID(),
      name,
      slug,
      plan: "free",
      createdAt: new Date().toISOString(),
    };
    const newMembership: LibraryMembership = { library: newLibrary, role: "owner" };
    const next = [...memberships, newMembership];
    setMemberships(next);
    saveToStorage(next);
    setCurrentLibraryIdState(newLibrary.id);
    return newLibrary;
  }

  const currentLibrary =
    memberships.find((m) => m.library.id === currentLibraryId)?.library ?? null;

  return (
    <LibraryContext.Provider
      value={{ memberships, currentLibrary, setCurrentLibraryId, createLibrary }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error("useLibrary must be used within a LibraryProvider");
  return ctx;
}