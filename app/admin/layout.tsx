import { requireRole } from "@/lib/auth/current-user";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";

// ADMIN-only layout (sidebar shell). Double-guarded: edge middleware blocks
// non-admins before render, and requireRole re-checks server-side here.
export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requireRole("ADMIN");

  return (
    <div className="flex min-h-dvh bg-slate-50 dark:bg-slate-950">
      <AdminSidebar email={user.email} />
      <div className="flex-1 overflow-x-auto">{children}</div>
    </div>
  );
}
