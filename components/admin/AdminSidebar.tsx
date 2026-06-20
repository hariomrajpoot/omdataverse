"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Inbox,
  LogOut,
  ExternalLink,
  FileText,
  GraduationCap,
  Briefcase,
  LayoutGrid,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthProvider";
import { NotificationBell } from "@/components/notifications/NotificationBell";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/leads", label: "Leads", icon: Inbox },
  { href: "/admin/services", label: "Services", icon: LayoutGrid },
  { href: "/admin/case-studies", label: "Case Studies", icon: FileText },
  { href: "/admin/projects", label: "Our Work", icon: Briefcase },
  { href: "/admin/trainings", label: "Trainings", icon: GraduationCap },
  { href: "/admin/enrollments", label: "Enrollments", icon: ClipboardList },
  { href: "/admin/users", label: "Users", icon: Users },
];

export function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-4 dark:border-slate-800">
        <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
          Omansai
        </span>
        <span className="rounded bg-slate-900 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white dark:bg-white dark:text-slate-900">
          Admin
        </span>
        <div className="ml-auto">
          <NotificationBell />
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3" aria-label="Admin">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-3 dark:border-slate-800">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <ExternalLink className="h-4 w-4" />
          View site
        </Link>
        <div className="mt-2 truncate px-3 text-xs text-slate-400" title={email}>
          {email}
        </div>
        <button
          onClick={async () => {
            await logout();
            router.push("/login");
            router.refresh();
          }}
          className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
