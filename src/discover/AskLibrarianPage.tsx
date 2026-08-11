import { useState, type FormEvent } from "react";
import { Mail, Phone, Globe, Send } from "lucide-react";

export interface LibrarianContact {
  intro: string;
  email?: string;
  phone?: string;
  website?: string;
}

export interface AskLibrarianMessage {
  name: string;
  email: string;
  question: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  question?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// TODO: replace with real tRPC query/mutation once wired up, e.g.:
//   const { data: contact } = trpc.library.librarianContact.useQuery();
//   const sendMessage = trpc.library.askLibrarian.useMutation();
interface AskLibrarianPageProps {
  contact: LibrarianContact;
  onSubmit?: (message: AskLibrarianMessage) => void | Promise<void>;
}

export function AskLibrarianPage({ contact, onSubmit }: AskLibrarianPageProps) {
  const [form, setForm] = useState<AskLibrarianMessage>({ name: "", email: "", question: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (!form.name.trim()) next.name = "Please enter your name";
    if (!EMAIL_PATTERN.test(form.email)) next.email = "Please enter a valid email address";
    if (form.question.trim().length < 10) next.question = "Please add a few more details to your question";
    return next;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      await onSubmit?.(form);
      setSent(true);
      setForm({ name: "", email: "", question: "" });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function field<K extends keyof AskLibrarianMessage>(key: K) {
    return {
      value: form[key],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((f) => ({ ...f, [key]: e.target.value })),
    };
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-6 px-4 py-10 md:grid-cols-[1fr_1.3fr]">
      <div className="h-fit rounded-lg border border-moss-100 bg-ivory-50 p-6 shadow-sm">
        <h1 className="font-display text-2xl text-ink">Ask a Librarian</h1>
        <p className="mt-3 font-sans text-sm text-ink/70">{contact.intro}</p>

        <dl className="mt-6 flex flex-col gap-3">
          {contact.email && (
            <ContactRow icon={Mail} label="Email">
              <a href={`mailto:${contact.email}`} className="text-moss-700 underline underline-offset-2 hover:text-moss-800">
                {contact.email}
              </a>
            </ContactRow>
          )}
          {contact.phone && (
            <ContactRow icon={Phone} label="Phone">
              <a href={`tel:${contact.phone}`} className="text-ink/80 hover:text-ink">
                {contact.phone}
              </a>
            </ContactRow>
          )}
          {contact.website && (
            <ContactRow icon={Globe} label="Website">
              <a
                href={contact.website}
                target="_blank"
                rel="noreferrer"
                className="text-moss-700 underline underline-offset-2 hover:text-moss-800"
              >
                {contact.website.replace(/^https?:\/\//, "")}
              </a>
            </ContactRow>
          )}
        </dl>
      </div>

      <div className="rounded-lg border border-moss-100 bg-ivory-50 p-6 shadow-sm">
        <h2 className="font-display text-xl text-ink">Send a question</h2>
        <p className="mt-1 font-sans text-sm text-ink/50">
          We'll get back to you at the email you provide.
        </p>

        {sent ? (
          <div className="mt-6 rounded border border-moss-500/40 bg-moss-500/5 px-4 py-3 font-sans text-sm text-moss-700">
            Thanks — your question has been sent. Keep an eye on your inbox for a reply.
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-4">
            <FormField label="Name" error={errors.name}>
              <input
                type="text"
                placeholder="Your name"
                {...field("name")}
                className={inputClass(!!errors.name)}
              />
            </FormField>

            <FormField label="Email" error={errors.email}>
              <input
                type="email"
                placeholder="Email address"
                {...field("email")}
                className={inputClass(!!errors.email)}
              />
            </FormField>

            <FormField label="Question" error={errors.question}>
              <textarea
                placeholder="What would you like to ask?"
                rows={4}
                {...field("question")}
                className={inputClass(!!errors.question)}
              />
            </FormField>

            {submitError && (
              <p className="rounded border border-stamp-500/40 bg-stamp-500/5 px-3 py-2 font-sans text-sm text-stamp-600">
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center gap-2 rounded-full bg-moss-700 px-6 py-2.5 font-sans text-sm font-medium text-ivory-50 shadow-sm transition hover:bg-moss-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
              {submitting ? "Sending…" : "Send question"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function inputClass(hasError: boolean) {
  return [
    "w-full rounded border bg-ivory-50 px-3 py-2 font-sans text-sm text-ink placeholder:text-ink/40",
    "focus:outline-none focus:ring-2 focus:ring-moss-500/30",
    hasError ? "border-stamp-500 focus:border-stamp-500" : "border-moss-200 focus:border-moss-500",
  ].join(" ");
}

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-sans text-sm font-medium text-ink">{label}</span>
      {children}
      {error && <span className="font-sans text-xs text-stamp-600">{error}</span>}
    </label>
  );
}

function ContactRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Mail;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-moss-100 text-moss-700">
        <Icon className="h-4 w-4" />
      </div>
      <dt className="w-14 shrink-0 font-sans text-sm text-ink/50">{label}</dt>
      <dd className="font-sans text-sm">{children}</dd>
    </div>
  );
}