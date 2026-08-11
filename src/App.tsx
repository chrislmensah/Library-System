import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Layout } from "./discover/Layout";
import { DiscoverPage } from "./discover/DiscoverPage";
import { DatabaseAZPage } from "./discover/DatabaseAZPage";
import { RegisterPage } from "./discover/RegisterPage";
import { AccountPage, type BorrowedBook } from "./discover/AccountPage";
import { AskLibrarianPage } from "./discover/AskLibrarianPage";
import { AdminLayout } from "./admin/AdminLayout";
import { AdminDashboardPage } from "./admin/AdminDashboardPage";
import { CatalogsPage } from "./admin/CatalogsPage";
import { CirculationsPage } from "./admin/CirculationsPage";
import type { CatalogBook } from "./admin/catalogTypes";
import type { CirculationRecord } from "./admin/circulationTypes";
import type { Book } from "./discover/types";

// Placeholder for admin sections not built yet (Procurements, Reports, etc.)
// so sidebar links don't feel broken while those pages are in progress.
function ComingSoonPage({ title }: { title: string }) {
  return (
    <div className="rounded-lg border border-dashed border-moss-200 bg-ivory-50 py-16 text-center">
      <p className="font-display text-lg text-ink">{title}</p>
      <p className="mt-1 font-sans text-sm text-ink/50">This section hasn't been built yet.</p>
    </div>
  );
}

const mockBooks: Book[] = [
  {
    id: "1",
    title: "Harry Potter and the Prisoner of Azkaban",
    author: "J.K. Rowling",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780439136365-L.jpg",
    isbn: "9780439136365",
    isFree: false,
    stats: { likes: 120, reads: 340, views: 900 },
    addedAt: "2026-06-01",
  },
  {
    id: "2",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg",
    isbn: "9780061120084",
    isFree: true,
    stats: { likes: 80, reads: 210, views: 500 },
    addedAt: "2026-05-15",
  },
  {
    id: "3",
    title: "20,000 Leagues Under the Sea",
    author: "Jules Verne",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780553212525-L.jpg",
    isbn: "9780553212525",
    isFree: false,
    stats: { likes: 45, reads: 90, views: 300 },
    addedAt: "2026-04-20",
  },
];

// TODO: replace with real tRPC query once auth is wired up
const mockBorrowedBooks: BorrowedBook[] = [
  { book: mockBooks[0], dueDate: "2026-08-20" },
  { book: mockBooks[2], dueDate: "2026-08-02" }, // in the past on purpose, to preview the "Overdue" state
];

// TODO: replace with real tRPC query once wired up
const mockCatalogBooks: CatalogBook[] = mockBooks.map((b, i) => ({
  ...b,
  copiesTotal: [5, 3, 2][i] ?? 1,
  copiesAvailable: [2, 0, 1][i] ?? 1,
}));

// TODO: replace with real tRPC query once wired up
const mockCirculations: CirculationRecord[] = [
  {
    id: "c1",
    bookId: mockCatalogBooks[0].id,
    bookTitle: mockCatalogBooks[0].title,
    memberName: "Ama Boateng",
    memberEmail: "ama@example.com",
    checkedOutAt: "2026-07-28T00:00:00Z",
    dueDate: "2026-08-20T00:00:00Z",
  },
  {
    id: "c2",
    bookId: mockCatalogBooks[2].id,
    bookTitle: mockCatalogBooks[2].title,
    memberName: "Kwame Mensah",
    memberEmail: "kwame@example.com",
    checkedOutAt: "2026-07-10T00:00:00Z",
    dueDate: "2026-08-02T00:00:00Z", // in the past on purpose, to preview the "Overdue" state
  },
];

function AppRoutes() {
  // TODO: replace with real session state (context, or your auth lib's hook) once wired up
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  function handleRegisterSuccess() {
    setIsLoggedIn(true);
    navigate("/account");
  }

  function handleLogOut() {
    setIsLoggedIn(false);
    navigate("/discover");
  }

  return (
    <Routes>
      <Route element={<Layout isLoggedIn={isLoggedIn} onLogOut={handleLogOut} />}>
        <Route path="/" element={<Navigate to="/discover" replace />} />
        <Route path="/discover" element={<DiscoverPage books={mockBooks} />} />
        <Route path="/database" element={<DatabaseAZPage books={mockBooks} />} />
        <Route
          path="/register"
          element={
            <RegisterPage
              onSubmit={async (data) => {
                // TODO: replace with real tRPC mutation
                console.log("register submit", data);
                handleRegisterSuccess();
              }}
            />
          }
        />
        <Route
          path="/account"
          element={
            <AccountPage
              user={{
                name: "Christopher",
                email: "christopher@example.com",
                memberSince: "2026-02-01",
              }}
              borrowedBooks={mockBorrowedBooks}
              onChangePassword={() => console.log("open change password flow")}
            />
          }
        />
        <Route
          path="/ask-a-librarian"
          element={
            <AskLibrarianPage
              contact={{
                intro: "Yet, another awesome library.",
                email: "hello@sankofalibrary.com",
                website: "https://sankofalibrary.com",
              }}
              onSubmit={async (message) => {
                // TODO: replace with real tRPC mutation
                console.log("ask a librarian submit", message);
              }}
            />
          }
        />
      </Route>

      <Route path="/dashboard" element={<AdminLayout libraryName="Sankofa Library" onLogOut={handleLogOut} />}>
        <Route
          index
          element={
            <AdminDashboardPage
              stats={{ totalBooks: 1842, totalMembers: 356, activeLoans: 47, overdueLoans: 5 }}
            />
          }
        />
        <Route path="catalogs" element={<CatalogsPage initialBooks={mockCatalogBooks} />} />
        <Route
          path="circulations"
          element={
            <CirculationsPage initialRecords={mockCirculations} catalogBooks={mockCatalogBooks} />
          }
        />
        <Route path="procurements" element={<ComingSoonPage title="Procurements" />} />
        <Route path="reports" element={<ComingSoonPage title="Reports" />} />
        <Route path="others" element={<ComingSoonPage title="Others" />} />
        <Route path="manage" element={<ComingSoonPage title="Manage" />} />
        <Route path="docs" element={<ComingSoonPage title="Documentation" />} />
        <Route path="support" element={<ComingSoonPage title="Need support" />} />
        <Route path="settings" element={<ComingSoonPage title="Settings" />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;