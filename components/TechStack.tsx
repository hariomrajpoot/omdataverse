"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Shield, Bot, Activity, Sparkles } from "lucide-react";

export interface TechLogo {
  name: string;
  src: string;
}

export interface TechStackProps {
  title?: string;
  subtitle?: string;
  logos?: TechLogo[];
}

const defaultLogos: TechLogo[] = [
  { name: "Microsoft Fabric", src: "/logos/fabric.svg" },
  { name: "Azure Data Factory", src: "/logos/adf.svg" },
  { name: "Azure Databricks", src: "/logos/databricks.svg" },
  { name: "Power BI", src: "/logos/powerbi.svg" },
  { name: "Azure OpenAI", src: "/logos/azure-openai.svg" },
];

export function TechStack({
  title = "Microsoft Data & AI stack",
  subtitle = "Fabric, Azure, Databricks, and Power BI—architected as a unified enterprise data platform you can ship in weeks, not months.",
  logos = defaultLogos,
}: TechStackProps) {
  const stackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP hover animations for tech cards
    if (stackRef.current) {
      const cards = stackRef.current.querySelectorAll('.tech-card');
      cards.forEach((card) => {
        const glow = card.querySelector('.tech-glow');
        card.addEventListener('mouseenter', () => {
          gsap.to(glow, { opacity: 0.4, scale: 1.1, duration: 0.3, ease: "power2.out" });
          gsap.to(card, { y: -5, scale: 1.02, duration: 0.3, ease: "power2.out" });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(glow, { opacity: 0, scale: 1, duration: 0.3, ease: "power2.out" });
          gsap.to(card, { y: 0, scale: 1, duration: 0.3, ease: "power2.out" });
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const principles = [
    {
      icon: Shield,
      title: "Secure by default",
      description: "RBAC, auditability, least privilege",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Bot,
      title: "Deterministic-first copilots",
      description: "Guardrails + escalation",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Activity,
      title: "Observable systems",
      description: "SLOs, traces, cost signals",
      color: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-linear-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <Badge className="mb-4 bg-linear-to-r from-[rgb(var(--brand-secondary))] to-[rgb(var(--brand-accent))] text-[rgb(var(--brand-onPrimary))] border-0">
            <Sparkles className="w-3 h-3 mr-1" />
            Enterprise-Grade Architecture
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
            {title}
          </h2>
          <p className="text-lg leading-8 text-slate-600 dark:text-slate-300">
            {subtitle}
          </p>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Principles Cards */}
          {principles.map((principle, index) => (
            <motion.div
              key={principle.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl shadow-slate-900/10 dark:shadow-slate-900/50 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-2xl transition-all duration-300"
            >
              <div className={`inline-flex p-3 rounded-xl bg-linear-to-br ${principle.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <principle.icon className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {principle.title}
              </h3>

              <p className="text-slate-600 dark:text-slate-300 text-sm">
                {principle.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Tech Stack Grid */}
        <motion.div
          ref={stackRef}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5"
        >
          {logos.map((logo, index) => (
            <motion.div
              key={logo.name}
              variants={itemVariants}
              className="tech-card relative group rounded-2xl border border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-6 text-center shadow-xl shadow-slate-900/10 dark:shadow-slate-900/50 overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              <div className="tech-glow absolute inset-0 bg-linear-to-br from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 scale-100 transition-all duration-300" />
              <div className="relative z-10">
                <div className="flex justify-center mb-4">
                  <Image
                    src={logo.src}
                    alt={logo.name}
                    width={140}
                    height={48}
                    className="h-10 w-auto opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                    priority={false}
                  />
                </div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors duration-300">
                  {logo.name}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

