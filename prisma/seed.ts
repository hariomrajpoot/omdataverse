import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Content ported from the live OmansAi site. Idempotent: upserts by slug, so
// re-running won't duplicate. Run with: npx prisma db seed

const caseStudies = [
  {
    slug: "advanced-sql-optimization",
    title: "Advanced SQL Performance Optimization",
    industry: "FinTech",
    excerpt:
      "Transformed slow-running analytical queries into sub-second responses through indexing, partitioning, and query rewrites.",
    problem:
      "Critical analytical queries were taking 45+ seconds and pinning the database at 95% DTU, blocking reporting and risking timeouts during peak load.",
    approach: [
      "Profiled the workload with Query Store to find the costliest plans.",
      "Redesigned indexing and applied partitioning to the hottest tables.",
      "Rewrote key queries to eliminate scans and parameter-sniffing issues.",
    ],
    outcomes: [
      { label: "Query time", value: "45s → 0.8s" },
      { label: "DTU utilization", value: "95% → 35%" },
      { label: "Timeouts", value: "Eliminated" },
    ],
    technologies: ["Azure SQL", "T-SQL", "Query Store"],
    publishedAt: "2026-03-15T00:00:00.000Z",
  },
  {
    slug: "healthcare-lakehouse",
    title: "Modern Lakehouse for a Healthcare Network",
    industry: "Healthcare",
    excerpt:
      "Unified siloed clinical + operational datasets, improved data quality, and accelerated reporting from weeks to hours.",
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
    slug: "azure-ml-demand-forecasting",
    title: "Azure ML Pipeline for Demand Forecasting",
    industry: "Manufacturing",
    excerpt:
      "Built an automated ML pipeline on Azure that improved demand forecasting accuracy by 40% for a CPG company.",
    problem:
      "Manual, spreadsheet-based forecasts were inaccurate and slow, driving overstock and frequent stockouts.",
    approach: [
      "Engineered features from sales, seasonality, and promotions data.",
      "Trained and registered models with automated retraining in Azure ML.",
      "Surfaced forecasts to planners through Power BI.",
    ],
    outcomes: [
      { label: "Forecast accuracy", value: "+40%" },
      { label: "Inventory waste", value: "-28%" },
      { label: "Planning effort", value: "Mostly automated" },
    ],
    technologies: ["Azure ML", "Python", "Power BI"],
    publishedAt: "2026-02-20T00:00:00.000Z",
  },
  {
    slug: "power-bi-semantic-layer",
    title: "Enterprise Power BI Semantic Layer",
    industry: "Retail",
    excerpt:
      "Established a centralized Power BI semantic model enabling trustworthy self-service analytics across business units.",
    problem:
      "Each team built its own reports with conflicting metric definitions, eroding trust in the numbers.",
    approach: [
      "Designed a governed, central semantic model with certified measures.",
      "Standardized metric definitions across all business units.",
      "Enabled self-service report building on top of the shared model.",
    ],
    outcomes: [
      { label: "Report creation time", value: "-70%" },
      { label: "Metric consistency", value: "100%" },
      { label: "Self-service adoption", value: "Org-wide" },
    ],
    technologies: ["Power BI", "Azure SQL", "Azure AD"],
    publishedAt: "2026-02-10T00:00:00.000Z",
  },
  {
    slug: "support-copilot",
    title: "Operations Copilot for Customer Support",
    industry: "SaaS",
    excerpt:
      "A deterministic-first copilot reduced repetitive tickets and standardized troubleshooting steps.",
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
    technologies: ["Next.js", "Azure OpenAI", "Postgres"],
    publishedAt: "2026-02-05T00:00:00.000Z",
  },
  {
    slug: "azure-devops-data-pipelines",
    title: "Azure DevOps CI/CD for Data Pipelines",
    industry: "Manufacturing",
    excerpt:
      "Implemented end-to-end CI/CD for 40+ data pipelines using Azure DevOps, eliminating manual deployments.",
    problem:
      "Manual deployments across 40+ pipelines were error-prone and slow, with frequent failed releases.",
    approach: [
      "Built CI/CD pipelines in Azure DevOps for data assets.",
      "Added automated validation gates and environment promotion.",
      "Introduced rollback and deployment observability.",
    ],
    outcomes: [
      { label: "Deployment frequency", value: "Monthly → daily" },
      { label: "Failed deployments", value: "-85%" },
      { label: "Manual steps", value: "Eliminated" },
    ],
    technologies: ["Azure DevOps", "Azure Data Factory", "Databricks"],
    publishedAt: "2026-01-25T00:00:00.000Z",
  },
  {
    slug: "databricks-medallion-ecommerce",
    title: "Databricks Medallion Architecture for E-Commerce",
    industry: "Retail",
    excerpt:
      "Migrated a legacy on-premises warehouse to a scalable Databricks Lakehouse with medallion layers.",
    problem:
      "An aging on-prem warehouse couldn't keep up with data volume; ETL ran for 8 hours and storage costs climbed.",
    approach: [
      "Designed bronze/silver/gold medallion layers on Delta Lake.",
      "Re-platformed ETL onto Apache Spark for parallel processing.",
      "Optimized storage with Delta features and lifecycle policies.",
    ],
    outcomes: [
      { label: "ETL runtime", value: "8 hrs → 22 min" },
      { label: "Storage cost", value: "-45%" },
      { label: "Scalability", value: "Elastic" },
    ],
    technologies: ["Databricks", "Delta Lake", "Apache Spark"],
    publishedAt: "2026-01-15T00:00:00.000Z",
  },
  {
    slug: "azure-synapse-realtime",
    title: "Azure Synapse Real-Time Analytics Platform",
    industry: "Logistics",
    excerpt:
      "Deployed an Azure Synapse platform that unified batch and streaming data for real-time dashboards.",
    problem:
      "Dashboards lagged 24 hours behind operations, so fleet decisions were always reactive.",
    approach: [
      "Ingested streaming telemetry via Event Hubs.",
      "Unified batch + streaming in Azure Synapse.",
      "Delivered near-real-time dashboards in Power BI.",
    ],
    outcomes: [
      { label: "Data freshness", value: "24 hrs → 30 sec" },
      { label: "Fleet utilization", value: "+18%" },
      { label: "Decisions", value: "Proactive" },
    ],
    technologies: ["Azure Synapse", "Event Hubs", "Power BI"],
    publishedAt: "2026-01-05T00:00:00.000Z",
  },
  {
    slug: "cost-controlled-scaling",
    title: "Cost-Controlled Data Platform Scaling",
    industry: "FinTech",
    excerpt:
      "Introduced IaC, autoscaling policies, and observability to reduce cloud spend without sacrificing reliability.",
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
    technologies: ["Azure", "Terraform", "GitHub Actions"],
    publishedAt: "2025-12-20T00:00:00.000Z",
  },
  {
    slug: "purview-data-governance",
    title: "Data Governance Framework with Microsoft Purview",
    industry: "Healthcare",
    excerpt:
      "Established enterprise-wide data governance using Microsoft Purview, achieving GDPR compliance in 8 weeks.",
    problem:
      "No centralized catalog or lineage meant audit prep took weeks and compliance risk was high.",
    approach: [
      "Rolled out Microsoft Purview for cataloging and lineage.",
      "Auto-classified sensitive assets and applied policies.",
      "Built audit-ready reporting on coverage and access.",
    ],
    outcomes: [
      { label: "Audit prep", value: "6 weeks → 3 days" },
      { label: "Classified assets", value: "2,400+" },
      { label: "GDPR compliance", value: "8 weeks" },
    ],
    technologies: ["Microsoft Purview", "Azure Data Factory", "Power BI"],
    publishedAt: "2025-12-10T00:00:00.000Z",
  },
];

