import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, AlertTriangle, Lightbulb } from "lucide-react";
import { getProjectBySlug } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project" };
  return { title: project.title, description: project.summary };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-brand-border/40">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-brand-accent/15 via-transparent to-transparent"
        />
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
          <Reveal>
            <Link
              href="/work"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-fg/70 transition-colors hover:text-brand-accent"
            >
              <ArrowLeft className="h-4 w-4" /> All work
            </Link>
            {project.industry && (
              <span className="ml-3 rounded-full bg-brand-surface px-3 py-1 text-xs font-semibold text-brand-fg/70 ring-1 ring-brand-border/10">
                {project.industry}
              </span>
            )}
            <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight text-brand-fg sm:text-5xl">
              {project.title}
            </h1>
            <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-brand-fg/70 sm:text-lg">
              {project.summary}
            </p>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
        {/* Challenge vs Solution */}
        {(project.problem || project.approach.length > 0) && (
          <div className="grid gap-6 lg:grid-cols-2">
            {project.problem && (
              <Reveal className="rounded-2xl border border-brand-border/50 bg-brand-surface/60 p-6">
                <div className="flex items-center gap-2 text-brand-fg">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <h2 className="text-lg font-semibold">The challenge</h2>
                </div>
                <p className="mt-3 text-sm leading-7 text-brand-fg/70">{project.problem}</p>
              </Reveal>
            )}
            {project.approach.length > 0 && (
              <Reveal
                delay={0.08}
                className="rounded-2xl border border-brand-border/50 bg-brand-surface/60 p-6"
              >
                <div className="flex items-center gap-2 text-brand-fg">
                  <Lightbulb className="h-5 w-5 text-brand-accent" />
                  <h2 className="text-lg font-semibold">Our solution</h2>
                </div>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-brand-fg/70">
                  {project.approach.map((a) => (
                    <li key={a} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-accent" />
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
          </div>
        )}

        {/* Results grid */}
        {project.outcomes.length > 0 && (
          <Reveal className="mt-12">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-fg/50">
              Results
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {project.outcomes.map((o) => (
                <div
                  key={o.label}
                  className="rounded-2xl border border-brand-border/50 bg-brand-surface/60 p-6 text-center"
                >
                  <div className="text-2xl font-bold text-brand-fg">{o.value}</div>
                  <div className="mt-1 text-xs text-brand-fg/60">{o.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {/* Technologies */}
        {project.technologies.length > 0 && (
          <Reveal className="mt-12">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-fg/50">
              Built with
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.technologies.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-brand-bg/60 px-3 py-1 text-sm text-brand-fg/70 ring-1 ring-brand-border/10"
                >
                  {t}
                </span>
              ))}
            </div>
          </Reveal>
        )}

        {/* CTA */}
        <Reveal className="mt-16 rounded-3xl border border-brand-border/50 bg-brand-primary px-6 py-12 text-center">
          <h2 className="text-2xl font-bold text-brand-onPrimary">Want something like this?</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-brand-onPrimary/70">
            Tell us what you&apos;re building and we&apos;ll scope a delivery plan with Omansai.
          </p>
          <Link
            href="/contact?intent=project"
            className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand-accent px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-accent/90"
          >
            Start a project <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
