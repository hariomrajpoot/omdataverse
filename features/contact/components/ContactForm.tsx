"use client";

import { useMemo, useState } from "react";
import { leadSchema, type Lead } from "@/features/shared/lib/validation";
import { cn } from "@/features/shared/lib/utils";

export interface ContactFormProps {
  heading?: string;
  subheading?: string;
  type?: "contact" | "demo";
}

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

export function ContactForm({
  heading = "Contact",
  subheading = "Tell us what you’re building. We’ll respond within 1–2 business days.",
  type = "contact",
}: ContactFormProps) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [form, setForm] = useState<Lead>(() => ({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    message: "",
    type,
    demoDate: "",
    demoTime: "",
    useCase: "",
  }));

  const parsed = useMemo(() => leadSchema.safeParse(form), [form]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setStatus({ kind: "loading" });

    if (!parsed.success) {
      setStatus({
        kind: "error",
        message: "Please fix the highlighted fields and try again.",
      });
      return;
    }

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed.data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit form");
      }

      setStatus({ kind: "success", message: result.message });
      setForm({
        name: "",
        email: "",
        phone: "",
        company: "",
        service: "",
        message: "",
        type,
        demoDate: "",
        demoTime: "",
        useCase: "",
      });
      setSubmitted(false);
      setTouched({});
    } catch (error) {
      console.error("Form submission error:", error);
      setStatus({
        kind: "error",
        message: error instanceof Error ? error.message : "Something went wrong. Please try again.",
      });
    }
  }

  const fieldError = (path: keyof Lead) => {
    if (parsed.success) return undefined;
    const issue = parsed.error.issues.find((i) => i.path[0] === path);
    return issue?.message;
  };

  const showErrorFor = (path: keyof Lead) =>
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
                Name *
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
                Email *
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

            <div>
              <label className="text-sm font-semibold text-brand-fg/80" htmlFor="phone">
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                value={form.phone ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                className={errorClass(Boolean(fieldError("phone")))}
                placeholder="+1 (555) 123-4567"
                aria-invalid={Boolean(fieldError("phone"))}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-brand-fg/80" htmlFor="company">
                Company
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
              <label className="text-sm font-semibold text-brand-fg/80" htmlFor="service">
                Service Interested
              </label>
              <select
                id="service"
                value={form.service ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, service: e.target.value }))}
                onBlur={() => setTouched((t) => ({ ...t, service: true }))}
                className={errorClass(Boolean(fieldError("service")))}
                aria-invalid={Boolean(fieldError("service"))}
              >
                <option value="">Select a service</option>
                <option value="data-platform">Data Platform</option>
                <option value="ai-analytics">AI Analytics</option>
                <option value="machine-learning">Machine Learning</option>
                <option value="custom-ai">Custom AI Solutions</option>
                <option value="consulting">Consulting</option>
                <option value="other">Other</option>
              </select>
            </div>

            {type === "demo" && (
              <>
                <div>
                  <label className="text-sm font-semibold text-brand-fg/80" htmlFor="demoDate">
                    Preferred Date
                  </label>
                  <input
                    id="demoDate"
                    type="date"
                    value={form.demoDate ?? ""}
                    onChange={(e) => setForm((p) => ({ ...p, demoDate: e.target.value }))}
                    onBlur={() => setTouched((t) => ({ ...t, demoDate: true }))}
                    className={errorClass(Boolean(fieldError("demoDate")))}
                    min={new Date().toISOString().split('T')[0]}
                    aria-invalid={Boolean(fieldError("demoDate"))}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-brand-fg/80" htmlFor="demoTime">
                    Preferred Time
                  </label>
                  <select
                    id="demoTime"
                    value={form.demoTime ?? ""}
                    onChange={(e) => setForm((p) => ({ ...p, demoTime: e.target.value }))}
                    onBlur={() => setTouched((t) => ({ ...t, demoTime: true }))}
                    className={errorClass(Boolean(fieldError("demoTime")))}
                    aria-invalid={Boolean(fieldError("demoTime"))}
                  >
                    <option value="">Select time</option>
                    <option value="9:00 AM">9:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="1:00 PM">1:00 PM</option>
                    <option value="2:00 PM">2:00 PM</option>
                    <option value="3:00 PM">3:00 PM</option>
                    <option value="4:00 PM">4:00 PM</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-sm font-semibold text-brand-fg/80" htmlFor="useCase">
                    Use Case / Project Details
                  </label>
                  <textarea
                    id="useCase"
                    value={form.useCase ?? ""}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, useCase: e.target.value }))
                    }
                    onBlur={() => setTouched((t) => ({ ...t, useCase: true }))}
                    rows={4}
                    className={errorClass(Boolean(fieldError("useCase")))}
                    placeholder="Tell us about your specific use case or project requirements."
                    aria-invalid={Boolean(fieldError("useCase"))}
                  />
                </div>
              </>
            )}

            <div className="sm:col-span-2">
              <label className="text-sm font-semibold text-brand-fg/80" htmlFor="message">
                {type === "demo" ? "Additional Notes" : "Message"} *
              </label>
              <textarea
                id="message"
                required
                value={form.message ?? ""}
                onChange={(e) =>
                  setForm((p) => ({ ...p, message: e.target.value }))
                }
                onBlur={() => setTouched((t) => ({ ...t, message: true }))}
                rows={7}
                className={errorClass(Boolean(fieldError("message")))}
                placeholder={type === "demo" ? "Any additional questions or requirements?" : "What are you trying to achieve? Include constraints, timelines, and where you are today."}
                aria-invalid={Boolean(fieldError("message"))}
              />
              {showErrorFor("message") && fieldError("message") ? (
                <p className="mt-2 text-xs text-red-200">{fieldError("message")}</p>
              ) : (
                <p className="mt-2 text-xs text-brand-fg/60">
                  Minimum 10 characters. Please avoid sharing sensitive personal
                  or health information.
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={status.kind === "loading"}
              className={cn(
                "inline-flex h-11 items-center justify-center rounded-md bg-green-500 px-5 text-sm font-semibold text-white shadow-sm shadow-black/10 transition",
                "hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-70",
                "hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg",
              )}
            >
              {status.kind === "loading" ? "Sending..." : "Send Message"}
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
                    vivekrajput1924345@gmail.com
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

