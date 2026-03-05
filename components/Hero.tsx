import Link from "next/link";
import { cn } from "@/lib/utils";

export interface HeroProps {
  title: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  chips?: string[];
}

export function Hero({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  chips = ["Microsoft Fabric", "Azure", "Databricks", "Modern DevOps"],
}: HeroProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(700px_circle_at_15%_10%,rgba(233,244,90,0.35),transparent_60%),radial-gradient(700px_circle_at_85%_20%,rgba(11,18,21,0.14),transparent_55%)] dark:bg-[radial-gradient(700px_circle_at_15%_10%,rgba(233,244,90,0.22),transparent_60%),radial-gradient(700px_circle_at_85%_20%,rgba(255,255,255,0.08),transparent_55%)]" />
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-brand-border/10 bg-brand-surface px-3 py-1 text-xs text-brand-fg/80">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-accent" />
              Dark-mode, enterprise-ready delivery
            </p>
            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight text-brand-fg sm:text-5xl">
              {title}
            </h1>
            <p className="mt-4 max-w-xl text-pretty text-base leading-7 text-brand-fg/70 sm:text-lg">
              {subtitle}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href={primaryCta.href}
                className={cn(
                  "inline-flex h-11 items-center justify-center rounded-md bg-brand-primary px-5 text-sm font-semibold text-brand-onPrimary shadow-sm shadow-black/10 transition",
                  "hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg",
                )}
              >
                {primaryCta.label}
              </Link>
              {secondaryCta ? (
                <Link
                  href={secondaryCta.href}
                  className={cn(
                    "inline-flex h-11 items-center justify-center rounded-md border border-brand-border/15 bg-brand-surface px-5 text-sm font-semibold text-brand-fg/90 transition",
                    "hover:bg-brand-surface/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg",
                  )}
                >
                  {secondaryCta.label}
                </Link>
              ) : null}
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {chips.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-brand-surface px-3 py-1 text-xs text-brand-fg/70 ring-1 ring-brand-border/10"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-brand-border/10 bg-brand-surface p-6 shadow-sm shadow-black/15">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-brand-fg">
                Delivery blueprint
              </div>
              <div className="text-xs text-brand-fg/60">2–6 weeks to impact</div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Foundations",
                  desc: "Governance, modeling, quality, and cost controls.",
                },
                {
                  title: "Acceleration",
                  desc: "Copilots + automation with deterministic guardrails.",
                },
                {
                  title: "Analytics",
                  desc: "Semantic layers and KPI systems teams trust.",
                },
                {
                  title: "Production",
                  desc: "SLOs, observability, CI/CD, and secure operations.",
                },
              ].map((x) => (
                <div
                  key={x.title}
                  className="rounded-xl border border-brand-border/10 bg-brand-bg/60 p-4"
                >
                  <div className="text-sm font-semibold text-brand-fg">
                    {x.title}
                  </div>
                  <div className="mt-1 text-sm leading-6 text-brand-fg/70">
                    {x.desc}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-xl bg-gradient-to-r from-brand-accent/35 to-brand-primary/10 p-4 ring-1 ring-brand-border/10">
              <div className="text-xs font-semibold uppercase tracking-wide text-brand-fg/70">
                Typical outcomes
              </div>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {[
                  { k: "Cycle time", v: "↓ 20–40%" },
                  { k: "Quality", v: "↑ trust" },
                  { k: "Cost", v: "↓ waste" },
                ].map((s) => (
                  <div key={s.k} className="text-sm">
                    <div className="text-brand-fg/60">{s.k}</div>
                    <div className="font-semibold text-brand-fg">{s.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/**
       * Story-like usage:
       * <Hero
       *   title="Data platforms and AI—delivered responsibly."
       *   subtitle="Build a durable data foundation, then ship copilots and analytics that move KPIs."
       *   primaryCta={{ label: "Book Data Strategy Audit", href: "/contact?intent=audit" }}
       *   secondaryCta={{ label: "View case studies", href: "/case-studies" }}
       * />
       */}
    </section>
  );
}

