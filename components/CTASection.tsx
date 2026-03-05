import Link from "next/link";
import { cn } from "@/lib/utils";

export interface CTASectionProps {
  title: string;
  subtitle: string;
  cta: { label: string; href: string };
  secondary?: { label: string; href: string };
}

export function CTASection({ title, subtitle, cta, secondary }: CTASectionProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
      <div className="relative overflow-hidden rounded-3xl border border-brand-border/10 bg-gradient-to-r from-brand-accent/40 to-brand-surface p-8 shadow-sm shadow-black/15 sm:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(700px_circle_at_20%_15%,rgba(255,255,255,0.18),transparent_60%)] dark:bg-[radial-gradient(700px_circle_at_20%_15%,rgba(233,244,90,0.12),transparent_60%)]" />
        <div className="relative grid items-center gap-6 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-brand-fg sm:text-3xl">
              {title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-brand-fg/75 sm:text-base">
              {subtitle}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
            <Link
              href={cta.href}
              className={cn(
                "inline-flex h-11 items-center justify-center rounded-md bg-brand-primary px-5 text-sm font-semibold text-brand-onPrimary transition",
                "hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg",
              )}
            >
              {cta.label}
            </Link>
            {secondary ? (
              <Link
                href={secondary.href}
                className={cn(
                  "inline-flex h-11 items-center justify-center rounded-md border border-brand-border/15 bg-brand-bg/60 px-5 text-sm font-semibold text-brand-fg transition",
                  "hover:bg-brand-bg/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg",
                )}
              >
                {secondary.label}
              </Link>
            ) : null}
          </div>
        </div>
      </div>

      {/**
       * Story-like usage:
       * <CTASection
       *   title="Book a Data Strategy Audit"
       *   subtitle="In 45 minutes, we’ll map risks, quick wins, and a delivery plan."
       *   cta={{ label: "Book audit", href: "/contact?intent=audit" }}
       *   secondary={{ label: "View services", href: "/services" }}
       * />
       */}
    </section>
  );
}

