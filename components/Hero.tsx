"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export interface HeroProps {
  title: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  chips?: string[];
}

export function Hero({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  chips = ["Microsoft Fabric", "Azure", "Databricks", "Modern DevOps"],
}: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gradientRef.current) {
      gsap.to(gradientRef.current, {
        backgroundPosition: "200% center",
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <section ref={heroRef} className="relative min-h-screen overflow-hidden">
      <div
        ref={gradientRef}
        className="absolute inset-0 bg-gradient-to-r from-[rgb(var(--brand-bg))] via-[rgb(var(--brand-primary))]/5 to-[rgb(var(--brand-secondary))]/5 dark:from-[rgb(var(--brand-bg))] dark:via-[rgb(var(--brand-primary))]/10 dark:to-[rgb(var(--brand-secondary))]/10"
        style={{ backgroundSize: "200% center" }}
      />

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-[rgb(var(--brand-secondary))]/20 rounded-full blur-3xl dark:bg-[rgb(var(--brand-secondary))]/30" />
        <div className="absolute bottom-1/3 -right-40 w-80 h-80 bg-[rgb(var(--brand-primary))]/20 rounded-full blur-3xl dark:bg-[rgb(var(--brand-primary))]/30" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[rgb(var(--brand-secondary))]/10 rounded-full blur-3xl -translate-x-1/2 dark:bg-[rgb(var(--brand-secondary))]/15" />
      </div>

      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{
        backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(79, 130, 246, 0.05) 25%, rgba(79, 130, 246, 0.05) 26%, transparent 27%, transparent 74%, rgba(79, 130, 246, 0.05) 75%, rgba(79, 130, 246, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(79, 130, 246, 0.05) 25%, rgba(79, 130, 246, 0.05) 26%, transparent 27%, transparent 74%, rgba(79, 130, 246, 0.05) 75%, rgba(79, 130, 246, 0.05) 76%, transparent 77%, transparent)',
        backgroundSize: '50px 50px',
      }} />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center"
        >
          <motion.div variants={itemVariants} className="z-20 space-y-8">
            <motion.div variants={itemVariants}>
              <Badge className="bg-[rgb(var(--brand-secondary))]/20 text-[rgb(var(--brand-secondary))] border border-[rgb(var(--brand-secondary))]/50">
                <Sparkles className="w-3 h-3 mr-2" />
                Next-generation data intelligence
              </Badge>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-[rgb(var(--brand-fg))] leading-[1.1]"
            >
              {title}
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg leading-8 text-[rgb(var(--brand-fg))] dark:text-[rgb(var(--brand-muted))] max-w-xl"
            >
              {subtitle}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                asChild
                size="lg"
                className="bg-linear-to-r from-[rgb(var(--brand-secondary))] to-[rgb(var(--brand-primary))] hover:shadow-2xl hover:shadow-[rgb(var(--brand-secondary))]/40 text-[rgb(var(--brand-onPrimary))] transition-all duration-300 transform hover:scale-105"
              >
                <Link href={primaryCta.href}>
                  {primaryCta.label}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              {secondaryCta && (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-[rgb(var(--brand-border))] hover:bg-[rgb(var(--brand-surface))] dark:border-[rgb(var(--brand-border))] dark:hover:bg-[rgb(var(--brand-primary))]/10 transition-all duration-300"
                >
                  <Link href={secondaryCta.href}>
                    {secondaryCta.label}
                  </Link>
                </Button>
              )}
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-3"
            >
              {chips.map((chip) => (
                <motion.div
                  key={chip}
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 rounded-full bg-[rgb(var(--brand-surface))]/60 dark:bg-[rgb(var(--brand-primary))]/10 border border-[rgb(var(--brand-border))]/50 text-sm text-[rgb(var(--brand-fg))] backdrop-blur-sm hover:bg-[rgb(var(--brand-surface))] dark:hover:bg-[rgb(var(--brand-primary))]/20 transition-all duration-300"
                >
                  {chip}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="z-20 relative"
          >
            <motion.div
              initial={{ opacity: 0, rotateY: -20 }}
              animate={{ opacity: 1, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="relative rounded-2xl p-1 bg-gradient-to-br from-[rgb(var(--brand-secondary))]/40 via-transparent to-[rgb(var(--brand-primary))]/40">
                <div className="relative rounded-2xl bg-[rgb(var(--brand-surface))]/80 dark:bg-[rgb(var(--brand-primary))]/5 backdrop-blur-xl border border-[rgb(var(--brand-border))]/50 dark:border-[rgb(var(--brand-secondary))]/20 p-8 overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgb(var(--brand-secondary))]/50 to-transparent" />

                  <div className="space-y-6">
                    {[
                      {
                        label: "Data Processing",
                        value: "Real-time",
                        icon: "⚡"
                      },
                      {
                        label: "AI Pipeline",
                        value: "Deterministic",
                        icon: "🤖"
                      },
                      {
                        label: "Time to Insight",
                        value: "2-6 weeks",
                        icon: "📊"
                      },
                    ].map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="group flex items-start gap-4 p-4 rounded-xl hover:bg-[rgb(var(--brand-secondary))]/10 dark:hover:bg-[rgb(var(--brand-secondary))]/5 transition-all duration-300"
                      >
                        <div className="text-2xl">{stat.icon}</div>
                        <div className="flex-1">
                          <div className="text-sm text-[rgb(var(--brand-muted))]">{stat.label}</div>
                          <div className="text-lg font-semibold text-[rgb(var(--brand-fg))]">{stat.value}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgb(var(--brand-primary))]/50 to-transparent" />
                </div>
              </div>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-6 -right-6 w-24 h-24 bg-[rgb(var(--brand-secondary))]/20 rounded-full blur-2xl"
              />
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute -bottom-6 -left-6 w-32 h-32 bg-[rgb(var(--brand-primary))]/20 rounded-full blur-2xl"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

