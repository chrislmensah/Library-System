import { useState, type FormEvent } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Check } from "lucide-react";

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string;

const WHY_LIBRARIKA = [
  "Instantly create your online library",
  "Unlimited Library members",
  "No hardware, infrastructure and software cost",
  "No installation and maintenance cost",
  "Easy, no technical skill required",
  "Access from anywhere using any Internet enabled device",
  "Support multiple library branches",
  "Secure and safe",
  "100% free for upto 2000 books or records",
];

interface FormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  captcha?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// TODO: replace with real tRPC mutation once auth is wired up, e.g.:
//   const registerMutation = trpc.auth.register.useMutation();
interface RegisterPageProps {
  onSubmit?: (data: FormState & { captchaToken: string }) => void | Promise<void>;
}

export function RegisterPage({ onSubmit }: RegisterPageProps) {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (!form.name.trim()) next.name = "Please enter your full name, e.g. John Doe";
    if (!EMAIL_PATTERN.test(form.email)) next.email = "Please enter a valid email address";
    if (form.password.length < 8) next.password = "Password must be at least 8 characters";
    if (form.confirmPassword !== form.password) next.confirmPassword = "Passwords do not match";
    if (!captchaToken) next.captcha = "Please verify you're not a robot";
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
      await onSubmit?.({ ...form, captchaToken: captchaToken! });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function field<K extends keyof FormState>(key: K) {
    return {
      value: form[key],
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((f) => ({ ...f, [key]: e.target.value })),
    };
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 md:grid-cols-[1.4fr_1fr]">
      <div className="rounded-lg border border-moss-100 bg-ivory-50 p-6 shadow-sm">
        <h1 className="font-display text-2xl text-ink">Register Account</h1>
        <p className="mt-2 font-sans text-sm text-ink/60">
          Creating your account at <span className="font-semibold text-moss-700">Sankofa Library</span> is
          completely free. You can join as many libraries as you want using one single account.
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-5">
          <FormField label="Name" error={errors.name} hint="Please enter your full name, e.g. John Doe">
            <input
              type="text"
              placeholder="Your name"
              {...field("name")}
              className={inputClass(!!errors.name)}
            />
          </FormField>

          <FormField label="Email" error={errors.email} hint="Please provide your email address, e.g. john@example.com">
            <input
              type="email"
              placeholder="Email address"
              {...field("email")}
              className={inputClass(!!errors.email)}
            />
          </FormField>

          <FormField label="Password" error={errors.password} hint="At least 8 characters">
            <input
              type="password"
              placeholder="Password"
              {...field("password")}
              className={inputClass(!!errors.password)}
            />
          </FormField>

          <FormField label="Confirm Password" error={errors.confirmPassword} hint="Please enter the password again.">
            <input
              type="password"
              placeholder="Confirm password"
              {...field("confirmPassword")}
              className={inputClass(!!errors.confirmPassword)}
            />
          </FormField>

          <div>
            {RECAPTCHA_SITE_KEY ? (
              <ReCAPTCHA sitekey={RECAPTCHA_SITE_KEY} onChange={(token) => setCaptchaToken(token)} />
            ) : (
              <p className="rounded border border-stamp-500/40 bg-stamp-500/5 px-3 py-2 font-sans text-xs text-stamp-600">
                Missing VITE_RECAPTCHA_SITE_KEY — add it to your .env file.
              </p>
            )}
            {errors.captcha && <p className="mt-1 font-sans text-xs text-stamp-600">{errors.captcha}</p>}
          </div>

          {submitError && (
            <p className="rounded border border-stamp-500/40 bg-stamp-500/5 px-3 py-2 font-sans text-sm text-stamp-600">
              {submitError}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-moss-700 px-6 py-2.5 font-sans text-sm font-medium text-ivory-50 shadow-sm transition hover:bg-moss-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Creating account…" : "Create Free Library"}
          </button>
        </form>
      </div>

      <aside className="pt-2">
        <h2 className="font-display text-2xl text-ink">
          Why <span className="text-moss-700">Sankofa Library</span>?
        </h2>
        <ul className="mt-4 flex flex-col gap-2.5">
          {WHY_LIBRARIKA.map((item) => (
            <li key={item} className="flex items-start gap-2 font-sans text-sm text-ink/80">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-moss-600" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </aside>
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
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-sans text-sm font-medium text-ink">{label}</span>
      {children}
      {error ? (
        <span className="font-sans text-xs text-stamp-600">{error}</span>
      ) : hint ? (
        <span className="font-sans text-xs text-ink/40">{hint}</span>
      ) : null}
    </label>
  );
}