import Link from "next/link";
import type { CaseStudy } from "@/lib/types";

export interface CaseStudyCardProps {
  caseStudy: CaseStudy;
}

export function CaseStudyCard({ caseStudy }: CaseStudyCardProps) {
  return (
    <article className="rounded-2xl border border-brand-border/10 bg-brand-surface p-6 shadow-sm shadow-black/10 transition hover:border-brand-border/20 hover:bg-brand-surface/80">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-brand-bg/60 px-2.5 py-1 text-[11px] font-semibold text-brand-fg/70 ring-1 ring-brand-border/10">
          {caseStudy.industry}
        </span>
        <time className="text-xs text-brand-fg/60" dateTime={caseStudy.publishedAt}>
          {new Date(caseStudy.publishedAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
          })}
        </time>
      </div>
      <h3 className="mt-4 text-lg font-semibold tracking-tight text-brand-fg">
        {caseStudy.title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-brand-fg/70">
        {caseStudy.excerpt}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {caseStudy.technologies.slice(0, 4).map((t) => (
          <span
            key={t}
            className="rounded-full bg-brand-bg/60 px-3 py-1 text-xs text-brand-fg/70 ring-1 ring-brand-border/10"
          >
            {t}
          </span>
        ))}
      </div>
      <div className="mt-6">
        <Link
          href={`/case-studies/${caseStudy.slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-fg/85 hover:text-brand-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg"
          aria-label={`Read case study: ${caseStudy.title}`}
        >
          Read case study <span aria-hidden="true">→</span>
        </Link>
      </div>

      {/**
       * Story-like usage:
       * <CaseStudyCard caseStudy={mockCaseStudies[0]} />
       */}
    </article>
  );
}

