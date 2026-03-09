"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, ArrowRight, Phone, MapPin } from "lucide-react";
import Link from "next/link";

export function ContactHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const raysRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP animations for light rays
    if (raysRef.current) {
      gsap.set(raysRef.current.children, { opacity: 0, scale: 0.8 });
      gsap.to(raysRef.current.children, {
        opacity: 0.6,
        scale: 1,
        duration: 2,
        stagger: 0.3,
        ease: "power2.out",
        repeat: -1,
        yoyo: true,
      });
    }
  }, []);

  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      description: "Get in touch via email",
      action: "v9754r@gmail.com",
      href: "mailto:v9754r@gmail.com",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Phone,
      title: "Call",
      description: "Speak with our team",
      action: "+91 97547 99646",
      href: "tel:+919754799646",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: MapPin,
      title: "Visit",
      description: "Come see us in person",
      action: "Schedule a visit",
      href: "#contact-form",
      color: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <section ref={containerRef} className="relative min-h-screen overflow-hidden bg-linear-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center">
      {/* Progressive Blur Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,119,198,0.3),transparent_50%)] blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,119,198,0.2),transparent_50%)] blur-3xl" />
      </div>

      {/* Animated Light Rays */}
      <div ref={raysRef} className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-linear-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-2xl" />
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-linear-to-r from-pink-400/20 to-orange-400/20 rounded-full blur-2xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Badge variant="secondary" className="mb-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
              Let's Talk
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight mb-6"
          >
            Ready to Transform Your Data Platform?
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-xl leading-8 text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-12"
          >
            Get in touch with our team. Whether you need a quick consultation or want to explore a full implementation, we're here to help.
          </motion.p>

          {/* Contact Methods */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1, duration: 0.6 }}
                className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className={`inline-flex p-3 rounded-xl bg-linear-to-br ${method.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <method.icon className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {method.title}
                </h3>

                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                  {method.description}
                </p>

                <Button asChild variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-0 h-auto">
                  <Link href={method.href} className="flex items-center gap-1">
                    {method.action}
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </Button>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="inline-block"
          >
            <Button asChild size="lg" className="bg-linear-to-r from-[rgb(var(--brand-secondary))] to-[rgb(var(--brand-primary))] hover:from-[rgb(var(--brand-secondary))]/90 hover:to-[rgb(var(--brand-primary))]/90 text-[rgb(var(--brand-onPrimary))] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Link href="#contact-form">
                START YOUR AUDIT
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}