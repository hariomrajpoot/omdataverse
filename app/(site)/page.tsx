import Link from "next/link";
import { Hero } from "@/components/Hero";
import { TechStack } from "@/components/TechStack";
import { ServicesGrid } from "@/components/ServicesGrid";
import { MetricsSection } from "@/components/MetricsSection";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { CTASection } from "@/components/CTASection";
import { Reveal } from "@/components/motion/Reveal";
import { getCaseStudies, getServices } from "@/lib/content";

// Featured case studies and services are pulled from the (admin-managed) database.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [services, allCaseStudies] = await Promise.all([getServices(), getCaseStudies()]);
  const featuredCaseStudies = allCaseStudies.slice(0, 3);

  return (
    <>
      <Hero
        title="Accelerate Your Data Platform"
        subtitle="Transform raw data into autonomous intelligence with Microsoft Cloud expertise—delivered in weeks, with enterprise security and measurable outcomes."
        primaryCta={{ label: "Book a Strategy Audit", href: "/contact?intent=audit" }}
        secondaryCta={{ label: "View our services", href: "/services" }}
      />

      {/* Social proof: technology trust strip */}
      <TechStack />

      {/* Features / services grid */}
      <ServicesGrid
        title="What we do"
        subtitle="Four practice areas that map to real delivery milestones—from data foundations to production AI."
        services={services}
      />

      {/* Results / metrics */}
      <MetricsSection />

      {/* Social proof: testimonials */}
      <Testimonials />

      {/* Proof: featured case studies */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <Reveal
          as="header"
          className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-brand-fg sm:text-4xl">
              Case studies
            </h2>
            <p className="mt-2 text-base leading-7 text-brand-fg/70">
              Measurable outcomes and durable architectures.
            </p>
          </div>
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-fg/85 transition-colors hover:text-brand-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg"
          >
            See all <span aria-hidden="true">→</span>
          </Link>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featuredCaseStudies.map((cs, i) => (
            <Reveal key={cs.slug} delay={i * 0.08}>
              <CaseStudyCard caseStudy={cs} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Objection handling */}
      <FAQ />

      {/* Conversion */}
      <CTASection
        title="Book a Data Strategy Audit"
        subtitle="In 45 minutes, we'll map risks, quick wins, and a delivery plan tailored to your environment."
        cta={{ label: "Book audit", href: "/contact?intent=audit" }}
        secondary={{ label: "See accelerator", href: "/accelerator" }}
      />
    </>
  );
}
