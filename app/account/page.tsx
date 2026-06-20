"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { ImageUpload } from "@/components/ui/ImageUpload";

interface ProfileForm {
  firstName: string;
  lastName: string;
  company: string;
  phone: string;
  bio: string;
  avatarUrl: string;
}

const EMPTY: ProfileForm = {
  firstName: "",
  lastName: "",
  company: "",
  phone: "",
  bio: "",
  avatarUrl: "",
};

export default function AccountPage() {
  const { user, loading, refreshUser } = useAuth();
  const [form, setForm] = useState<ProfileForm>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  useEffect(() => {
    if (user?.profile) {
      setForm({
        firstName: user.profile.firstName ?? "",
        lastName: user.profile.lastName ?? "",
        company: user.profile.company ?? "",
        phone: user.profile.phone ?? "",
        bio: user.profile.bio ?? "",
        avatarUrl: user.profile.avatarUrl ?? "",
      });
    }
  }, [user]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ ok: true, msg: "Profile saved." });
        await refreshUser();
      } else {
        setStatus({ ok: false, msg: data.error ?? "Could not save profile." });
      }
    } catch {
      setStatus({ ok: false, msg: "Network error. Please try again." });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-slate-500">Loading your profile…</p>;
  }

  const field =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white";
  const label = "mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300";

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Profile settings</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Signed in as <span className="font-medium">{user?.email}</span> · role{" "}
        <span className="font-medium">{user?.role}</span>
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-8 space-y-5 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="firstName">First name</label>
            <input
              id="firstName"
              className={field}
              value={form.firstName}
              onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
              maxLength={80}
            />
          </div>
          <div>
            <label className={label} htmlFor="lastName">Last name</label>
            <input
              id="lastName"
              className={field}
              value={form.lastName}
              onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
              maxLength={80}
            />
          </div>
          <div>
            <label className={label} htmlFor="company">Company</label>
            <input
              id="company"
              className={field}
              value={form.company}
              onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
              maxLength={120}
            />
          </div>
          <div>
            <label className={label} htmlFor="phone">Phone</label>
            <input
              id="phone"
              className={field}
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              maxLength={40}
            />
          </div>
        </div>

        <div>
          <span className={label}>Avatar</span>
          <ImageUpload
            value={form.avatarUrl}
            onChange={(url) => setForm((f) => ({ ...f, avatarUrl: url }))}
            folder="avatars"
          />
        </div>

        <div>
          <label className={label} htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            rows={4}
            className={field}
            value={form.bio}
            onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            maxLength={500}
          />
        </div>

        {status && (
          <p
            className={
              status.ok
                ? "text-sm font-medium text-green-600"
                : "text-sm font-medium text-red-600"
            }
            role="status"
          >
            {status.msg}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-10 items-center rounded-lg bg-slate-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}
