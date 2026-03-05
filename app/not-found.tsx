import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="rounded-2xl border border-brand-border/10 bg-brand-surface p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-brand-fg">
          Page not found
        </h1>
        <p className="mt-3 text-sm leading-6 text-brand-fg/70">
          The page you’re looking for doesn’t exist, or it may have moved.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-md bg-brand-primary px-5 text-sm font-semibold text-brand-onPrimary shadow-sm shadow-black/10 transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg"
          >
            Go home
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-11 items-center justify-center rounded-md border border-brand-border/15 bg-brand-bg/60 px-5 text-sm font-semibold text-brand-fg/90 transition hover:bg-brand-bg/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg"
          >
            Contact us
          </Link>
        </div>
      </div>
    </div>
  );
}

