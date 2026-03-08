"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Zap, TrendingUp } from "lucide-react";

export function MetricsSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const counters = containerRef.current.querySelectorAll('.metric-number');
      
      // Trigger animations on scroll
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              gsap.from(entry.target, { textContent: 0, duration: 2, ease: "power2.out", snap: { textContent: 1 } });
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );

      counters.forEach((counter) => observer.observe(counter));
    }
  }, []);

  const metrics = [
    {
      number: 150,
      label: "Enterprise Clients",
      description: "Trusted by leading companies worldwide",
      icon: CheckCircle2,
      color: "from-blue-500 to-cyan-500",
    },
    {
      number: 2500,
      label: "Projects Delivered",
      description: "Data platforms and AI solutions in production",
      icon: Zap,
      color: "from-purple-500 to-pink-500",
    },
    {
      number: 340,
      label: "% ROI Average",
      description: "Measured improvement within 6 months",
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
    <section className="py-20 sm:py-28 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-400/50">
            Success Metrics
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Proven Results at Scale
          </h2>
          <p className="text-lg leading-8 text-slate-300">
            Our track record speaks for itself. Every project is measured, monitored, and optimized for maximum impact.
          </p>
        </motion.header>

        <motion.div
          ref={containerRef}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              variants={itemVariants}
              className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 overflow-hidden"
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-linear-to-br ${metric.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

              <div className="relative z-10">
                <div className={`inline-flex p-4 rounded-2xl bg-linear-to-br ${metric.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <metric.icon className="w-6 h-6" />
                </div>

                <motion.div
                  className="metric-number text-5xl sm:text-6xl font-bold mb-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                >
                  {metric.number}
                </motion.div>

                <h3 className="text-lg font-semibold text-white mb-2">{metric.label}</h3>
                <p className="text-slate-400">{metric.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-16 pt-16 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          {[
            { label: "Avg. Implementation Time", value: "4 weeks" },
            { label: "Customer Satisfaction", value: "98%" },
            { label: "On-time Delivery", value: "99.2%" },
            { label: "Support Availability", value: "24/7" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
            >
              <div className="text-2xl sm:text-3xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}