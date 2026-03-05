import type { Metadata } from "next";
import { AIPlayground } from "@/components/AIPlayground";
import { CTASection } from "@/components/CTASection";

export const metadata: Metadata = {
  title: "Accelerator",
  description:
    "The Copilot Accelerator: build Microsoft data platforms and Copilot agents in weeks, not months—using Fabric, Azure, and Azure OpenAI.",
};

export default function AcceleratorPage() {
  return (
    <div>
      <header className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-brand-fg sm:text-4xl">
          The Copilot Accelerator
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-brand-fg/70 sm:text-base">
          In a world of slow builds, we use Microsoft Copilot to slash timelines by roughly 60%.
          Automate code generation, pipeline orchestration, and AI agent deployment—while
          competitors are still debugging manually.
        </p>
      </header>

      <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-brand-border/10 bg-brand-surface p-6">
            <h2 className="text-lg font-semibold text-brand-fg">
              How the accelerator works
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-brand-fg/70">
              <li className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-accent" />
                <span>
                  <strong className="font-semibold text-brand-fg">Week 1:</strong>{" "}
                  Strategy audit and Fabric blueprint—map data sources, constraints,
                  and priority use-cases.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-accent" />
                <span>
                  <strong className="font-semibold text-brand-fg">Weeks 2–3:</strong>{" "}
                  Automated lakehouse setup plus Copilot agents live over your core
                  datasets.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-accent" />
                <span>
                  <strong className="font-semibold text-brand-fg">Week 4:</strong>{" "}
                  Production-ready platform with MLOps and executive Power BI
                  dashboards wired into your decision cycles.
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-brand-border/10 bg-brand-surface p-6">
            <h2 className="text-lg font-semibold text-brand-fg">
              What you get in weeks, not months
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-brand-fg/70">
              <li className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-accent" />
                <span>
                  A Microsoft Fabric-based lakehouse with governed access, lineage,
                  and quality checks.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-accent" />
                <span>
                  Copilot agents that handle documentation, SQL suggestions, and
                  instant data discovery.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-accent" />
                <span>
                  A measurable delivery plan, including time-saved and adoption
                  metrics leaders can track.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <AIPlayground />

      <CTASection
        title="Ready to accelerate your Microsoft data platform?"
        subtitle="Book a Copilot Accelerator strategy audit—we’ll review your stack and share a 4-week plan to get a production-ready platform in place."
        cta={{ label: "Start your accelerator journey", href: "/contact?intent=accelerator" }}
        secondary={{ label: "View services", href: "/services" }}
      />
    </div>
  );
}

