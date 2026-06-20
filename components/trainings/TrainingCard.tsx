"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Clock, Star, BarChart2, Sparkles } from "lucide-react";
import type { Training } from "@/types";

const categoryLabels: Record<string, string> = {
  nanodegree: "NANODEGREE PROGRAM",
  workshop: "WORKSHOP",
  bootcamp: "BOOTCAMP",
  masterclass: "MASTERCLASS",
  certification: "CERTIFICATION",
};

const categoryColors: Record<string, string> = {
  nanodegree: "text-blue-500",
  workshop: "text-violet-500",
  bootcamp: "text-orange-500",
  masterclass: "text-emerald-500",
  certification: "text-amber-500",
};

export function TrainingCard({ training }: { training: Training }) {
  const cat = training.category ?? "workshop";
  const levelLabel = training.level
    ? training.level.charAt(0).toUpperCase() + training.level.slice(1)
    : "All Levels";

  return (
    <Link href={`/trainings/${training.slug}`} className="group block">
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex h-full flex-col overflow-hidden rounded-2xl border border-brand-border/50 bg-brand-surface/60 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-accent/50 hover:shadow-xl"
      >
        {/* Cover image */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-linear-to-br from-slate-800 to-slate-900">
          {training.imageUrl ? (
            <Image
              src={training.imageUrl}
              alt={training.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              unoptimized
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-linear-to-br from-blue-600 via-violet-600 to-purple-700">
              <Sparkles className="h-12 w-12 text-white/40" />
            </div>
          )}

          {/* Logo overlay */}
          <div className="absolute bottom-3 left-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white/90 shadow-md backdrop-blur-sm dark:bg-slate-800/90">
            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
          {/* Title */}
          <h3 className="mb-2 text-[15px] font-bold leading-snug text-brand-fg transition-colors group-hover:text-brand-accent">
            {training.title}
          </h3>

          {/* Description */}
          <p className="mb-4 line-clamp-2 text-[13px] leading-relaxed text-brand-fg/60">
            {training.summary}
          </p>

          {/* Category badge + rating */}
          <div className="mt-auto mb-4 flex items-center gap-3">
            <span
              className={`flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider ${categoryColors[cat] ?? "text-brand-accent"}`}
            >
              <Sparkles className="h-3 w-3" />
              {categoryLabels[cat] ?? "PROGRAM"}
            </span>

            {typeof training.rating === "number" && training.rating > 0 && (
              <span className="flex items-center gap-0.5 text-[13px] font-semibold text-brand-fg/80">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                {training.rating.toFixed(1)}
              </span>
            )}
          </div>

          {/* Footer: level + duration */}
          <div className="flex items-center gap-4 border-t border-brand-border/50 pt-3 text-[12px] text-brand-fg/60">
            <span className="flex items-center gap-1.5">
              <BarChart2 className="h-3.5 w-3.5" />
              {levelLabel}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {training.duration}
            </span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
