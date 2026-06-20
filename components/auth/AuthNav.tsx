"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { UserMenu } from "@/components/auth/UserMenu";
import { NotificationBell } from "@/components/notifications/NotificationBell";

// Compact auth controls for the public navbar: sign-in/up when logged out;
// a profile dropdown (avatar + menu) when logged in.
export function AuthNav() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="h-9 w-9 animate-pulse rounded-full bg-brand-surface" />;
  }

  if (!user) {
    return (
      <div className="hidden items-center gap-2 sm:flex">
        <Link
          href="/login"
          className="inline-flex h-9 items-center rounded-lg px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          Sign in
        </Link>
        <Link
          href="/register"
          className="inline-flex h-9 items-center rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <NotificationBell />
      <UserMenu user={user} />
    </div>
  );
}
