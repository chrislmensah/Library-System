interface FaqItem {
  question: string;
  answer: string;
}

interface FaqCategory {
  id: string;
  label: string;
  items: FaqItem[];
}

// TODO: replace with real tRPC query once wired up, e.g.:
//   const { data: categories } = trpc.faq.list.useQuery();
const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: "general",
    label: "General Questions",
    items: [
      {
        question: "What is Sankofa Library?",
        answer:
          "Sankofa Library is a cloud-based Integrated Library System (ILS) for managing books, members, and lending.",
      },
      {
        question: "Who can use Sankofa Library?",
        answer:
          "Anyone managing a physical or virtual library — schools, universities, public libraries, or a personal collection.",
      },
      {
        question: "Is Sankofa Library free to use?",
        answer:
          "The basic plan is free for up to 2,000 catalog records. Register an account to get started right away.",
      },
      {
        question: "Is Sankofa Library easy to use?",
        answer: "Yes — no technical skill is required to manage or use your library.",
      },
    ],
  },
  {
    id: "catalog",
    label: "Catalog Related Questions",
    items: [
      {
        question: "How do I add a new book to the catalog?",
        answer:
          "From the admin dashboard, go to Catalogs and select \"Add New Book\", then fill in the title, author, ISBN, and copy count.",
      },
      {
        question: "Can I bulk import my existing catalog?",
        answer:
          "Bulk import via CSV is planned but not yet available — for now, books are added one at a time from the Catalogs page.",
      },
    ],
  },
  {
    id: "members",
    label: "Members / Patrons Related Questions",
    items: [
      {
        question: "How do members borrow books?",
        answer:
          "Members create a free account, browse the Discover page, and request a book — a librarian confirms the loan.",
      },
      {
        question: "Is there a limit on how many books a member can borrow?",
        answer: "Borrowing limits are set per library by the admin from the Manage section.",
      },
    ],
  },
  {
    id: "ebooks",
    label: "E-Books Related Questions",
    items: [
      {
        question: "Can I host e-books directly in Sankofa Library?",
        answer:
          "Yes — mark a catalog entry as \"Free to read\" to make it available for online reading from the Discover page.",
      },
    ],
  },
  {
    id: "payment",
    label: "Payment Related Questions",
    items: [
      {
        question: "Do I need a credit card to sign up?",
        answer: "No — the free plan requires no payment method to get started.",
      },
      {
        question: "What happens if I go over the free plan's record limit?",
        answer:
          "You'll be prompted to upgrade to a paid plan once you approach the 2,000 record limit on the free tier.",
      },
    ],
  },
  {
    id: "barcodes",
    label: "Barcodes & Labels Related Questions",
    items: [
      {
        question: "Can I print barcode labels for my books?",
        answer: "Barcode label printing is available from the Catalogs section for each book record.",
      },
    ],
  },
  {
    id: "accounts",
    label: "User Accounts Related Questions",
    items: [
      {
        question: "How do I reset my password?",
        answer: "Go to My Account and select \"Change Password\", or use the \"Forgot password\" link on the login page.",
      },
      {
        question: "Can I have multiple libraries under one account?",
        answer: "Yes — a single Sankofa Library account can be linked to multiple libraries.",
      },
    ],
  },
  {
    id: "sip2",
    label: "SIP2 Integration",
    items: [
      {
        question: "Does Sankofa Library support SIP2?",
        answer: "SIP2 integration for self-checkout kiosks is supported on paid plans.",
      },
    ],
  },
  {
    id: "sso",
    label: "SSO / SAML Integration",
    items: [
      {
        question: "Can members log in with their school or work account?",
        answer: "SSO/SAML login is available on institutional plans — contact support to set it up.",
      },
    ],
  },
  {
    id: "misc",
    label: "Miscellaneous Questions",
    items: [
      {
        question: "Where can I get more help?",
        answer: "Use the \"Ask a Librarian\" page, or reach out from the Support section of the admin dashboard.",
      },
    ],
  },
];

export function FaqPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display text-3xl text-ink">Frequently Asked Questions</h1>
      <p className="mt-2 font-sans text-sm text-ink/60">
        Please read this FAQ section thoroughly, hope you will get answers to most of your questions.
      </p>

      <div className="mt-8 grid gap-8 md:grid-cols-[220px_1fr]">
        <nav aria-label="FAQ categories" className="h-fit md:sticky md:top-6">
          <p className="font-display text-lg text-ink">Quick Menu</p>
          <ul className="mt-3 flex flex-col gap-2">
            {FAQ_CATEGORIES.map((cat) => (
              <li key={cat.id}>
                <a
                  href={`#${cat.id}`}
                  className="font-sans text-sm text-moss-700 underline underline-offset-2 hover:text-moss-800"
                >
                  {cat.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-10">
          {FAQ_CATEGORIES.map((cat) => (
            <section key={cat.id} id={cat.id} className="scroll-mt-6">
              <h2 className="font-display text-xl text-moss-700">{cat.label}</h2>
              <div className="mt-3 flex flex-col divide-y divide-moss-100 rounded-lg border border-moss-100 bg-ivory-50 shadow-sm">
                {cat.items.map((item) => (
                  <div key={item.question} className="px-4 py-4">
                    <p className="font-sans text-sm font-semibold text-ink">{item.question}</p>
                    <p className="mt-1 font-sans text-sm text-ink/70">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}