const trainings = [
  {
    slug: "power-bi-2-day-bootcamp",
    title: "Power BI 2-Day Bootcamp",
    level: "Beginner",
    duration: "2 days",
    summary:
      "A fast, hands-on introduction to Power BI — from connecting data to publishing your first interactive dashboards.",
    topics: [
      "Power BI Desktop fundamentals",
      "Connecting and transforming data",
      "Building visuals and dashboards",
      "Publishing and sharing reports",
    ],
    category: "bootcamp",
    rating: 4.8,
    capacity: 30,
    eventDate: new Date("2026-08-15T09:00:00.000Z"),
    order: 1,
  },
  {
    slug: "power-bi-training",
    title: "Power BI Training",
    level: "All Levels",
    duration: "3 days",
    summary:
      "A complete Power BI program covering the four core pillars from data preparation to polished, shareable reports.",
    topics: [
      "Data Preparation (Power Query): clean and shape messy data",
      "Data Modeling: relationships and star schemas",
      "DAX: measures and calculated columns",
      "Report design, publishing, and governance",
    ],
    category: "workshop",
    rating: 4.9,
    capacity: 25,
    eventDate: new Date("2026-09-01T09:00:00.000Z"),
    order: 2,
  },
  {
    slug: "databricks-training",
    title: "Databricks Training",
    level: "All Levels",
    duration: "12 days",
    summary:
      "A comprehensive hands-on program building scalable data pipelines on the Databricks Lakehouse Platform.",
    topics: [
      "Apache Spark for large-scale processing",
      "Delta Lake and the medallion architecture",
      "Building and orchestrating Databricks Jobs",
      "Workflow automation and optimization",
    ],
    category: "masterclass",
    rating: 4.9,
    capacity: 20,
    eventDate: new Date("2026-09-20T09:00:00.000Z"),
    order: 3,
  },
];

