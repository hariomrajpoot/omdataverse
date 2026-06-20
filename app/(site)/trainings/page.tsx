import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Clock, GraduationCap } from "lucide-react";
import { getTrainings } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Trainings & Workshops",
  description:
    "Hands-on workshops led by practitioners. Learn Microsoft Fabric, Azure AI, Databricks, and modern data engineering—from fundamentals to advanced patterns.",
};

export default async function TrainingsPage() {
  const trainings = await getTrainings();

  return (
    <div>
      <header className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-24">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-border/60 bg-brand-surface/60 px-3 py-1 text-xs font-medium text-brand-fg/80">
            <GraduationCap className="h-3.5 w-3.5 text-brand-accent" />
            Trainings &amp; Workshops
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-brand-fg sm:text-5xl">
            Level up your data &amp; AI skills
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-brand-fg/70">
            Hands-on workshops led by industry practitioners. Learn Microsoft Fabric,
            Azure AI, Databricks, and modern data engineering—from fundamentals to
            advanced patterns.
          </p>
        </Reveal>
      </header>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 sm:pb-28">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trainings.map((t, i) => (
            <Reveal key={t.slug} delay={i * 0.08}>
              <Link
                href={`/trainings/${t.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-brand-border/50 bg-brand-surface/60 p-6 transition-colors hover:border-brand-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg"
              >
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-brand-accent/10 px-2.5 py-1 text-xs font-semibold text-brand-accent ring-1 ring-brand-accent/20">
                    {t.level}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-brand-fg/60">
                    <Clock className="h-3.5 w-3.5" />
                    {t.duration}
                  </span>
                </div>

                <h2 className="mt-4 text-lg font-semibold text-brand-fg transition-colors group-hover:text-brand-accent">
                  {t.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-brand-fg/70">{t.summary}</p>

                {t.topics.length > 0 && (
                  <ul className="mt-4 space-y-2 text-sm text-brand-fg/70">
                    {t.topics.slice(0, 4).map((topic) => (
                      <li key={topic} className="flex gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" />
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <span className="mt-6 inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-brand-accent">
                  View details &amp; enroll
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        {trainings.length === 0 && (
          <p className="text-center text-brand-fg/60">No trainings published yet.</p>
        )}
      </section>
    </div>
  );
}
