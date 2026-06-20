"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

export function TrainingAgenda({ items }: { items: string[] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="divide-y divide-brand-border/50 rounded-2xl border border-brand-border/50 bg-brand-surface/60">
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.04, duration: 0.25 }}
          className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-brand-surface"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-accent/10 text-xs font-bold text-brand-accent">
            {String(i + 1).padStart(2, "0")}
          </span>
          <BookOpen className="h-4 w-4 shrink-0 text-brand-fg/40" />
          <span className="text-sm font-medium text-brand-fg/80">{item}</span>
        </motion.div>
      ))}
    </div>
  );
}