const services = [
  {
    slug: "data-foundations",
    title: "Data Foundations",
    category: "Data Foundations",
    summary:
      "Model, govern, and operationalize your data so analytics and AI are reliable, secure, and scalable.",
    highlights: ["Lakehouse patterns", "Data quality", "Governance + RBAC"],
    order: 1,
  },
  {
    slug: "ai-automation",
    title: "AI & Automation",
    category: "AI & Automation",
    summary:
      "Ship practical copilots and agents with guardrails—reduce toil, improve throughput, and keep humans in control.",
    highlights: ["Copilot UX", "Agent workflows", "Safety + evals"],
    order: 2,
  },
  {
    slug: "advanced-analytics",
    title: "Advanced Analytics",
    category: "Advanced Analytics",
    summary:
      "From KPI trees to forecasting: build decision systems stakeholders trust and adopt.",
    highlights: ["Semantic models", "Experimentation", "Forecasting"],
    order: 3,
  },
  {
    slug: "infra-devops",
    title: "Infrastructure & DevOps",
    category: "Infrastructure & DevOps",
    summary:
      "Automate deployments, cost controls, and observability so platforms run reliably in production.",
    highlights: ["IaC", "CI/CD", "Observability"],
    order: 4,
  },
];

const projects = [
  {
    slug: "school-management-system",
    title: "School Management System",
    industry: "Education",
    summary:
      "Platform for student management, timetabling, attendance, and finance — replacing spreadsheets and paper forms.",
    problem:
      "The school depended on spreadsheets and paper forms for admissions, attendance, and fee collection — leading to errors and no single source of truth.",
    approach: [
      "Role-based access for administrators, educators, and parents.",
      "Dynamic timetable engine with clash detection.",
      "Digital attendance with automatic parent notifications.",
      "Finance dashboard tracking fees and payments.",
    ],
    outcomes: [
      { label: "Admin time saved", value: "15 hrs/week" },
      { label: "Fee collection rate", value: "+28%" },
      { label: "Attendance accuracy", value: "99.5%" },
    ],
    technologies: ["Laravel", "Livewire", "MariaDB", "Tailwind CSS"],
    order: 1,
  },
  {
    slug: "ai-chatbot-lead-capture",
    title: "AI Chatbot Platform",
    industry: "SaaS",
    summary:
      "Conversational AI system that captures leads and books demos automatically.",
    problem:
      "Inbound visitors had no instant way to get answers or book a demo, so leads slipped away after hours.",
    approach: [
      "Built a Gemini-powered assistant trained on the service catalog.",
      "Added in-chat lead capture and demo booking.",
      "Routed qualified leads into the CRM automatically.",
    ],
    outcomes: [
      { label: "Lead capture", value: "24/7" },
      { label: "Response time", value: "Instant" },
      { label: "Demo bookings", value: "Automated" },
    ],
    technologies: ["Next.js", "Gemini API", "TypeScript", "Tailwind CSS"],
    order: 2,
  },
  {
    slug: "green-express-ecommerce",
    title: "Green Express E-Commerce",
    industry: "Retail",
    summary:
      "Online vegetable delivery store with product catalogue and order management.",
    problem:
      "A local grocer needed an online storefront with catalogue, cart, and order tracking to reach more customers.",
    approach: [
      "Built a product catalogue with categories and search.",
      "Implemented cart, checkout, and order management.",
      "Added an admin panel for inventory and orders.",
    ],
    outcomes: [
      { label: "Online orders", value: "Enabled" },
      { label: "Catalogue", value: "Self-managed" },
      { label: "Order tracking", value: "End-to-end" },
    ],
    technologies: ["Laravel", "Livewire", "Tailwind CSS", "MySQL"],
    order: 3,
  },
  {
    slug: "restaurant-food-delivery",
    title: "Restaurant Ordering System",
    industry: "Food & Beverage",
    summary:
      "Restaurant order management and food delivery platform with real-time tracking.",
    problem:
      "The restaurant juggled phone orders and manual dispatch, with no visibility into delivery status.",
    approach: [
      "Built online ordering with menu management.",
      "Added kitchen and dispatch workflows.",
      "Implemented real-time order tracking via Pusher.",
    ],
    outcomes: [
      { label: "Order handling", value: "Streamlined" },
      { label: "Delivery tracking", value: "Real-time" },
      { label: "Phone-order load", value: "Reduced" },
    ],
    technologies: ["Laravel", "Livewire", "Tailwind CSS", "Pusher"],
    order: 4,
  },
  {
    slug: "smart-hair-beauty-platform",
    title: "Smart Hair Beauty Platform",
    industry: "Beauty & Wellness",
    summary:
      "Business platform for hair replacement services with bookings and CRM.",
    problem:
      "The business managed consultations and client records manually, making follow-ups and bookings hard to track.",
    approach: [
      "Built an online booking and consultation scheduler.",
      "Added a CRM for client records and history.",
      "Created service and pricing management.",
    ],
    outcomes: [
      { label: "Bookings", value: "Online" },
      { label: "Client records", value: "Centralized" },
      { label: "Follow-ups", value: "Tracked" },
    ],
    technologies: ["Laravel", "Livewire", "Tailwind CSS", "MySQL"],
    order: 5,
  },
];

async function main() {
  for (const cs of caseStudies) {
    const { slug, publishedAt, ...rest } = cs;
    await prisma.caseStudy.upsert({
      where: { slug },
      update: { ...rest, publishedAt: new Date(publishedAt) },
      create: { slug, ...rest, publishedAt: new Date(publishedAt) },
    });
  }
  console.log(`Seeded ${caseStudies.length} case studies`);

  for (const t of trainings) {
    const { slug, ...rest } = t;
    await prisma.training.upsert({ where: { slug }, update: rest, create: { slug, ...rest } });
  }
  console.log(`Seeded ${trainings.length} trainings`);

  for (const p of projects) {
    const { slug, ...rest } = p;
    await prisma.project.upsert({ where: { slug }, update: rest, create: { slug, ...rest } });
  }
  console.log(`Seeded ${projects.length} projects`);

  for (const s of services) {
    const { slug, ...rest } = s;
    await prisma.service.upsert({ where: { slug }, update: rest, create: { slug, ...rest } });
  }
  console.log(`Seeded ${services.length} services`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
