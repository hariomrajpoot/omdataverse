"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, ShieldOff } from "lucide-react";

export interface UserRow {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "CLIENT";
  company: string;
  activeSessions: number;
  joined: string;
}

export function UserRoleManager({
  users,
  currentUserId,
}: {
  users: UserRow[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const adminCount = users.filter((u) => u.role === "ADMIN").length;

  async function changeRole(user: UserRow, role: "ADMIN" | "CLIENT") {
    setSavingId(user.id);
    setError(null);
    setNotice(null);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(
          data.issues?.[0] ? `${data.issues[0].path}: ${data.issues[0].message}` : data.error ?? "Update failed.",
        );
        return;
      }
      setNotice(
        `${user.email} is now ${role}. The change takes effect on their next refresh (≤15 min) or re-login.`,
      );
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div>
      {(error || notice) && (
        <div
          className={`mb-4 rounded-lg border px-4 py-2.5 text-sm ${
            error
              ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
              : "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300"
          }`}
        >
          {error ?? notice}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                {["Name", "Email", "Role", "Company", "Sessions", "Joined", "Manage"].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {users.map((u) => {
                const isSelf = u.id === currentUserId;
                const isLastAdmin = u.role === "ADMIN" && adminCount <= 1;
                const busy = savingId === u.id;
                return (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                      {u.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                      {u.email}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={
                          u.role === "ADMIN"
                            ? "inline-flex rounded-full bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-800 dark:bg-purple-950 dark:text-purple-300"
                            : "inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        }
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                      {u.company || "—"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                      {u.activeSessions}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                      {u.joined}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {u.role === "CLIENT" ? (
                        <button
                          onClick={() => changeRole(u, "ADMIN")}
                          disabled={busy}
                          className="inline-flex items-center gap-1.5 rounded-md border border-purple-200 px-2.5 py-1.5 text-xs font-medium text-purple-700 transition-colors hover:bg-purple-50 disabled:opacity-50 dark:border-purple-900 dark:text-purple-300 dark:hover:bg-purple-950/40"
                        >
                          <ShieldCheck className="h-3.5 w-3.5" /> Make admin
                        </button>
                      ) : (
                        <button
                          onClick={() => changeRole(u, "CLIENT")}
                          disabled={busy || isSelf || isLastAdmin}
                          title={
                            isSelf
                              ? "You can't change your own role"
                              : isLastAdmin
                                ? "Can't demote the last admin"
                                : undefined
                          }
                          className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                          <ShieldOff className="h-3.5 w-3.5" /> Make client
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
