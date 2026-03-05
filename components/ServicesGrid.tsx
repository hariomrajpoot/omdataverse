import Link from "next/link";
import type { Service } from "@/lib/types";

export interface ServicesGridProps {
  title?: string;
  subtitle?: string;
  services: Service[];
}

function Icon({ name }: { name: Service["category"] }) {
  const common = "h-5 w-5";
  switch (name) {
    case "Data Foundations":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M6 7c0-2 3-3 6-3s6 1 6 3-3 3-6 3-6-1-6-3Z"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M6 7v5c0 2 3 3 6 3s6-1 6-3V7"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5"
            stroke="currentColor"
            strokeWidth="1.6"
          />
        </svg>
      );
    case "AI & Automation":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M8 10V8.6A3.6 3.6 0 0 1 11.6 5h.8A3.6 3.6 0 0 1 16 8.6V10"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M7.2 10h9.6A2.2 2.2 0 0 1 19 12.2v5.6A2.2 2.2 0 0 1 16.8 20H7.2A2.2 2.2 0 0 1 5 17.8v-5.6A2.2 2.2 0 0 1 7.2 10Z"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M10 15h4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    case "Advanced Analytics":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M5 19V6.8A1.8 1.8 0 0 1 6.8 5H19"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M8 16l3-4 3 2 5-7"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "Infrastructure & DevOps":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M7 10.4a5 5 0 0 1 9.7 1.6h.3A3 3 0 0 1 17 18H8a3 3 0 0 1-1-5.6Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M9.5 18v-2m5 2v-3"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
  }
}

export function ServicesGrid({ title, subtitle, services }: ServicesGridProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
      {(title || subtitle) && (
        <header className="max-w-2xl">
          {title ? (
            <h2 className="text-2xl font-semibold tracking-tight text-brand-fg sm:text-3xl">
              {title}
            </h2>
          ) : null}
          {subtitle ? (
            <p className="mt-3 text-sm leading-6 text-brand-fg/70 sm:text-base">
              {subtitle}
            </p>
          ) : null}
        </header>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((s) => (
          <div
            key={s.slug}
            className="group rounded-2xl border border-brand-border/10 bg-brand-surface p-5 shadow-sm shadow-black/10 transition hover:border-brand-border/20 hover:bg-brand-surface/80"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-accent/35 text-brand-fg ring-1 ring-brand-border/10">
                <Icon name={s.category} />
              </div>
              <span className="rounded-full bg-brand-bg/60 px-2.5 py-1 text-[11px] font-semibold text-brand-fg/70 ring-1 ring-brand-border/10">
                {s.category}
              </span>
            </div>
            <h3 className="mt-4 text-base font-semibold text-brand-fg">
              {s.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-brand-fg/70">
              {s.summary}
            </p>
            {s.highlights?.length ? (
              <ul className="mt-4 space-y-2 text-sm text-brand-fg/70">
                {s.highlights.slice(0, 3).map((h) => (
                  <li key={h} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-accent" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="mt-5">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-fg/85 hover:text-brand-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg"
              >
                Learn more
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/**
       * Story-like usage:
       * <ServicesGrid
       *   title="Services overview"
       *   subtitle="Four practice areas that map to real delivery milestones."
       *   services={mockServices}
       * />
       */}
    </section>
  );
}

