import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/current-user";
import { UserRoleManager } from "@/components/admin/UserRoleManager";

export const dynamic = "force-dynamic";

// Restricted user-management view (ADMIN only, enforced by the admin layout).
export default async function AdminUsersPage() {
  const me = await getCurrentUser();
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      profile: { select: { firstName: true, lastName: true, company: true } },
      _count: { select: { sessions: { where: { revokedAt: null } } } },
    },
  });

  const rows = users.map((u) => ({
    id: u.id,
    name: [u.profile?.firstName, u.profile?.lastName].filter(Boolean).join(" ") || "—",
    email: u.email,
    role: u.role,
    company: u.profile?.company ?? "",
    activeSessions: u._count.sessions,
    joined: u.createdAt.toLocaleDateString(),
  }));

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Users</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {users.length} registered {users.length === 1 ? "account" : "accounts"} · promote or
          demote roles below.
        </p>
      </header>

      <UserRoleManager users={rows} currentUserId={me?.id ?? ""} />
    </div>
  );
}
