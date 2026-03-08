"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/features/shared/lib/site";
import { ThemeToggle } from "@/features/shared/components/ThemeToggle";
import { Menu, X, Sparkles } from "lucide-react";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const backgroundOpacity = useTransform(scrollY, [0, 100], [0.8, 0.95]);
  const backdropBlur = useTransform(scrollY, [0, 100], [8, 12]);

  return (
    <motion.header
      style={{
        backgroundColor: useTransform(backgroundOpacity, (value) => `rgba(255, 255, 255, ${value})`),
        backdropFilter: useTransform(backdropBlur, (value) => `blur(${value}px)`),
      }}
      className="sticky top-0 z-50 border-b border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md"
    >
      <a href="#main" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            href="/"
            className="group inline-flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            aria-label={`${siteConfig.name} home`}
          >
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-[rgb(var(--brand-secondary))] to-[rgb(var(--brand-primary))] text-[rgb(var(--brand-onPrimary))] shadow-lg group-hover:shadow-xl transition-all duration-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              {siteConfig.name}
            </span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          aria-label="Primary"
          className="hidden md:block"
        >
          <ul className="flex items-center gap-1">
            {navLinks.map((link, index) => (
              <motion.li
                key={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
              >
                <Link
                  href={link.href}
                  className="relative inline-flex rounded-lg px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 transition-all duration-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-0 bg-linear-to-r from-[rgb(var(--brand-secondary))] to-[rgb(var(--brand-accent))] transition-all duration-300 group-hover:w-full group-hover:left-0" />
                </Link>
              </motion.li>
            ))}
          </ul>
        </motion.nav>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center gap-3"
        >
          <ThemeToggle />
          <Button asChild className="hidden sm:inline-flex bg-linear-to-r from-[rgb(var(--brand-secondary))] to-[rgb(var(--brand-primary))] hover:from-[rgb(var(--brand-secondary))]/90 hover:to-[rgb(var(--brand-primary))]/90 text-[rgb(var(--brand-onPrimary))] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <Link href={siteConfig.links.bookAudit}>
              Book Audit
            </Link>
          </Button>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </motion.div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden border-t border-slate-200/50 dark:border-slate-700/50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md"
        >
          <nav className="px-4 py-6">
            <ul className="space-y-2">
              {navLinks.map((link, index) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block rounded-lg px-4 py-3 text-base font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <Button asChild className="w-full bg-linear-to-r from-[rgb(var(--brand-secondary))] to-[rgb(var(--brand-primary))] hover:from-[rgb(var(--brand-secondary))]/90 hover:to-[rgb(var(--brand-primary))]/90 text-[rgb(var(--brand-onPrimary))]">
                <Link href={siteConfig.links.bookAudit} onClick={() => setIsMenuOpen(false)}>
                  Book Audit
                </Link>
              </Button>
            </div>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
}
