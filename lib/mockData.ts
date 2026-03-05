import type { CaseStudy, Service, TeamMember, SiteSettings } from "@/lib/types";

export const mockSiteSettings: SiteSettings = {
  companyName: "OM Dataverse",
  tagline: "Enterprise-grade data & AI delivery. Measurable outcomes, fast.",
  contactEmail: "hello@example.com",
};

export const mockServices: Service[] = [
  {
    title: "Data Foundations",
    slug: "data-foundations",
    summary:
      "Model, govern, and operationalize your data so analytics and AI are reliable, secure, and scalable.",
    category: "Data Foundations",
    highlights: ["Lakehouse patterns", "Data quality", "Governance + RBAC"],
  },
  {
    title: "AI & Automation",
    slug: "ai-automation",
    summary:
      "Ship practical copilots and agents with guardrails—reduce toil, improve throughput, and keep humans in control.",
    category: "AI & Automation",
    highlights: ["Copilot UX", "Agent workflows", "Safety + evals"],
  },
  {
    title: "Advanced Analytics",
    slug: "advanced-analytics",
    summary:
      "From KPI trees to forecasting: build decision systems stakeholders trust and adopt.",
    category: "Advanced Analytics",
    highlights: ["Semantic models", "Experimentation", "Forecasting"],
  },
  {
    title: "Infrastructure & DevOps",
    slug: "infra-devops",
    summary:
      "Automate deployments, cost controls, and observability so platforms run reliably in production.",
    category: "Infrastructure & DevOps",
    highlights: ["IaC", "CI/CD", "Observability"],
  },
];

export const mockCaseStudies: CaseStudy[] = [
  {
    title: "Modern Lakehouse for a Healthcare Network",
    slug: "healthcare-lakehouse",
    excerpt:
      "Unified siloed clinical + operational datasets, improved data quality, and accelerated reporting from weeks to hours.",
    industry: "Healthcare",
    problem:
      "Fragmented data sources and inconsistent definitions made reporting slow and compliance reviews difficult.",
    approach: [
      "Implemented a medallion architecture with strong lineage.",
      "Established a canonical KPI layer and data quality checks.",
      "Rolled out role-based access and audit-friendly workflows.",
    ],
    outcomes: [
      { label: "Reporting cycle", value: "2–3 weeks → < 24 hours" },
      { label: "Data quality incidents", value: "-60%" },
      { label: "Analyst productivity", value: "+35%" },
    ],
    technologies: ["Azure", "Databricks", "Power BI", "dbt"],
    publishedAt: "2026-03-01T00:00:00.000Z",
  },
  {
    title: "Operations Copilot for Customer Support",
    slug: "support-copilot",
    excerpt:
      "A deterministic-first copilot reduced repetitive tickets and standardized troubleshooting steps.",
    industry: "SaaS",
    problem:
      "Support engineers spent time on repeatable diagnostics; knowledge was tribal and inconsistent.",
    approach: [
      "Designed a safe copilot UX with citations and escalation paths.",
      "Created a rules + retrieval layer over internal runbooks.",
      "Implemented lightweight evaluations and feedback loops.",
    ],
    outcomes: [
      { label: "Time-to-first-response", value: "-25%" },
      { label: "Repeat tickets", value: "-18%" },
      { label: "Runbook adoption", value: "3×" },
    ],
    technologies: ["Next.js", "Azure OpenAI", "Postgres", "Plausible"],
    publishedAt: "2026-02-10T00:00:00.000Z",
  },
  {
    title: "Cost-Controlled Data Platform Scaling",
    slug: "cost-controlled-scaling",
    excerpt:
      "Introduced IaC, autoscaling policies, and observability to reduce cloud spend without sacrificing reliability.",
    industry: "FinTech",
    problem:
      "Unpredictable workload spikes led to overprovisioning and frequent on-call escalations.",
    approach: [
      "Baseline SLOs and instrument end-to-end telemetry.",
      "Terraform + CI/CD for repeatable environment builds.",
      "Cost guardrails and workload-aware scheduling.",
    ],
    outcomes: [
      { label: "Cloud spend", value: "-22%" },
      { label: "Incidents", value: "-40%" },
      { label: "Deployment frequency", value: "+2.5×" },
    ],
    technologies: ["Azure", "Terraform", "GitHub Actions", "Grafana"],
    publishedAt: "2026-01-05T00:00:00.000Z",
  },
];

export const mockTeam: TeamMember[] = [
  {
    name: "Vivek (Founder)",
    role: "Data + AI Architect",
    bio: "Built data platforms and analytics systems across regulated and high-growth environments. Focused on pragmatic delivery, security, and measurable outcomes.",
  },
];

export function isSanityConfigured() {
  return Boolean(process.env.SANITY_PROJECT_ID && process.env.SANITY_DATASET);
}

