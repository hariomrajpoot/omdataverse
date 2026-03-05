import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { ThemeToggle } from "@/components/ThemeToggle";

export interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: "Services", href: "/services" },
  { label: "Accelerator", href: "/accelerator" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-brand-border/10 bg-brand-bg/80 backdrop-blur">
      <a href="#main" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg"
          aria-label={`${siteConfig.name} home`}
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand-accent/35 ring-1 ring-brand-border/10">
            <span className="text-sm font-semibold tracking-tight text-brand-fg">
              OM
            </span>
          </span>
          <span className="text-sm font-semibold tracking-tight text-brand-fg">
            {siteConfig.name}
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="inline-flex rounded-md px-3 py-2 text-sm text-brand-fg/70 transition hover:text-brand-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href={siteConfig.links.bookAudit}
            className="inline-flex h-10 items-center justify-center rounded-md bg-brand-primary px-4 text-sm font-semibold text-brand-onPrimary shadow-sm shadow-black/10 transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg"
          >
            Book Audit
          </Link>
        </div>
      </div>

      {/**
       * Story-like usage:
       * <Navbar />
       */}
    </header>
  );
}

