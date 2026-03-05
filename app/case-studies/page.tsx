import type { Metadata } from "next";
import Link from "next/link";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { getCaseStudies } from "@/lib/caseStudies";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Real-world examples of Microsoft data platforms, analytics, and AI—delivered in weeks with security, governance, and measurable results.",
};

export const revalidate = 60;

export default async function CaseStudiesPage() {
  const caseStudies = await getCaseStudies();

  return (
    <div>
      <header className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-brand-fg sm:text-4xl">
          Case Studies
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-brand-fg/70 sm:text-base">
          See how enterprises moved from siloed data to Microsoft Fabric-based
          platforms, Databricks Medallion architectures, and Copilot agents—often
          in a matter of weeks. (If Sanity is not configured, this page uses local
          mock data.)
        </p>
        <div className="mt-6">
          <Link
            href="/contact?intent=case-study"
            className="inline-flex h-11 items-center justify-center rounded-md bg-brand-primary px-5 text-sm font-semibold text-brand-onPrimary shadow-sm shadow-black/10 transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg"
          >
            Discuss a similar project
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {caseStudies.map((cs) => (
            <CaseStudyCard key={cs.slug} caseStudy={cs} />
          ))}
        </div>
      </section>
    </div>
  );
}

