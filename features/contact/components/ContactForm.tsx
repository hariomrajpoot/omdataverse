"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { contactLeadSchema, type ContactLead } from "@/features/contact/lib/validation";
import { cn } from "@/features/shared/lib/utils";

export interface ContactFormProps {
  heading?: string;
  subheading?: string;
}

type Status =
  | { kind: "idle" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

export function ContactForm({
  heading = "Contact",
  subheading = "Tell us what you’re building. We’ll respond within 1–2 business days.",
}: ContactFormProps) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [form, setForm] = useState<ContactLead>(() => ({
    name: "",
    email: "",
    message: "",
    company: "",
  }));

  const parsed = useMemo(() => contactLeadSchema.safeParse(form), [form]);

  useEffect(() => {
    if (status.kind === "success") {
      const timer = setTimeout(() => setStatus({ kind: "idle" }), 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setStatus({ kind: "idle" });

    if (!parsed.success) {
      setStatus({
        kind: "error",
        message: "Please fix the highlighted fields and try again.",
      });
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(parsed.data),
        });

        const data = (await res.json().catch(() => null)) as
          | { ok: true; message: string }
          | { ok: false; error: string }
          | null;

        if (!res.ok || !data || data.ok !== true) {
          setStatus({
            kind: "error",
            message: data && "error" in data ? data.error : "Something went wrong.",
          });
          return;
        }

        setStatus({ kind: "success", message: data.message });
        setForm({ name: "", email: "", message: "", company: "" });
        setSubmitted(false);
        setTouched({});
      } catch {
        setStatus({
          kind: "error",
          message: "Network error. Please try again in a moment.",
        });
      }
    });
  }

  const fieldError = (path: keyof ContactLead) => {
    if (parsed.success) return undefined;
    const issue = parsed.error.issues.find((i) => i.path[0] === path);
    return issue?.message;
  };

  const showErrorFor = (path: keyof ContactLead) =>
    Boolean(submitted || touched[path]);

  const errorClass = (hasError: boolean) =>
    cn(
      "mt-2 w-full rounded-xl border bg-brand-bg/60 px-4 py-3 text-sm text-brand-fg placeholder:text-brand-muted/70",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg",
      hasError
        ? "border-red-400/60 ring-1 ring-red-400/30"
        : "border-brand-border/10",
    );

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-brand-fg sm:text-4xl">
            {heading}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-brand-fg/70 sm:text-base">
            {subheading}
          </p>

          <div className="mt-6 rounded-2xl border border-brand-border/10 bg-brand-surface p-5 text-sm text-brand-fg/70">
            <div className="font-semibold text-brand-fg">What happens next</div>
            <ul className="mt-2 space-y-2">
              <li className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-accent" />
                <span>We validate scope, constraints, and stakeholders.</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-accent" />
                <span>We propose a 2–6 week delivery plan with milestones.</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-accent" />
                <span>We start with a small audit to de-risk delivery.</span>
              </li>
            </ul>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-brand-border/10 bg-brand-surface p-6"
          aria-label="Contact form"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-brand-fg/80" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                autoComplete="name"
                required
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                className={errorClass(Boolean(fieldError("name")))}
                placeholder="Your name"
                aria-invalid={Boolean(fieldError("name"))}
              />
              {showErrorFor("name") && fieldError("name") ? (
                <p className="mt-2 text-xs text-red-200">{fieldError("name")}</p>
              ) : null}
            </div>

            <div>
              <label className="text-sm font-semibold text-brand-fg/80" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                className={errorClass(Boolean(fieldError("email")))}
                placeholder="name@company.com"
                aria-invalid={Boolean(fieldError("email"))}
              />
              {showErrorFor("email") && fieldError("email") ? (
                <p className="mt-2 text-xs text-red-200">{fieldError("email")}</p>
              ) : null}
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm font-semibold text-brand-fg/80" htmlFor="company">
                Company (optional)
              </label>
              <input
                id="company"
                autoComplete="organization"
                value={form.company ?? ""}
                onChange={(e) =>
                  setForm((p) => ({ ...p, company: e.target.value }))
                }
                onBlur={() => setTouched((t) => ({ ...t, company: true }))}
                className={errorClass(Boolean(fieldError("company")))}
                placeholder="Company / team"
                aria-invalid={Boolean(fieldError("company"))}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm font-semibold text-brand-fg/80" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                required
                value={form.message}
                onChange={(e) =>
                  setForm((p) => ({ ...p, message: e.target.value }))
                }
                onBlur={() => setTouched((t) => ({ ...t, message: true }))}
                rows={7}
                className={errorClass(Boolean(fieldError("message")))}
                placeholder="What are you trying to achieve? Include constraints, timelines, and where you are today."
                aria-invalid={Boolean(fieldError("message"))}
              />
              {showErrorFor("message") && fieldError("message") ? (
                <p className="mt-2 text-xs text-red-200">{fieldError("message")}</p>
              ) : (
                <p className="mt-2 text-xs text-brand-fg/60">
                  Minimum 20 characters. Please avoid sharing sensitive personal
                  or health information.
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={isPending}
              className={cn(
                "inline-flex h-11 items-center justify-center rounded-md bg-brand-primary px-5 text-sm font-semibold text-brand-onPrimary shadow-sm shadow-black/10 transition",
                "hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70",
                "hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg",
              )}
            >
              {isPending ? "Sending…" : "Send message"}
            </button>
            <div aria-live="polite" className="text-sm">
              {status.kind === "success" ? (
                <span className="text-emerald-200">{status.message}</span>
              ) : status.kind === "error" ? (
                <span className="text-red-200">{status.message}</span>
              ) : (
                <span className="text-brand-fg/60">
                  Prefer email?{" "}
                  <a className="underline hover:text-brand-fg" href="mailto:hello@example.com">
                    hello@example.com
                  </a>
                </span>
              )}
            </div>
          </div>
        </form>
      </div>

      {/**
       * Story-like usage:
       * <ContactForm />
       * <ContactForm heading="Book an audit" subheading="Tell us about your data estate." />
       */}
    </section>
  );
}

