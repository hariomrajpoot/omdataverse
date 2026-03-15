"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Badge } from "@/components/ui/badge";
import { Database, Brain, BarChart3, TrendingUp, ArrowRight, Sparkles, Zap } from "lucide-react";

export function AISolutions() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate the flow diagram
    if (diagramRef.current) {
      const tl = gsap.timeline({ repeat: -1, yoyo: true });
      tl.to(diagramRef.current.querySelectorAll('.flow-arrow'), {
        x: 10,
        duration: 1.5,
        stagger: 0.3,
        ease: "power2.inOut",
      });
    }
  }, []);

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const steps = [
    {
      icon: Database,
      title: "Data Ingestion",
      description: "Connect and harmonize data from Azure, Fabric, and Databricks sources",
      color: "from-blue-500 to-cyan-500",
      features: ["Real-time streaming", "Batch processing", "Data quality validation"],
    },
    {
      icon: Brain,
      title: "AI Models",
      description: "Deploy custom Copilot agents and Azure OpenAI models with enterprise guardrails",
      color: "from-purple-500 to-pink-500",
      features: ["Custom fine-tuning", "Safety alignment", "Performance monitoring"],
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboards",
      description: "Build semantic layers and KPI systems that teams actually trust and use",
      color: "from-green-500 to-emerald-500",
      features: ["Power BI integration", "Real-time metrics", "Self-service analytics"],
    },
    {
      icon: TrendingUp,
      title: "Business Outcomes",
      description: "Measure impact with automated reporting and continuous improvement cycles",
      color: "from-orange-500 to-red-500",
      features: ["ROI tracking", "Process optimization", "Predictive insights"],
    },
  ];

  return (
    <section ref={sectionRef} className="py-20 sm:py-28 bg-linear-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
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
            AI Transformation Journey
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
            From Raw Data to Autonomous Intelligence
          </h2>
          <p className="text-lg leading-8 text-slate-600 dark:text-slate-300">
            Our proven methodology transforms your data estate into a competitive advantage through systematic AI implementation.
          </p>
        </motion.header>

        {/* Flow Diagram */}
        <motion.div
          ref={diagramRef}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative mb-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                variants={itemVariants}
                className="relative"
              >
                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div className="flow-arrow hidden lg:block absolute top-12 left-full w-8 h-0.5 bg-linear-to-r from-[rgb(var(--brand-border))] to-[rgb(var(--brand-muted))] z-0">
                    <ArrowRight className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 text-slate-400 dark:text-slate-500" />
                  </div>
                )}

                <div className="relative z-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl shadow-slate-900/10 dark:shadow-slate-900/50 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-2xl transition-all duration-300 group">
                  <div className={`inline-flex p-3 rounded-xl bg-linear-to-br ${step.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    {step.title}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-6 mb-4">
                    {step.description}
                  </p>

                  <ul className="space-y-2">
                    {step.features.map((feature, featureIndex) => (
                      <motion.li
                        key={feature}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: featureIndex * 0.1, duration: 0.4 }}
                        className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-linear-to-r from-slate-400 to-slate-500" />
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-linear-to-r from-[rgb(var(--brand-secondary))] via-[rgb(var(--brand-primary))] to-[rgb(var(--brand-accent))] rounded-3xl p-8 lg:p-12 text-[rgb(var(--brand-onPrimary))] relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                Measurable Results, Guaranteed
              </h3>
              <p className="text-blue-100 text-lg leading-7 mb-6">
                Every implementation includes performance monitoring, ROI tracking, and continuous optimization to ensure your AI investment delivers real business value.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">↓ 40%</div>
                  <div className="text-sm text-blue-100">Time to insights</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">↑ 300%</div>
                  <div className="text-sm text-blue-100">Data utilization</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative">
                <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Zap className="w-16 h-16 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-yellow-900" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}