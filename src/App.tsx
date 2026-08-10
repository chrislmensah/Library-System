import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./discover/Layout";
import { DiscoverPage } from "./discover/DiscoverPage";
import { DatabaseAZPage } from "./discover/DatabaseAZPage";
import { RegisterPage } from "./discover/RegisterPage";
import type { Book } from "./discover/types";

const mockBooks: Book[] = [
  {
    id: "1",
    title: "Harry Potter and the Prisoner of Azkaban",
    author: "J.K. Rowling",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780439136365-L.jpg",
    isbn: "9780439136365",
    isFree: false,
    stats: { likes: 50, reads: 340, views: 900 },
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

function App() {
  // TODO: replace with real session state once auth is wired up
  const isLoggedIn = false;

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout isLoggedIn={isLoggedIn} />}>
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
                }}
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;