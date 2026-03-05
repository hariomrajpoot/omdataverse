import type { Metadata } from "next";
import { ServicesGrid } from "@/components/ServicesGrid";
import { sanityFetch } from "@/lib/sanity/fetch";
import { servicesQuery } from "@/lib/sanity/queries";
import { isSanityConfigured, mockServices } from "@/lib/mockData";
import type { Service } from "@/lib/types";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Build your enterprise data platform in weeks, not months—Fabric, Azure Data Factory, Databricks, Power BI, and Azure OpenAI delivered as a cohesive Microsoft data estate.",
};

export default async function ServicesPage() {
  const useSanity = isSanityConfigured();
  const services = useSanity
    ? await sanityFetch<Service[]>({ query: servicesQuery })
    : mockServices;

  return (
    <div>
      <header className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-brand-fg sm:text-4xl">
          Data &amp; AI Services
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-brand-fg/70 sm:text-base">
          Build rock-solid Microsoft data foundations, ship Copilot agents, and
          wire up analytics that leaders actually use—designed so your enterprise
          data platform goes live in weeks, not quarters.
        </p>
      </header>

      <ServicesGrid services={services} />

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {[
            {
              title: "Pillar 1: Data foundations & modern warehouse",
              points: [
                "Microsoft Fabric migration & implementation to a unified OneLake environment—zero data friction, faster onboarding.",
                "Enterprise ETL/ELT with Azure Data Factory (ADF) and SSIS modernization for predictable, resilient pipelines.",
                "Lakehouse Medallion architecture (Bronze / Silver / Gold) on ADLS and Databricks, tuned for petabyte-scale performance.",
                "Automated deployment with Azure DevOps CI/CD for zero-downtime releases and repeatable environments.",
              ],
            },
            {
              title: "Pillar 2: AI, ML & agentic automation",
              points: [
                "Custom Copilot agents for automated documentation, SQL generation, and instant data discovery over your Fabric estate.",
                "Azure OpenAI integration for summarization, sentiment analysis, and predictive workflows embedded into business processes.",
                "MLOps on Azure’s serverless stack—take models from notebook to production with monitoring, rollback, and guardrails.",
                "Secure prompt and tool design with RBAC, logging, and evaluation suites tuned for regulated environments.",
              ],
            },
            {
              title: "Pillar 3: Advanced analytics & specialized data",
              points: [
                "Genetic and bioinformatics data analysis with cloud-scale compute and reproducible pipelines.",
                "Executive-grade Power BI dashboards on SSAS/Tabular models as a single source of truth.",
                "Serverless integration with Logic Apps and Function Apps for real-time triggers and third-party API orchestration.",
                "Data products and domain-aligned models that teams can own and evolve, not just reports.",
              ],
            },
            {
              title: "Pillar 4: Platform operations & reliability",
              points: [
                "End-to-end observability across Fabric, ADF, Databricks, and Power BI with clear SLOs and runbooks.",
                "Cost optimization and chargeback models to keep your data estate sustainable as it scales.",
                "Security-by-design: RBAC, audit trails, and compliance controls wired into every environment.",
                "Playbooks for incident response, disaster recovery, and safe experimentation.",
              ],
            },
          ].map((s) => (
            <section
              key={s.title}
              className="rounded-2xl border border-brand-border/10 bg-brand-surface p-6"
            >
              <h2 className="text-xl font-semibold tracking-tight text-brand-fg">
                {s.title}
              </h2>
              <ul className="mt-4 space-y-2 text-sm text-brand-fg/70">
                {s.points.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-accent" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}

