import Link from "next/link";
import { Hero } from "@/components/Hero";
import { BentoGrid } from "@/components/BentoGrid";
import { AISolutions } from "@/components/AISolutions";
import { TechStack } from "@/components/TechStack";
import { MetricsSection } from "@/components/MetricsSection";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { CTASection } from "@/components/CTASection";
import { sanityFetch } from "@/lib/sanity/fetch";
import { caseStudiesQuery, servicesQuery } from "@/lib/sanity/queries";
import { isSanityConfigured, mockCaseStudies, mockServices } from "@/lib/mockData";
import type { CaseStudy, Service } from "@/types";

export default async function Home() {
  const useSanity = isSanityConfigured();

  const [services, caseStudies] = useSanity
    ? await Promise.all([
        sanityFetch<Service[]>({ query: servicesQuery }),
        sanityFetch<CaseStudy[]>({ query: caseStudiesQuery }),
      ])
    : [mockServices, mockCaseStudies];

  const featuredCaseStudies = caseStudies.slice(0, 3);

  return (
    <div>
      <Hero
        title="Accelerate Your Data Platform"
        subtitle="Transform raw data into autonomous intelligence with Microsoft Cloud expertise"
        primaryCta={{ label: "Book a Strategy Audit", href: "/contact?intent=audit" }}
        secondaryCta={{ label: "View our services", href: "/services" }}
      />

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-semibold tracking-tight text-brand-fg sm:text-3xl">
              Why choose us
            </h2>
            <p className="mt-3 text-sm leading-6 text-brand-fg/70 sm:text-base">
              Build a modern Microsoft data estate that moves from raw data to autonomous intelligence—fast, secure, and production-ready.
            </p>
            <div className="mt-6">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-fg/85 hover:text-brand-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg"
              >
                Explore services <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
            {[
              {
                title: "Precision engineering",
                desc: "We don’t just build pipelines; we craft resilient, automated data lifecycles with ADF, ADLS, and Databricks for unbreakable scalability.",
              },
              {
                title: "AI-first approach",
                desc: "Deploy Azure OpenAI and custom Copilot agents to turn your data platform into a self-serving intelligence hub.",
              },
              {
                title: "Specialized expertise",
                desc: "Master complex, high-scale datasets—like genetic and bioinformatics workloads—with enterprise-grade security and compliance.",
              },
              {
                title: "Weeks, not months",
                desc: "Fabric blueprints, accelerator patterns, and CI/CD automation so your enterprise data platform goes live in weeks—not quarters.",
              },
            ].map((x) => (
              <div
                key={x.title}
                className="rounded-2xl border border-brand-border/10 bg-brand-surface p-6"
              >
                <div className="text-base font-semibold text-brand-fg">{x.title}</div>
                <p className="mt-2 text-sm leading-6 text-brand-fg/70">{x.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TechStack />

      <BentoGrid
        title="Services overview"
        subtitle="Four practice areas that map to real delivery milestones—foundation to production."
        services={services}
      />

      <AISolutions />

      <TechStack />

      <MetricsSection />

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-brand-fg sm:text-3xl">
              Case studies
            </h2>
            <p className="mt-2 text-sm leading-6 text-brand-fg/70 sm:text-base">
              A few examples of measurable outcomes and durable architectures.
            </p>
          </div>
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-fg/85 hover:text-brand-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg"
          >
            See all <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featuredCaseStudies.map((cs) => (
            <CaseStudyCard key={cs.slug} caseStudy={cs} />
          ))}
        </div>
      </section>

      <CTASection
        title="Book a Data Strategy Audit"
        subtitle="In 45 minutes, we’ll map risks, quick wins, and a delivery plan tailored to your environment."
        cta={{ label: "Book audit", href: "/contact?intent=audit" }}
        secondary={{ label: "See accelerator", href: "/accelerator" }}
      />
    </div>
  );
}
