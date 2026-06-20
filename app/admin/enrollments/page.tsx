import { listAllEnrollments } from "@/lib/enrollments";
import { EnrollmentManager } from "@/components/admin/EnrollmentManager";

export const dynamic = "force-dynamic";

export default async function AdminEnrollmentsPage() {
  const rows = await listAllEnrollments();
  const items = rows.map((e) => ({
    id: e.id,
    student:
      [e.user.profile?.firstName, e.user.profile?.lastName].filter(Boolean).join(" ") ||
      e.user.email.split("@")[0],
    email: e.user.email,
    training: e.training.title,
    status: e.status,
    createdAt: e.createdAt.toISOString(),
    schedule: e.schedule ?? "",
    meetingLink: e.meetingLink ?? "",
    materialsUrl: e.materialsUrl ?? "",
    certificateUrl: e.certificateUrl ?? "",
  }));

  const pending = items.filter((i) => i.status === "pending").length;

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-brand-fg">Enrollments</h1>
        <p className="mt-1 text-sm text-brand-fg/60">
          {items.length} total{pending > 0 ? ` · ${pending} pending review` : ""}.
        </p>
      </header>
      <EnrollmentManager items={items} />
    </div>
  );
}
