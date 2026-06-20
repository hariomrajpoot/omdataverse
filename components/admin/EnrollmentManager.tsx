"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, MessageCircle, X } from "lucide-react";

export interface EnrollmentRow {
  id: string;
  student: string;
  email: string;
  phone: string;
  training: string;
  status: string;
  createdAt: string;
  schedule: string;
  meetingLink: string;
  materialsUrl: string;
  certificateUrl: string;
}

const STATUSES = ["pending", "approved", "enrolled", "completed", "cancelled"] as const;

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
  approved: "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300",
  enrolled: "bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300",
  completed: "bg-violet-100 text-violet-800 dark:bg-violet-950/50 dark:text-violet-300",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300",
};

export function EnrollmentManager({ items }: { items: EnrollmentRow[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<EnrollmentRow | null>(null);
  const [form, setForm] = useState<Omit<EnrollmentRow, "id" | "student" | "email" | "phone" | "training" | "createdAt">>({
    status: "pending",
    schedule: "",
    meetingLink: "",
    materialsUrl: "",
    certificateUrl: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function open(row: EnrollmentRow) {
    setEditing(row);
    setForm({
      status: row.status,
      schedule: row.schedule,
      meetingLink: row.meetingLink,
      materialsUrl: row.materialsUrl,
      certificateUrl: row.certificateUrl,
    });
    setError(null);
  }

  async function save() {
    if (!editing) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/enrollments/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.issues?.[0] ? `${data.issues[0].path}: ${data.issues[0].message}` : data.error ?? "Save failed.");
        return;
      }
      setEditing(null);
      router.refresh();
    } catch {
      setError("Network error.");
    } finally {
      setSaving(false);
    }
  }

  const field =
    "w-full rounded-lg border border-brand-border/60 bg-brand-bg px-3 py-2 text-sm text-brand-fg focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent [color-scheme:light] dark:[color-scheme:dark]";

  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-brand-border/60 bg-brand-surface/60">
        <table className="min-w-full divide-y divide-brand-border/50">
          <thead>
            <tr className="text-left text-xs font-medium uppercase tracking-wider text-brand-fg/50">
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Training</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Requested</th>
              <th className="px-4 py-3 text-right">Manage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border/40">
            {items.map((row) => (
              <tr key={row.id} className="text-sm">
                <td className="px-4 py-3">
                  <div className="font-medium text-brand-fg">{row.student}</div>
                  <div className="text-xs text-brand-fg/55">{row.email}</div>
                </td>
                <td className="px-4 py-3 text-brand-fg/80">{row.training}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {row.phone ? (
                      <a
                        href={`https://wa.me/${row.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                          `Hi ${row.student}, regarding your enrollment in "${row.training}"…`,
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`WhatsApp ${row.phone}`}
                        className="inline-flex h-8 items-center gap-1 rounded-md bg-green-500/10 px-2 text-xs font-medium text-green-700 hover:bg-green-500/20 dark:text-green-300"
                      >
                        <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                      </a>
                    ) : (
                      <span className="text-xs text-brand-fg/40">no phone</span>
                    )}
                    <a
                      href={`mailto:${row.email}?subject=${encodeURIComponent(`Your enrollment: ${row.training}`)}`}
                      title={`Email ${row.email}`}
                      className="inline-flex h-8 items-center gap-1 rounded-md bg-brand-accent/10 px-2 text-xs font-medium text-brand-accent hover:bg-brand-accent/20"
                    >
                      <Mail className="h-3.5 w-3.5" /> Email
                    </a>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                      STATUS_STYLES[row.status] ?? "bg-brand-surface text-brand-fg/70"
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-brand-fg/55">
                  {new Date(row.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => open(row)}
                    className="rounded-md px-3 py-1.5 text-sm font-medium text-brand-accent hover:bg-brand-surface"
                  >
                    Manage
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-brand-fg/50">
                  No enrollments yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm sm:p-8">
          <div className="w-full max-w-lg rounded-2xl border border-brand-border/60 bg-brand-bg p-6 shadow-2xl ring-1 ring-black/10 dark:ring-white/10">
            <div className="mb-1 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-brand-fg">Manage enrollment</h2>
              <button
                onClick={() => setEditing(null)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-brand-fg/60 hover:bg-brand-surface"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mb-5 text-sm text-brand-fg/60">
              {editing.student} · {editing.training}
            </p>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-brand-fg/80">Status</label>
                <select
                  className={field}
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s} className="capitalize">
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-brand-fg/80">Schedule</label>
                <input
                  className={field}
                  placeholder="e.g. Sat & Sun, 10am–1pm, starting Mar 2"
                  value={form.schedule}
                  onChange={(e) => setForm((f) => ({ ...f, schedule: e.target.value }))}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-brand-fg/80">Meeting link</label>
                <input
                  className={field}
                  placeholder="https://meet.google.com/…"
                  value={form.meetingLink}
                  onChange={(e) => setForm((f) => ({ ...f, meetingLink: e.target.value }))}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-brand-fg/80">Materials URL</label>
                <input
                  className={field}
                  placeholder="https://…"
                  value={form.materialsUrl}
                  onChange={(e) => setForm((f) => ({ ...f, materialsUrl: e.target.value }))}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-brand-fg/80">Certificate URL</label>
                <input
                  className={field}
                  placeholder="https://…"
                  value={form.certificateUrl}
                  onChange={(e) => setForm((f) => ({ ...f, certificateUrl: e.target.value }))}
                />
              </div>

              {error && <p className="text-sm font-medium text-red-600">{error}</p>}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setEditing(null)}
                  className="inline-flex h-10 items-center rounded-lg border border-brand-border/60 px-4 text-sm font-medium text-brand-fg/80 hover:bg-brand-surface"
                >
                  Cancel
                </button>
                <button
                  onClick={save}
                  disabled={saving}
                  className="inline-flex h-10 items-center rounded-lg bg-brand-accent px-5 text-sm font-semibold text-white hover:bg-brand-accent/90 disabled:opacity-60"
                >
                  {saving ? "Saving…" : "Save & notify student"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
