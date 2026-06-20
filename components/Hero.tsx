"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { HeroBackground } from "@/components/HeroBackground";
import { EASE_OUT, staggerContainer, fadeInUp, wordReveal } from "@/lib/motion";

export interface HeroProps {
  title: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  chips?: string[];
  /** Social-proof line beside the avatar stack. */
  proof?: string;
}

const AVATARS = [
  { initials: "AK", from: "from-blue-500", to: "to-indigo-600" },
  { initials: "MR", from: "from-emerald-500", to: "to-teal-600" },
  { initials: "JD", from: "from-fuchsia-500", to: "to-pink-600" },
  { initials: "SL", from: "from-amber-500", to: "to-orange-600" },
];

export function Hero({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  chips = ["Microsoft Fabric", "Azure", "Databricks", "Modern DevOps"],
  proof = "Trusted by 150+ enterprise data teams",
}: HeroProps) {
  const reduce = useReducedMotion();
  const words = title.split(" ");

  return (
    <section className="relative overflow-hidden">
      <HeroBackground />

      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 pt-24 pb-16 text-center sm:px-6 sm:pt-32 sm:pb-24">
        {/* Social proof badge */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
          className="inline-flex items-center gap-2 rounded-full border border-brand-border/60 bg-brand-surface/60 px-3 py-1 text-xs font-medium text-brand-fg/80 backdrop-blur"
        >
          <Sparkles className="h-3.5 w-3.5 text-brand-accent" />
          Next-generation data &amp; AI delivery
        </motion.div>

        {/* Animated, per-word headline */}
        <motion.h1
          variants={staggerContainer(0.08, 0.1)}
          initial={reduce ? false : "hidden"}
          animate="visible"
          className="mt-6 text-balance text-4xl font-bold tracking-tight text-brand-fg sm:text-6xl lg:text-7xl"
          style={{ lineHeight: 1.05 }}
        >
          {words.map((word, i) => (
            <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-[0.1em]">
              <motion.span variants={wordReveal} className="inline-block">
                {word}
                {i < words.length - 1 ? " " : ""}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35, ease: EASE_OUT }}
          className="mt-6 max-w-xl text-pretty text-base leading-7 text-brand-fg/70 sm:text-lg"
        >
          {subtitle}
        </motion.p>

        {/* CTAs — magnetic primary */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45, ease: EASE_OUT }}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
        >
          <MagneticButton>
            <Button asChild variant="accent" size="lg">
              <Link href={primaryCta.href}>
                {primaryCta.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </MagneticButton>
          {secondaryCta && (
            <Button asChild variant="outline" size="lg">
              <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
            </Button>
          )}
        </motion.div>

        {/* Social proof: avatar stack + rating */}
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6, ease: EASE_OUT }}
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
        >
          <div className="flex -space-x-2">
            {AVATARS.map((a) => (
              <span
                key={a.initials}
                className={`inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${a.from} ${a.to} text-[10px] font-semibold text-white ring-2 ring-brand-bg`}
              >
                {a.initials}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="flex" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
            </span>
            <span className="text-sm text-brand-fg/70">{proof}</span>
          </div>
        </motion.div>

        {/* Tech chips */}
        <motion.ul
          variants={staggerContainer(0.06, 0.7)}
          initial={reduce ? false : "hidden"}
          animate="visible"
          className="mt-10 flex flex-wrap items-center justify-center gap-2"
        >
          {chips.map((chip) => (
            <motion.li
              key={chip}
              variants={fadeInUp}
              className="rounded-full border border-brand-border/50 bg-brand-surface/50 px-3 py-1 text-xs font-medium text-brand-fg/70 backdrop-blur"
            >
              {chip}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
