"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { EASE_OUT, viewportOnce } from "@/lib/motion";

export interface CTASectionProps {
  title: string;
  subtitle: string;
  cta: { label: string; href: string };
  secondary?: { label: string; href: string };
}

export function CTASection({ title, subtitle, cta, secondary }: CTASectionProps) {
  const reduce = useReducedMotion();

  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.6, ease: EASE_OUT }}
        className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-brand-border/50 bg-brand-primary px-6 py-16 text-center sm:px-12"
      >
        {/* One restrained accent glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 -translate-y-1/3 rounded-full bg-brand-accent/30 blur-[100px]"
        />

        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-onPrimary/20 bg-brand-onPrimary/5 px-3 py-1 text-xs font-medium text-brand-onPrimary/80">
            <Sparkles className="h-3.5 w-3.5" />
            Ready to transform your data?
          </span>

          <h2 className="mx-auto mt-6 max-w-2xl text-balance text-3xl font-bold tracking-tight text-brand-onPrimary sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-base leading-7 text-brand-onPrimary/70">
            {subtitle}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <MagneticButton>
              <Button asChild variant="accent" size="lg">
                <Link href={cta.href}>
                  {cta.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </MagneticButton>
            {secondary && (
              <Button
                asChild
                size="lg"
                className="border border-brand-onPrimary/25 bg-transparent text-brand-onPrimary hover:bg-brand-onPrimary/10"
              >
                <Link href={secondary.href}>{secondary.label}</Link>
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
