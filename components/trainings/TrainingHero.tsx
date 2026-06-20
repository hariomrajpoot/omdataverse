"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { GraduationCap } from "lucide-react";

export function TrainingHero() {
  return (
    <section className="relative overflow-hidden border-b border-brand-border/40 bg-brand-bg">
      {/* Background glow */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgb(var(--brand-accent)/0.18),transparent_60%)] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-3xl text-center"
        >
          <Badge variant="secondary" className="mb-6">
            <GraduationCap className="mr-1 h-3.5 w-3.5" />
            Trainings &amp; Workshops
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight text-brand-fg sm:text-5xl lg:text-6xl">
            Level Up Your{" "}
            <span className="bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Data &amp; AI
            </span>{" "}
            Skills
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-brand-fg/70">
            Hands-on workshops led by industry practitioners. Learn Microsoft Fabric, Azure AI,
            Databricks, and modern data engineering — from fundamentals to advanced patterns.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
