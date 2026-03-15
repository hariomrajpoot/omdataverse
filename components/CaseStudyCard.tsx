"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import type { CaseStudy } from "@/lib/types";

export interface CaseStudyCardProps {
  caseStudy: CaseStudy;
}

export function CaseStudyCard({ caseStudy }: CaseStudyCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP hover animations
    if (cardRef.current) {
      const card = cardRef.current;
      const overlay = card.querySelector('.case-overlay');
      const stats = card.querySelectorAll('.stat-counter');

      card.addEventListener('mouseenter', () => {
        gsap.to(overlay, { opacity: 0.8, duration: 0.3, ease: "power2.out" });
        gsap.to(card, { y: -8, scale: 1.02, duration: 0.3, ease: "power2.out" });
        stats.forEach((stat, index) => {
          gsap.fromTo(stat, { innerText: 0 }, {
            innerText: parseInt(stat.textContent || '0'),
            duration: 0.8,
            ease: "power2.out",
            snap: { innerText: 1 },
            delay: index * 0.1
          });
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(overlay, { opacity: 0, duration: 0.3, ease: "power2.out" });
        gsap.to(card, { y: 0, scale: 1, duration: 0.3, ease: "power2.out" });
      });
    }
  }, []);

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="group relative rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-[rgba(var(--brand-surface),0.8)] backdrop-blur-xl p-6 shadow-xl shadow-slate-900/10 dark:shadow-slate-900/50 overflow-hidden hover:shadow-2xl transition-all duration-300"
    >
      {/* Animated overlay */}
      <div className="case-overlay absolute inset-0 bg-linear-to-br from-blue-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 rounded-3xl" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
            {caseStudy.industry}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <Calendar className="w-3 h-3" />
            {new Date(caseStudy.publishedAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
            })}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-brand-fg mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {caseStudy.title}
        </h3>

        {/* Excerpt */}
        <p className="text-brand-fg/70 text-sm leading-6 mb-4">
          {caseStudy.excerpt}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-6">
          {caseStudy.technologies.slice(0, 3).map((tech) => (
            <Badge key={tech} variant="outline" className="text-xs bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
              {tech}
            </Badge>
          ))}
          {caseStudy.technologies.length > 3 && (
            <Badge variant="outline" className="text-xs bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
              +{caseStudy.technologies.length - 3} more
            </Badge>
          )}
        </div>

        {/* Stats (if available) */}
        {caseStudy.outcomes && caseStudy.outcomes.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mb-6 p-3 bg-brand-bg/10 rounded-xl">
            {caseStudy.outcomes.slice(0, 2).map((outcome, index) => (
              <div key={index} className="text-center">
                <div className="stat-counter text-lg font-bold text-brand-fg">
                  {outcome.value}
                </div>
                <div className="text-xs text-brand-muted">
                  {outcome.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <Button asChild variant="ghost" size="sm" className="w-full justify-between bg-brand-bg/10 hover:bg-brand-bg/20 border border-slate-200 dark:border-slate-600">
          <Link href={`/case-studies/${caseStudy.slug}`} className="flex items-center justify-between w-full">
            <span>Read case study</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </motion.article>
  );
}

