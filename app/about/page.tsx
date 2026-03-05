import type { Metadata } from "next";
import { mockTeam } from "@/lib/mockData";
import { CTASection } from "@/components/CTASection";

export const metadata: Metadata = {
  title: "About",
  description:
    "Our approach: enterprise-grade delivery with modern product and engineering practices.",
};

export default function AboutPage() {
  const founder = mockTeam[0];

  return (
    <div>
      <header className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-brand-fg sm:text-4xl">
          About
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-brand-fg/70 sm:text-base">
          We help teams modernize data platforms and ship applied AI—without
          compromising security, governance, or clarity.
        </p>
      </header>

      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-brand-border/10 bg-brand-surface p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold tracking-tight text-brand-fg">
              Our approach
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-6 text-brand-fg/70">
              <p>
                We start with fundamentals: definitions, governance, quality,
                and operating models. Then we accelerate delivery using modern
                engineering practices—CI/CD, IaC, observability, and measurable
                milestones.
              </p>
              <p>
                For AI, we design deterministic-first experiences and agent
                workflows with explicit guardrails. That means tool access is
                least privilege, actions are auditable, and humans retain
                control of high-risk steps.
              </p>
            </div>
          </div>

          <aside className="rounded-2xl border border-brand-border/10 bg-brand-surface p-6">
            <h2 className="text-sm font-semibold text-brand-fg">Founder</h2>
            <div className="mt-4">
              <div className="text-base font-semibold text-brand-fg">
                {founder?.name}
              </div>
              <div className="text-sm text-brand-fg/70">{founder?.role}</div>
              <p className="mt-3 text-sm leading-6 text-brand-fg/70">
                {founder?.bio}
              </p>
            </div>
          </aside>
        </div>
      </section>

      <CTASection
        title="Want a clear plan before you commit?"
        subtitle="Start with a Data Strategy Audit. We’ll map risks, quick wins, and a safe delivery sequence."
        cta={{ label: "Book audit", href: "/contact?intent=audit" }}
        secondary={{ label: "View case studies", href: "/case-studies" }}
      />
    </div>
  );
}

