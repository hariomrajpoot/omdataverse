"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Database, Zap, BarChart3, Cog, Sparkles } from "lucide-react";
import Link from "next/link";
import type { Service } from "@/lib/types";

export interface BentoGridProps {
  title?: string;
  subtitle?: string;
  services: Service[];
}

function ServiceIcon({ category }: { category: Service["category"] }) {
  const iconClass = "w-6 h-6";
  switch (category) {
    case "Data Foundations":
      return <Database className={iconClass} />;
    case "AI & Automation":
      return <Zap className={iconClass} />;
    case "Advanced Analytics":
      return <BarChart3 className={iconClass} />;
    case "Infrastructure & DevOps":
      return <Cog className={iconClass} />;
    default:
      return <Sparkles className={iconClass} />;
  }
}

export function BentoGrid({ title, subtitle, services }: BentoGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP hover animations for cards
    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll('.bento-card');
      cards.forEach((card) => {
        const glow = card.querySelector('.glow-effect');
        card.addEventListener('mouseenter', () => {
          gsap.to(glow, { opacity: 0.3, scale: 1.05, duration: 0.3, ease: "power2.out" });
          gsap.to(card, { y: -8, duration: 0.3, ease: "power2.out" });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(glow, { opacity: 0, scale: 1, duration: 0.3, ease: "power2.out" });
          gsap.to(card, { y: 0, duration: 0.3, ease: "power2.out" });
        });
      });
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            {title && (
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-brand-fg mb-6">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg leading-8 text-brand-muted">
                {subtitle}
              </p>
            )}
          </motion.header>
        )}

        <motion.div
          ref={gridRef}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {/* Large featured card */}
          {services[0] && (
            <motion.div
              variants={itemVariants}
              className="bento-card relative group col-span-1 md:col-span-2 lg:col-span-2 lg:row-span-2 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 shadow-xl shadow-slate-900/10 dark:shadow-slate-900/50 overflow-hidden"
            >
              <div className="glow-effect absolute inset-0 bg-linear-to-br from-[rgb(var(--brand-secondary))]/10 to-[rgb(var(--brand-primary))]/10 rounded-3xl opacity-0 scale-100 transition-all duration-300" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-2xl bg-linear-to-br from-[rgb(var(--brand-secondary))] to-[rgb(var(--brand-primary))] text-[rgb(var(--brand-onPrimary))]">
                    <ServiceIcon category={services[0].category} />
                  </div>
                  <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {services[0].category}
                  </Badge>
                </div>

                <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                  {services[0].title}
                </h3>

                <p className="text-slate-600 dark:text-slate-300 text-lg leading-7 mb-6">
                  {services[0].summary}
                </p>

                {services[0].highlights && (
                  <ul className="space-y-3 mb-8">
                    {services[0].highlights.slice(0, 4).map((highlight, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="flex items-center gap-3"
                      >
                        <div className="w-2 h-2 rounded-full bg-linear-to-r from-blue-500 to-purple-500 shrink-0" />
                        <span className="text-slate-700 dark:text-slate-300">{highlight}</span>
                      </motion.li>
                    ))}
                  </ul>
                )}

                <Button asChild className="bg-linear-to-r from-[rgb(var(--brand-secondary))] to-[rgb(var(--brand-primary))] hover:from-[rgb(var(--brand-secondary))]/90 hover:to-[rgb(var(--brand-primary))]/90 text-[rgb(var(--brand-onPrimary))] shadow-lg hover:shadow-xl transition-all duration-300">
                  <Link href="/services">
                    Learn more
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          )}

          {/* Medium cards */}
          {services.slice(1, 3).map((service) => (
            <motion.div
              key={service.slug}
              variants={itemVariants}
              className="bento-card relative group rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-6 shadow-xl shadow-slate-900/10 dark:shadow-slate-900/50 overflow-hidden"
            >
              <div className="glow-effect absolute inset-0 bg-linear-to-br from-green-500/10 to-blue-500/10 rounded-3xl opacity-0 scale-100 transition-all duration-300" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-linear-to-br from-green-500 to-blue-600 text-white">
                    <ServiceIcon category={service.category} />
                  </div>
                  <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs">
                    {service.category}
                  </Badge>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  {service.title}
                </h3>

                <p className="text-slate-600 dark:text-slate-300 text-sm leading-6 mb-4">
                  {service.summary}
                </p>

                {service.highlights && service.highlights.length > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-linear-to-r from-green-500 to-blue-500" />
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {service.highlights[0]}
                    </span>
                  </div>
                )}

                <Button asChild variant="ghost" size="sm" className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white p-0 h-auto">
                  <Link href="/services" className="flex items-center gap-1">
                    Explore
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}

          {/* Small cards */}
          {services.slice(3).map((service) => (
            <motion.div
              key={service.slug}
              variants={itemVariants}
              className="bento-card relative group rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-6 shadow-xl shadow-slate-900/10 dark:shadow-slate-900/50 overflow-hidden"
            >
              <div className="glow-effect absolute inset-0 bg-linear-to-br from-[rgb(var(--brand-secondary))]/10 to-[rgb(var(--brand-accent))]/10 rounded-3xl opacity-0 scale-100 transition-all duration-300" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-linear-to-br from-purple-500 to-pink-600 text-white">
                    <ServiceIcon category={service.category} />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {service.title}
                </h3>

                <p className="text-slate-600 dark:text-slate-300 text-sm leading-5 mb-4 line-clamp-3">
                  {service.summary}
                </p>

                <Button asChild variant="ghost" size="sm" className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white p-0 h-auto">
                  <Link href="/services" className="flex items-center gap-1">
                    Learn more
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}