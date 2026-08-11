import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useLibrary } from "./LibraryContext";

interface FormErrors {
  name?: string;
  slug?: string;
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function CreateLibraryPage() {
  const { memberships, createLibrary } = useLibrary();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  function handleNameChange(value: string) {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  function handleSlugChange(value: string) {
    setSlugTouched(true);
    setSlug(slugify(value));
  }

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (!name.trim()) next.name = "Please name your library";
    if (!slug) {
      next.slug = "A URL slug is required";
    } else if (!SLUG_PATTERN.test(slug)) {
      next.slug = "Lowercase letters, numbers, and hyphens only";
    } else if (memberships.some((m) => m.library.slug === slug)) {
      next.slug = "You already have a library with this slug";
    }
    return next;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    // TODO: this only writes to localStorage via LibraryContext right now.
    // Once a backend exists, this becomes an awaited tRPC mutation and
    // the redirect should wait for a real libraryId back from the server.
    createLibrary(name.trim(), slug);
    navigate("/dashboard");
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <div className="rounded-lg border border-moss-100 bg-ivory-50 p-6 shadow-sm">
        <h1 className="font-display text-2xl text-ink">Create Your Library</h1>
        <p className="mt-2 font-sans text-sm text-ink/60">
          This creates a new, isolated library under your account. You'll be its owner.
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-5">
          <label className="flex flex-col gap-1">
            <span className="font-sans text-sm font-medium text-ink">Library name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Chris Library"
              className={inputClass(!!errors.name)}
            />
            {errors.name && <span className="font-sans text-xs text-stamp-600">{errors.name}</span>}
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-sans text-sm font-medium text-ink">URL slug</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="chris-library"
              className={inputClass(!!errors.slug)}
            />
            {errors.slug ? (
              <span className="font-sans text-xs text-stamp-600">{errors.slug}</span>
            ) : (
              <span className="font-sans text-xs text-ink/40">
                Your library will be reachable at{" "}
                <span className="text-moss-700">
                  {slug || "your-slug"}.sankofalibrary.com
                </span>
              </span>
            )}
          </label>

          <div className="rounded border border-moss-200 bg-moss-50 px-3 py-2 font-sans text-xs text-moss-700">
            Free plan — up to 2,000 catalog records, no payment required.
          </div>

          <button
            type="submit"
            className="rounded-full bg-moss-700 px-6 py-2.5 font-sans text-sm font-medium text-ivory-50 shadow-sm transition hover:bg-moss-800"
          >
            Create Free Library
          </button>
        </form>
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