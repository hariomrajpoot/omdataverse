import Link from "next/link";
import { requireUser } from "@/lib/auth/current-user";
import { Navbar } from "@/components/layout/Navbar";

export const dynamic = "force-dynamic";

// Client area layout: reuses the standard public navbar, then a focused
// settings container. Any authenticated user (CLIENT or ADMIN) may access it.
export default async function AccountLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requireUser();

  return (
    <div className="flex min-h-dvh flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main id="main" className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
        <nav className="mb-6 text-sm text-slate-500 dark:text-slate-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-slate-900 dark:hover:text-white">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900 dark:text-white">Account</span>
        </nav>
        <div className="mb-8 flex gap-2 border-b border-brand-border/50">
          <Link
            href="/account"
            className="border-b-2 border-transparent px-1 pb-3 text-sm font-medium text-brand-fg/70 hover:text-brand-fg"
          >
            Profile
          </Link>
          <Link
            href="/account/trainings"
            className="ml-4 border-b-2 border-transparent px-1 pb-3 text-sm font-medium text-brand-fg/70 hover:text-brand-fg"
          >
            My trainings
          </Link>
        </div>
        {children}
      </main>
    </div>
  );
}
