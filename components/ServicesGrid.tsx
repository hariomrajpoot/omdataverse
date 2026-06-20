"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/lib/types";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/motion";

export interface ServicesGridProps {
  title?: string;
  subtitle?: string;
  services: Service[];
}

function Icon({ name }: { name: string }) {
  const common = "h-5 w-5";
  switch (name) {
    case "Data Foundations":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 7c0-2 3-3 6-3s6 1 6 3-3 3-6 3-6-1-6-3Z" stroke="currentColor" strokeWidth="1.6" />
          <path d="M6 7v5c0 2 3 3 6 3s6-1 6-3V7" stroke="currentColor" strokeWidth="1.6" />
          <path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case "AI & Automation":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M8 10V8.6A3.6 3.6 0 0 1 11.6 5h.8A3.6 3.6 0 0 1 16 8.6V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M7.2 10h9.6A2.2 2.2 0 0 1 19 12.2v5.6A2.2 2.2 0 0 1 16.8 20H7.2A2.2 2.2 0 0 1 5 17.8v-5.6A2.2 2.2 0 0 1 7.2 10Z" stroke="currentColor" strokeWidth="1.6" />
          <path d="M10 15h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "Advanced Analytics":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 19V6.8A1.8 1.8 0 0 1 6.8 5H19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M8 16l3-4 3 2 5-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "Infrastructure & DevOps":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M7 10.4a5 5 0 0 1 9.7 1.6h.3A3 3 0 0 1 17 18H8a3 3 0 0 1-1-5.6Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M9.5 18v-2m5 2v-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="1.6" />
          <path d="M9 12h6M12 9v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
  }
}

export function ServicesGrid({ title, subtitle, services }: ServicesGridProps) {
  const reduce = useReducedMotion();

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      {(title || subtitle) && (
        <motion.header
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          {title ? (
            <h2 className="text-3xl font-semibold tracking-tight text-brand-fg sm:text-4xl">
              {title}
            </h2>
          ) : null}
          {subtitle ? (
            <p className="mt-3 text-base leading-7 text-brand-fg/70">{subtitle}</p>
          ) : null}
        </motion.header>
      )}

      <motion.div
        variants={staggerContainer(0.08, 0.05)}
        initial={reduce ? false : "hidden"}
        whileInView="visible"
        viewport={viewportOnce}
        className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {services.map((s) => (
          <motion.div
            key={s.slug}
            variants={fadeInUp}
            whileHover={reduce ? undefined : { y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="group relative flex flex-col rounded-2xl border border-brand-border/50 bg-brand-surface/60 p-6 transition-colors duration-300 hover:border-brand-accent/50"
          >
            {/* Accent wash on hover */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-brand-accent/[0.06] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-accent/10 text-brand-accent ring-1 ring-brand-accent/20 transition-transform duration-300 group-hover:scale-110">
                <Icon name={s.category} />
              </div>

              <h3 className="mt-5 text-base font-semibold text-brand-fg">{s.title}</h3>
              <p className="mt-2 text-sm leading-6 text-brand-fg/70">{s.summary}</p>

              {s.highlights?.length ? (
                <ul className="mt-4 space-y-2 text-sm text-brand-fg/70">
                  {s.highlights.slice(0, 3).map((h) => (
                    <li key={h} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-accent" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              <Link
                href="/services"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-fg/80 transition-colors hover:text-brand-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg"
              >
                Learn more
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
