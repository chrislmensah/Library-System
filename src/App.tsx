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
import { ReportsPage } from "./reports/ReportsPage";
import { ManagePage } from "./admin/manage/ManagePage";
import { ProcurementsPage } from "./procurements/ProcurementsPage";
import type { CatalogBook } from "./admin/catalogTypes";
import type { StaffMember, LibraryMember } from "./admin/manage/manageTypes";
import type { ProcurementOrder } from "./procurements/procurementTypes";
import type { LoanRequest, Loan, Fine, LibrarySettings } from "./loan/loanTypes";
import type { Book } from "./discover/types";

const LIBRARY_ID = "lib_sankofa";
const CURRENT_STAFF_ID = "s1"; // matches mockStaff[0] ("Christopher") — swap for real session once auth is wired up

// Placeholder for admin sections not built yet (Others, Docs, Support, Settings)
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
const mockStaff: StaffMember[] = [
  {
    id: "s1",
    name: "Christopher",
    email: "christopher@example.com",
    role: "owner",
    joinedAt: "2026-02-01T00:00:00Z",
  },
  {
    id: "s2",
    name: "Adjoa Owusu",
    email: "adjoa@example.com",
    role: "librarian",
    joinedAt: "2026-03-15T00:00:00Z",
  },
];

// TODO: replace with real tRPC query once wired up
const mockMembers: LibraryMember[] = [
  { id: "m1", name: "Ama Boateng", email: "ama@example.com", status: "active", memberSince: "2026-05-01T00:00:00Z" },
  { id: "m2", name: "Kwame Mensah", email: "kwame@example.com", status: "active", memberSince: "2026-06-12T00:00:00Z" },
];

// TODO: replace with real tRPC query once wired up
const mockProcurements: ProcurementOrder[] = [
  {
    id: "p1",
    title: "The Fifth Season",
    author: "N.K. Jemisin",
    isbn: "9780316229296",
    quantity: 3,
    vendor: "Ingram",
    costPerCopy: 14.99,
    status: "ordered",
    requestedBy: "Christopher",
    requestedAt: "2026-07-20T00:00:00Z",
    expectedDate: "2026-08-25",
  },
  {
    id: "p2",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "9780061120084",
    quantity: 2,
    vendor: "Local distributor",
    costPerCopy: 9.5,
    status: "requested",
    requestedBy: "Adjoa Owusu",
    requestedAt: "2026-08-05T00:00:00Z",
  },
];

// TODO: replace with real tRPC query once wired up
const mockLibrarySettings: LibrarySettings = {
  libraryId: LIBRARY_ID,
  finePerDay: 0.5,
  finePerDayCurrency: "GHS",
  gracePeriodDays: 1,
  maxFineAmount: 10,
  lostBookFineMode: "flat",
  lostBookFlatFee: 15,
};

// TODO: replace with real tRPC query once wired up
const mockLoanRequests: LoanRequest[] = [
  {
    id: "lr1",
    libraryId: LIBRARY_ID,
    bookId: mockCatalogBooks[1].id, // To Kill a Mockingbird
    memberId: "m1",
    requestedAt: "2026-08-09T00:00:00Z",
    status: "pending",
    decidedBy: null,
    decidedAt: null,
  },
];

// TODO: replace with real tRPC query once wired up
const mockLoans: Loan[] = [
  {
    id: "l1",
    libraryId: LIBRARY_ID,
    bookId: mockCatalogBooks[0].id, // Harry Potter
    memberId: "m1",
    loanRequestId: null,
    checkedOutAt: "2026-07-28T00:00:00Z",
    checkedOutBy: CURRENT_STAFF_ID,
    dueDate: "2026-08-20T00:00:00Z",
    returnedAt: null,
    returnedTo: null,
    status: "active",
  },
  {
    id: "l2",
    libraryId: LIBRARY_ID,
    bookId: mockCatalogBooks[2].id, // 20,000 Leagues
    memberId: "m2",
    loanRequestId: null,
    checkedOutAt: "2026-07-10T00:00:00Z",
    checkedOutBy: CURRENT_STAFF_ID,
    dueDate: "2026-08-02T00:00:00Z", // in the past on purpose, to preview the "Overdue" state
    returnedAt: null,
    returnedTo: null,
    status: "active",
  },
];

// TODO: replace with real tRPC query once wired up
const mockFines: Fine[] = [];

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
            <CirculationsPage
              initialRequests={mockLoanRequests}
              initialLoans={mockLoans}
              initialFines={mockFines}
              books={mockCatalogBooks}
              members={mockMembers}
              librarySettings={mockLibrarySettings}
              currentStaffId={CURRENT_STAFF_ID}
            />
          }
        />
        <Route
          path="procurements"
          element={<ProcurementsPage initialOrders={mockProcurements} requestedBy="Christopher" />}
        />
        <Route
          path="reports"
          element={
            <ReportsPage
              books={mockCatalogBooks}
              loans={mockLoans}
              fines={mockFines}
              members={mockMembers}
            />
          }
        />
        <Route path="others" element={<ComingSoonPage title="Others" />} />
        <Route
          path="manage"
          element={<ManagePage initialStaff={mockStaff} initialMembers={mockMembers} />}
        />
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