import Link from "next/link";
import { Calendar, Video, FileText, Award, GraduationCap } from "lucide-react";
import { requireUser } from "@/lib/auth/current-user";
import { listUserEnrollments } from "@/lib/enrollments";

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
  approved: "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300",
  enrolled: "bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300",
  completed: "bg-violet-100 text-violet-800 dark:bg-violet-950/50 dark:text-violet-300",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300",
};

export default async function MyTrainingsPage() {
  const user = await requireUser();
  const enrollments = await listUserEnrollments(user.id);

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-fg">My trainings</h1>
      <p className="mt-1 text-sm text-brand-fg/60">
        Your enrolled courses, schedules, and materials.
      </p>

      {enrollments.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-brand-border/50 bg-brand-surface/60 p-10 text-center">
          <GraduationCap className="mx-auto h-8 w-8 text-brand-accent" />
          <p className="mt-3 text-sm text-brand-fg/70">You haven&apos;t enrolled in any trainings yet.</p>
          <Link
            href="/trainings"
            className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-brand-accent px-5 text-sm font-semibold text-white hover:bg-brand-accent/90"
          >
            Browse trainings
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {enrollments.map((e) => (
            <article
              key={e.id}
              className="rounded-2xl border border-brand-border/50 bg-brand-surface/60 p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-brand-fg">{e.training.title}</h2>
                  <p className="mt-0.5 text-xs text-brand-fg/60">
                    {e.training.level} · {e.training.duration}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                    STATUS_STYLES[e.status] ?? "bg-brand-surface text-brand-fg/70"
                  }`}
                >
                  {e.status}
                </span>
              </div>

              {(e.schedule || e.meetingLink || e.materialsUrl || e.certificateUrl) && (
                <dl className="mt-5 grid gap-3 border-t border-brand-border/40 pt-5 sm:grid-cols-2">
                  {e.schedule && (
                    <div className="flex items-center gap-2 text-sm text-brand-fg/80">
                      <Calendar className="h-4 w-4 text-brand-accent" />
                      {e.schedule}
                    </div>
                  )}
                  {e.meetingLink && (
                    <a
                      href={e.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-medium text-brand-accent hover:underline"
                    >
                      <Video className="h-4 w-4" /> Join session
                    </a>
                  )}
                  {e.materialsUrl && (
                    <a
                      href={e.materialsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-medium text-brand-accent hover:underline"
                    >
                      <FileText className="h-4 w-4" /> Course materials
                    </a>
                  )}
                  {e.certificateUrl && (
                    <a
                      href={e.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-medium text-brand-accent hover:underline"
                    >
                      <Award className="h-4 w-4" /> Download certificate
                    </a>
                  )}
                </dl>
              )}

              {e.status === "pending" && (
                <p className="mt-4 text-sm text-brand-fg/60">
                  Your enrollment is under review. We&apos;ll notify you once it&apos;s confirmed.
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
