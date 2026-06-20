import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="text-3xl font-bold text-slate-900 dark:text-white">{value}</div>
      <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{label}</div>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const monthAgo = new Date();
  monthAgo.setMonth(monthAgo.getMonth() - 1);

  const [totalUsers, totalLeads, demoLeads, convertedLeads, newThisMonth, contacts] =
    await Promise.all([
      prisma.user.count(),
      prisma.lead.count(),
      prisma.lead.count({ where: { type: "demo" } }),
      prisma.lead.count({ where: { status: "converted" } }),
      prisma.lead.count({ where: { createdAt: { gt: monthAgo } } }),
      prisma.contact.count(),
    ]);

  const conversionRate =
    totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Overview of users and lead pipeline.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Registered users" value={totalUsers} />
        <StatCard label="Total leads" value={totalLeads} />
        <StatCard label="Demo requests" value={demoLeads} />
        <StatCard label="New this month" value={newThisMonth} />
        <StatCard label="Converted" value={convertedLeads} />
        <StatCard label="Conversion rate" value={`${conversionRate}%`} />
        <StatCard label="Contact messages" value={contacts} />
      </div>
    </div>
  );
}
