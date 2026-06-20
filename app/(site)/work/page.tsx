import type { Metadata } from "next";
import Link from "next/link";
import { Briefcase } from "lucide-react";
import { getProjects } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our Work",
  description:
    "Solutions we've built—custom platforms, AI products, and e-commerce systems delivered for real businesses.",
};

export default async function WorkPage() {
  const projects = await getProjects();

  return (
    <div>
      <header className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-24">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-border/60 bg-brand-surface/60 px-3 py-1 text-xs font-medium text-brand-fg/80">
            <Briefcase className="h-3.5 w-3.5 text-brand-accent" />
            Our Work
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-brand-fg sm:text-5xl">
            Solutions we&apos;ve built
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-brand-fg/70">
            Custom platforms, AI products, and e-commerce systems delivered end-to-end
            for real businesses.
          </p>
        </Reveal>
      </header>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 sm:pb-28">
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.06}>
              <Link
                href={`/work/${p.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-brand-border/50 bg-brand-surface/60 p-6 transition-colors hover:border-brand-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg"
              >
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold text-brand-fg transition-colors group-hover:text-brand-accent">
                    {p.title}
                  </h2>
                  {p.industry && (
                    <span className="shrink-0 rounded-full bg-brand-bg/60 px-2.5 py-1 text-[11px] font-semibold text-brand-fg/70 ring-1 ring-brand-border/10">
                      {p.industry}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm leading-6 text-brand-fg/70">{p.summary}</p>

                {p.outcomes.length > 0 && (
                  <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-brand-border/40 pt-5">
                    {p.outcomes.slice(0, 3).map((o) => (
                      <div key={o.label}>
                        <dt className="text-[11px] leading-tight text-brand-fg/55">{o.label}</dt>
                        <dd className="mt-0.5 text-sm font-semibold text-brand-fg">{o.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}

                {p.technologies.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {p.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full bg-brand-bg/60 px-2.5 py-1 text-xs text-brand-fg/70 ring-1 ring-brand-border/10"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </Reveal>
          ))}
        </div>

        {projects.length === 0 && (
          <p className="text-center text-brand-fg/60">No projects published yet.</p>
        )}

        <Reveal className="mt-12 text-center">
          <Link
            href="/contact?intent=project"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-brand-accent px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-accent/90"
          >
            Start a project with us
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
