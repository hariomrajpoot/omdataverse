"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export interface CTASectionProps {
  title: string;
  subtitle: string;
  cta: { label: string; href: string };
  secondary?: { label: string; href: string };
}

export function CTASection({ title, subtitle, cta, secondary }: CTASectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP background animation
    if (sectionRef.current) {
      gsap.to(sectionRef.current.querySelector('.cta-bg'), {
        backgroundPosition: "200% 0",
        duration: 8,
        ease: "none",
        repeat: -1,
      });
    }
  }, []);

  return (
    <section ref={sectionRef} className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[rgb(var(--brand-secondary))] via-[rgb(var(--brand-primary))] to-[rgb(var(--brand-accent))] p-8 shadow-2xl shadow-slate-900/25 sm:p-12 lg:p-16"
        >
          {/* Animated background */}
          <div className="cta-bg absolute inset-0 bg-linear-to-r from-[rgb(var(--brand-secondary))]/90 via-[rgb(var(--brand-primary))]/90 to-[rgb(var(--brand-accent))]/90 bg-size-[200%_100%]" />
          <div className="absolute inset-0 bg-black/20" />

          {/* Floating elements */}
          <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-xl" />
          <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/10 rounded-full blur-xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/5 rounded-full blur-2xl" />

          <div className="relative z-10 grid items-center gap-8 md:grid-cols-2">
            <div className="text-white">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="flex items-center gap-2 mb-4"
              >
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-medium text-blue-100">Ready to transform your data?</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4"
              >
                {title}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-lg leading-7 text-blue-100"
              >
                {subtitle}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-col gap-4 sm:flex-row md:justify-end"
            >
              <Button asChild size="lg" className="bg-white text-slate-900 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Link href={cta.href}>
                  {cta.label}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              {secondary && (
                <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 backdrop-blur-sm transition-all duration-300">
                  <Link href={secondary.href}>
                    {secondary.label}
                  </Link>
                </Button>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

