import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCaseStudyBySlug } from "@/lib/caseStudies";

// Content is DB-backed and admin-editable, so render on demand.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cs = await getCaseStudyBySlug(slug);
  if (!cs) return { title: "Case Study" };
  return {
    title: cs.title,
    description: cs.excerpt,
  };
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = await getCaseStudyBySlug(slug);
  if (!cs) notFound();

  return (
    <div>
      <header className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="flex flex-wrap items-center gap-2 text-xs text-brand-fg/60">
          <span className="rounded-full bg-brand-surface px-3 py-1 ring-1 ring-brand-border/10">
            {cs.industry}
          </span>
          <span aria-hidden="true">•</span>
          <time dateTime={cs.publishedAt}>
            {new Date(cs.publishedAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>
        <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-brand-fg sm:text-4xl">
          {cs.title}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-brand-fg/70 sm:text-base">
          {cs.excerpt}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-fg/85 hover:text-brand-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg"
          >
            <span aria-hidden="true">←</span> Back to case studies
          </Link>
          <Link
            href="/contact?intent=case-study"
            className="inline-flex h-10 items-center justify-center rounded-md bg-brand-primary px-4 text-sm font-semibold text-brand-onPrimary shadow-sm shadow-black/10 transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg"
          >
            Start a similar project
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <article className="prose max-w-none rounded-2xl border border-brand-border/10 bg-brand-surface p-6 lg:col-span-2 dark:prose-invert">
            <h2>Problem</h2>
            <p>{cs.problem}</p>
            <h2>Approach</h2>
            <ul>
              {cs.approach.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </article>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-brand-border/10 bg-brand-surface p-6">
              <h3 className="text-sm font-semibold text-brand-fg">Outcomes</h3>
              <dl className="mt-4 space-y-3">
                {cs.outcomes.map((o) => (
                  <div key={o.label}>
                    <dt className="text-xs text-brand-fg/60">{o.label}</dt>
                    <dd className="text-sm font-semibold text-brand-fg">{o.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="rounded-2xl border border-brand-border/10 bg-brand-surface p-6">
              <h3 className="text-sm font-semibold text-brand-fg">Technologies</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {cs.technologies.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-brand-bg/60 px-3 py-1 text-xs text-brand-fg/70 ring-1 ring-brand-border/10"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

