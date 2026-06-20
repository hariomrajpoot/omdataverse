"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2, X } from "lucide-react";

export type FieldType = "text" | "textarea" | "number" | "list" | "outcomes" | "boolean";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  hint?: string;
}

export interface ContentItem {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  [key: string]: unknown;
}

type FormState = Record<string, string | boolean>;

function initForm(fields: FieldDef[], item?: ContentItem): FormState {
  const state: FormState = {};
  for (const f of fields) {
    const v = item?.[f.name];
    switch (f.type) {
      case "boolean":
        state[f.name] = item ? Boolean(v) : true;
        break;
      case "list":
        state[f.name] = Array.isArray(v) ? (v as string[]).join("\n") : "";
        break;
      case "outcomes":
        state[f.name] = Array.isArray(v)
          ? (v as { label: string; value: string }[])
              .map((o) => `${o.label} | ${o.value}`)
              .join("\n")
          : "";
        break;
      case "number":
        state[f.name] = item ? String(v ?? 0) : "0";
        break;
      default:
        state[f.name] = item ? String(v ?? "") : "";
    }
  }
  return state;
}

function buildPayload(fields: FieldDef[], form: FormState) {
  const payload: Record<string, unknown> = {};
  for (const f of fields) {
    const raw = form[f.name];
    switch (f.type) {
      case "boolean":
        payload[f.name] = Boolean(raw);
        break;
      case "number":
        payload[f.name] = Number(raw) || 0;
        break;
      case "list":
        payload[f.name] = String(raw)
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);
        break;
      case "outcomes":
        payload[f.name] = String(raw)
          .split("\n")
          .map((line) => line.split("|"))
          .filter((parts) => parts.length >= 2 && parts[0].trim() && parts[1].trim())
          .map((parts) => ({ label: parts[0].trim(), value: parts.slice(1).join("|").trim() }));
        break;
      default:
        payload[f.name] = String(raw).trim();
    }
  }
  return payload;
}

export function ContentManager({
  type,
  singular,
  fields,
  items,
}: {
  type: string;
  singular: string;
  fields: FieldDef[];
  items: ContentItem[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<ContentItem | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openCreate() {
    setEditing(null);
    setForm(initForm(fields));
    setError(null);
    setOpen(true);
  }

  function openEdit(item: ContentItem) {
    setEditing(item);
    setForm(initForm(fields, item));
    setError(null);
    setOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = buildPayload(fields, form);
    const url = editing
      ? `/api/admin/content/${type}/${editing.id}`
      : `/api/admin/content/${type}`;
    try {
      const res = await fetch(url, {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.issues?.[0] ? `${data.issues[0].path}: ${data.issues[0].message}` : data.error ?? "Save failed.");
        return;
      }
      setOpen(false);
      router.refresh();
    } catch {
      setError("Network error.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(item: ContentItem) {
    if (!confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/content/${type}/${item.id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    else alert("Failed to delete.");
  }

  const fieldClass =
    "w-full rounded-lg border border-brand-border/60 bg-brand-bg px-3 py-2 text-sm text-brand-fg focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent [color-scheme:light] dark:[color-scheme:dark]";

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-brand-fg/60">
          {items.length} {items.length === 1 ? singular : `${singular}s`}
        </p>
        <button
          onClick={openCreate}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand-accent px-3 text-sm font-semibold text-white transition-colors hover:bg-brand-accent/90"
        >
          <Plus className="h-4 w-4" />
          New {singular}
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-brand-border/60 bg-brand-surface/60">
        <table className="min-w-full divide-y divide-brand-border/50">
          <thead>
            <tr className="text-left text-xs font-medium uppercase tracking-wider text-brand-fg/50">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border/40">
            {items.map((item) => (
              <tr key={item.id} className="text-sm">
                <td className="px-4 py-3 font-medium text-brand-fg">{item.title}</td>
                <td className="px-4 py-3 text-brand-fg/60">{item.slug}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      item.published
                        ? "rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-950/50 dark:text-green-300"
                        : "rounded-full bg-brand-surface px-2 py-0.5 text-xs font-medium text-brand-fg/60"
                    }
                  >
                    {item.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEdit(item)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-brand-fg/70 hover:bg-brand-surface hover:text-brand-fg"
                      aria-label={`Edit ${item.title}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => remove(item)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                      aria-label={`Delete ${item.title}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-brand-fg/50">
                  Nothing yet. Create your first {singular}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create / edit modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm sm:p-8">
          <div className="w-full max-w-2xl rounded-2xl border border-brand-border/60 bg-brand-bg p-6 shadow-2xl ring-1 ring-black/10 dark:ring-white/10">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-brand-fg">
                {editing ? `Edit ${singular}` : `New ${singular}`}
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-brand-fg/60 hover:bg-brand-surface"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={save} className="space-y-4">
              {fields.map((f) => (
                <div key={f.name}>
                  {f.type === "boolean" ? (
                    <label className="flex items-center gap-2 text-sm font-medium text-brand-fg">
                      <input
                        type="checkbox"
                        checked={Boolean(form[f.name])}
                        onChange={(e) => setForm((s) => ({ ...s, [f.name]: e.target.checked }))}
                        className="h-4 w-4 rounded border-brand-border accent-brand-accent"
                      />
                      {f.label}
                    </label>
                  ) : (
                    <>
                      <label className="mb-1 block text-sm font-medium text-brand-fg/80">
                        {f.label}
                      </label>
                      {f.type === "textarea" || f.type === "list" || f.type === "outcomes" ? (
                        <textarea
                          rows={f.type === "textarea" ? 3 : 4}
                          className={fieldClass}
                          placeholder={f.placeholder}
                          value={String(form[f.name] ?? "")}
                          onChange={(e) => setForm((s) => ({ ...s, [f.name]: e.target.value }))}
                        />
                      ) : (
                        <input
                          type={f.type === "number" ? "number" : "text"}
                          className={fieldClass}
                          placeholder={f.placeholder}
                          value={String(form[f.name] ?? "")}
                          onChange={(e) => setForm((s) => ({ ...s, [f.name]: e.target.value }))}
                        />
                      )}
                      {f.hint && <p className="mt-1 text-xs text-brand-fg/50">{f.hint}</p>}
                    </>
                  )}
                </div>
              ))}

              {error && <p className="text-sm font-medium text-red-600">{error}</p>}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-10 items-center rounded-lg border border-brand-border/60 px-4 text-sm font-medium text-brand-fg/80 hover:bg-brand-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex h-10 items-center rounded-lg bg-brand-accent px-5 text-sm font-semibold text-white hover:bg-brand-accent/90 disabled:opacity-60"
                >
                  {saving ? "Saving…" : editing ? "Save changes" : `Create ${singular}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
