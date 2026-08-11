import { BookOpen, Clock, KeyRound, User } from "lucide-react";
import type { Book } from "./types";

export interface BorrowedBook {
  book: Book;
  dueDate: string; // ISO date
}

export interface AccountUser {
  name: string;
  email: string;
  memberSince: string; // ISO date
}

// TODO: replace with real tRPC queries once auth/data layer is wired up, e.g.:
//   const { data: user } = trpc.account.me.useQuery();
//   const { data: borrowed = [] } = trpc.account.borrowedBooks.useQuery();
interface AccountPageProps {
  user: AccountUser;
  borrowedBooks: BorrowedBook[];
  onChangePassword?: () => void;
}

export function AccountPage({ user, borrowedBooks, onChangePassword }: AccountPageProps) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header>
        <h1 className="font-display text-3xl text-ink">My Account</h1>
        <p className="mt-2 font-sans text-ink/60">
          Manage your profile and see what you've currently borrowed.
        </p>
      </header>

      <div className="mt-8 grid gap-6 md:grid-cols-[1fr_1.6fr]">
        <ProfileCard user={user} onChangePassword={onChangePassword} />
        <BorrowedBooksCard borrowedBooks={borrowedBooks} />
      </div>
    </div>
  );
}

function ProfileCard({
  user,
  onChangePassword,
}: {
  user: AccountUser;
  onChangePassword?: () => void;
}) {
  const memberSince = new Date(user.memberSince).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
  });

  return (
    <div className="h-fit rounded-lg border border-moss-100 bg-ivory-50 p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-moss-100 text-moss-700">
          <User className="h-6 w-6" />
        </div>
        <div>
          <p className="font-display text-lg text-ink">{user.name}</p>
          <p className="font-sans text-sm text-ink/60">{user.email}</p>
        </div>
      </div>

      <p className="mt-4 font-sans text-xs text-ink/40">Member since {memberSince}</p>

      <button
        onClick={onChangePassword}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-moss-200 px-4 py-2 font-sans text-sm font-medium text-moss-700 transition hover:bg-moss-50"
      >
        <KeyRound className="h-4 w-4" />
        Change Password
      </button>
    </div>
  );
}

function BorrowedBooksCard({ borrowedBooks }: { borrowedBooks: BorrowedBook[] }) {
  return (
    <div className="rounded-lg border border-moss-100 bg-ivory-50 p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-moss-600" />
        <h2 className="font-display text-xl text-ink">Currently Borrowed</h2>
      </div>

      {borrowedBooks.length === 0 ? (
        <p className="mt-4 font-sans text-sm text-ink/50">
          You haven't borrowed any books yet — head to Discover to find something to read.
        </p>
      ) : (
        <ul className="mt-4 flex flex-col divide-y divide-moss-100">
          {borrowedBooks.map(({ book, dueDate }) => (
            <BorrowedRow key={book.id} book={book} dueDate={dueDate} />
          ))}
        </ul>
      )}
    </div>
  );
}

function BorrowedRow({ book, dueDate }: { book: Book; dueDate: string }) {
  const due = new Date(dueDate);
  const isOverdue = due.getTime() < Date.now();
  const formattedDue = due.toLocaleDateString(undefined, { month: "short", day: "numeric" });

  return (
    <li className="flex items-center gap-3 py-3">
      <img
        src={book.coverUrl}
        alt=""
        className="h-14 w-10 shrink-0 rounded-sm object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-sans text-sm font-medium text-ink">{book.title}</p>
        <p className="truncate font-sans text-xs text-ink/50">{book.author}</p>
      </div>
      <div
        className={[
          "flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 font-sans text-xs font-medium",
          isOverdue ? "bg-stamp-500/10 text-stamp-600" : "bg-moss-100 text-moss-700",
        ].join(" ")}
      >
        <Clock className="h-3 w-3" />
        {isOverdue ? "Overdue" : `Due ${formattedDue}`}
      </div>
    </li>
  );
}