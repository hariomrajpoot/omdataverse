import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  GraduationCap,
  Laptop,
  CheckCircle2,
} from "lucide-react";
import { getTrainingBySlug } from "@/lib/content";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getUserEnrollment } from "@/lib/enrollments";
import { Reveal } from "@/components/motion/Reveal";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending review",
  approved: "Approved",
  enrolled: "Enrolled",
  completed: "Completed",
  cancelled: "Cancelled",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = await getTrainingBySlug(slug);
  if (!t) return { title: "Training" };
  return { title: t.title, description: t.summary };
}

export default async function TrainingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const training = await getTrainingBySlug(slug);
  if (!training) notFound();

  const user = await getCurrentUser();
  const enrollment =
    user && training.id ? await getUserEnrollment(user.id, training.id) : null;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-brand-border/40">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-brand-accent/15 via-transparent to-transparent"
        />
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
          <Reveal>
            <Link
              href="/trainings"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-fg/70 transition-colors hover:text-brand-accent"
            >
              <ArrowLeft className="h-4 w-4" /> All trainings
            </Link>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-accent/10 px-3 py-1 text-xs font-semibold text-brand-accent ring-1 ring-brand-accent/20">
                <GraduationCap className="h-3.5 w-3.5" /> {training.level}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-surface px-3 py-1 text-xs font-medium text-brand-fg/70 ring-1 ring-brand-border/10">
                <Clock className="h-3.5 w-3.5" /> {training.duration}
              </span>
            </div>
            <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight text-brand-fg sm:text-5xl">
              {training.title}
            </h1>
            <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-brand-fg/70 sm:text-lg">
              {training.summary}
            </p>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-3">
        {/* Main */}
        <div className="lg:col-span-2">
          {training.topics.length > 0 && (
            <Reveal>
              <h2 className="text-2xl font-semibold tracking-tight text-brand-fg">
                What you&apos;ll learn
              </h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {training.topics.map((topic) => (
                  <li
                    key={topic}
                    className="flex gap-2.5 rounded-xl border border-brand-border/50 bg-brand-surface/60 p-4 text-sm leading-6 text-brand-fg/80"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          <Reveal className="mt-10">
            <h2 className="text-2xl font-semibold tracking-tight text-brand-fg">Format</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {[
                { icon: Laptop, label: "Hands-on", value: "Practitioner-led, build real things" },
                { icon: Clock, label: "Duration", value: training.duration },
                { icon: GraduationCap, label: "Level", value: training.level },
              ].map((f) => (
                <div
                  key={f.label}
                  className="rounded-xl border border-brand-border/50 bg-brand-surface/60 p-5"
                >
                  <f.icon className="h-5 w-5 text-brand-accent" />
                  <div className="mt-3 text-xs uppercase tracking-wide text-brand-fg/50">
                    {f.label}
                  </div>
                  <div className="mt-0.5 text-sm font-medium text-brand-fg">{f.value}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Enroll sidebar */}
        <aside className="lg:col-span-1">
          <Reveal className="sticky top-24 rounded-2xl border border-brand-border/50 bg-brand-surface/60 p-6">
            {enrollment ? (
              <>
                <div className="flex items-center gap-2 text-brand-fg">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="font-semibold">You&apos;re enrolled</span>
                </div>
                <p className="mt-2 text-sm text-brand-fg/70">
                  Status:{" "}
                  <span className="font-medium text-brand-fg">
                    {STATUS_LABEL[enrollment.status] ?? enrollment.status}
                  </span>
                </p>
                <Link
                  href="/account/trainings"
                  className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand-accent px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-accent/90"
                >
                  View my trainings <ArrowRight className="h-4 w-4" />
                </Link>
              </>
            ) : (
              <>
                <div className="text-lg font-semibold text-brand-fg">Ready to join?</div>
                <p className="mt-2 text-sm text-brand-fg/70">
                  Reserve your seat for <strong>{training.title}</strong>. Takes under a minute.
                </p>
                <Link
                  href={`/trainings/${training.slug}/register`}
                  className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand-accent px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-accent/90"
                >
                  Enroll now <ArrowRight className="h-4 w-4" />
                </Link>
                {!user && (
                  <p className="mt-3 text-center text-xs text-brand-fg/55">
                    You&apos;ll sign in or create a free account to enroll.
                  </p>
                )}
              </>
            )}
          </Reveal>
        </aside>
      </div>
    </div>
  );
}
