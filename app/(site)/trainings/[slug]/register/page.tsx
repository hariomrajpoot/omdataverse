import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getTrainingBySlug } from "@/lib/content";
import { getCurrentUser } from "@/lib/auth/current-user";
import { EnrollFlow } from "@/components/EnrollFlow";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = await getTrainingBySlug(slug);
  return { title: t ? `Enroll — ${t.title}` : "Enroll" };
}

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [training, user] = await Promise.all([getTrainingBySlug(slug), getCurrentUser()]);
  if (!training) notFound();

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 sm:py-16">
      <Link
        href="/trainings"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-fg/70 transition-colors hover:text-brand-accent"
      >
        <ArrowLeft className="h-4 w-4" /> All trainings
      </Link>
      <h1 className="mt-5 text-3xl font-bold tracking-tight text-brand-fg">Enroll</h1>
      <p className="mt-2 text-sm text-brand-fg/70">
        Register for <strong>{training.title}</strong>.
      </p>

      <div className="mt-8">
        <EnrollFlow
          training={{
            id: training.id ?? "",
            title: training.title,
            slug: training.slug,
            level: training.level,
            duration: training.duration,
          }}
          isAuthed={!!user}
        />
      </div>
    </div>
  );
}
