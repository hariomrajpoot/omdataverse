import Link from "next/link";

// Minimal centered shell for sign-in / sign-up (no marketing chrome).
export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950">
      <Link
        href="/"
        className="mb-8 text-lg font-bold tracking-tight text-slate-900 dark:text-white"
      >
        Omansai
      </Link>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
