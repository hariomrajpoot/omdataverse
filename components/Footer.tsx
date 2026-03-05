import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-brand-border/10 bg-brand-bg">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="text-sm font-semibold tracking-tight text-brand-fg">
              {siteConfig.name}
            </div>
            <p className="mt-2 text-sm leading-6 text-brand-fg/70">
              Consulting for modern data platforms and applied AI. Build the
              foundations once—then accelerate safely.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 md:col-span-2 md:grid-cols-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-brand-fg/60">
                Company
              </div>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link
                    className="text-brand-fg/70 hover:text-brand-fg"
                    href="/about"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-brand-fg/70 hover:text-brand-fg"
                    href="/case-studies"
                  >
                    Case Studies
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-brand-fg/60">
                Services
              </div>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link
                    className="text-brand-fg/70 hover:text-brand-fg"
                    href="/services"
                  >
                    Overview
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-brand-fg/70 hover:text-brand-fg"
                    href="/accelerator"
                  >
                    Accelerator
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-brand-fg/60">
                Contact
              </div>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link
                    className="text-brand-fg/70 hover:text-brand-fg"
                    href="/contact"
                  >
                    Book a call
                  </Link>
                </li>
                <li>
                  <a
                    className="text-brand-fg/70 hover:text-brand-fg"
                    href={`mailto:${siteConfig.company.email}`}
                  >
                    {siteConfig.company.email}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-brand-border/10 pt-6 text-xs text-brand-fg/60 sm:flex-row sm:items-center sm:justify-between">
          <div>© {year} {siteConfig.name}. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <a className="hover:text-brand-fg" href="/robots.txt">
              robots.txt
            </a>
            <a className="hover:text-brand-fg" href="/sitemap.xml">
              sitemap.xml
            </a>
          </div>
        </div>
      </div>

      {/**
       * Story-like usage:
       * <Footer />
       */}
    </footer>
  );
}

