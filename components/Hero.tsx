"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Fragment, useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Bot,
  ChevronLeft,
  ChevronRight,
  Database,
  Gauge,
  GraduationCap,
  Layers3,
  Rocket,
  Server,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Workflow,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export interface HeroProps {
  title: string;
  subtitle: string;
  supportingText?: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  badges?: { label: string; logo: string }[];
  backgroundImages?: string[];
  slides?: HeroSlide[];
}

export interface HeroSlide {
  label?: string;
  title: string;
  subtitle: string;
  supportingText?: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  badges?: { label: string; logo: string }[];
  backgroundImages?: string[];
}

const floatAnimation = (delay: number, duration: number) => ({
  y: [0, -12, 0],
  transition: { duration, delay, repeat: Infinity, ease: "easeInOut" as const },
});

export function Hero({
  title,
  subtitle,
  supportingText,
  primaryCta,
  secondaryCta,
  badges = [
    { label: "Microsoft Fabric", logo: "/logos/fabric.svg" },
    { label: "Azure", logo: "/logos/azure.svg" },
    { label: "Power BI", logo: "/logos/powerbi.svg" },
    { label: "Databricks", logo: "/logos/databricks.svg" },
    { label: "DevOps", logo: "/logos/adf.svg" },
  ],
  backgroundImages = [],
  slides,
}: HeroProps) {
  const gradientRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [currentBg, setCurrentBg] = useState(0);
  const resolvedSlides: HeroSlide[] =
    slides && slides.length > 0
      ? slides
      : [
          {
            title,
            subtitle,
            supportingText,
            primaryCta,
            secondaryCta,
            badges,
            backgroundImages,
          },
        ];
  const currentSlide = resolvedSlides[activeSlide] ?? resolvedSlides[0];
  const activeBadges = currentSlide.badges ?? badges;
  const slideThemes = [
    {
      pill: "border-blue-500/30 bg-blue-500/15 text-blue-200",
      button: "from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600",
    },
    {
      pill: "border-emerald-500/30 bg-emerald-500/15 text-emerald-200",
      button: "from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600",
    },
    {
      pill: "border-violet-500/30 bg-violet-500/15 text-violet-200",
      button: "from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600",
    },
    {
      pill: "border-amber-500/30 bg-amber-500/15 text-amber-200",
      button: "from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600",
    },
  ] as const;
  const activeTheme = slideThemes[activeSlide % slideThemes.length];
  const slideLabel = currentSlide.label ?? "Enterprise Data & AI";
  const resolvedBackgroundImages =
    (currentSlide.backgroundImages?.length ?? 0) > 0
      ? (currentSlide.backgroundImages as string[])
      : ["/hero-fallback-banner.svg"];
  const hasBackgrounds = resolvedBackgroundImages.length > 0;
  const currentBackgroundImage =
    resolvedBackgroundImages[currentBg] ?? resolvedBackgroundImages[0];

  const nextBg = useCallback(() => {
    setCurrentBg((prev) => (prev + 1) % resolvedBackgroundImages.length);
  }, [resolvedBackgroundImages.length]);

  useEffect(() => {
    if (!hasBackgrounds) return;
    const interval = setInterval(nextBg, 6000);
    return () => clearInterval(interval);
  }, [hasBackgrounds, nextBg]);

  useEffect(() => {
    if (!hasBackgrounds) return;
    setCurrentBg((prev) => prev % resolvedBackgroundImages.length);
  }, [hasBackgrounds, resolvedBackgroundImages.length]);

  useEffect(() => {
    setCurrentBg(0);
  }, [activeSlide]);

  useEffect(() => {
    if (resolvedSlides.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % resolvedSlides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isPaused, resolvedSlides.length]);

  useEffect(() => {
    if (gradientRef.current) {
      gsap.to(gradientRef.current, {
        backgroundPosition: "200% center",
        duration: 10,
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
      transition: { staggerChildren: 0.12, delayChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
  };

  const titleSegments = currentSlide.title
    .split(".")
    .map((segment) => segment.trim())
    .filter(Boolean);

  // Badge positions around the right-side visual (desktop only)
  const badgePositions = [
    "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
    "top-1/4 -right-4",
    "bottom-1/4 -right-4",
    "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
    "top-1/4 -left-4",
  ];
  const visualModes = [
    {
      eyebrow: "Service Architecture",
      title: "Unified Platform Control",
      badge: "Live",
      badgeTone: "border-cyan-400/25 bg-cyan-400/10 text-cyan-200",
      glow: "from-cyan-500/30 via-blue-500/20 to-indigo-500/30",
    },
    {
      eyebrow: "Training Experience",
      title: "Hands-on Learning Journey",
      badge: "Cohort",
      badgeTone: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
      glow: "from-emerald-500/30 via-teal-500/20 to-cyan-500/30",
    },
    {
      eyebrow: "Accelerator Flow",
      title: "Rapid Delivery Roadmap",
      badge: "Fast Track",
      badgeTone: "border-violet-400/25 bg-violet-400/10 text-violet-200",
      glow: "from-violet-500/30 via-fuchsia-500/20 to-indigo-500/30",
    },
    {
      eyebrow: "Outcome Snapshot",
      title: "Business Impact Dashboard",
      badge: "ROI",
      badgeTone: "border-amber-400/25 bg-amber-400/10 text-amber-200",
      glow: "from-amber-500/30 via-orange-500/20 to-pink-500/30",
    },
  ] as const;
  const activeVisual = visualModes[activeSlide % visualModes.length];

  return (
    <section
      className="relative min-h-screen overflow-hidden bg-black"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Auto-scrolling background images */}
      {hasBackgrounds && (
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBg}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={currentBackgroundImage}
                alt=""
                fill
                unoptimized
                className="object-cover"
                priority={currentBg === 0}
                sizes="100vw"
                onError={() => {
                  const fallbackImage =
                    resolvedBackgroundImages[resolvedBackgroundImages.length - 1];

                  if (
                    resolvedBackgroundImages.length > 1 &&
                    currentBackgroundImage !== fallbackImage
                  ) {
                    nextBg();
                  }
                }}
              />
              {/* Dark overlay for text readability */}
              <div className="absolute inset-0 bg-black/60" />
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Animated gradient background (fallback when no images) */}
      <div
        ref={gradientRef}
        className={`absolute inset-0 bg-linear-to-br from-black via-black/90 to-gray-950 ${hasBackgrounds ? "opacity-40" : ""}`}
        style={{ backgroundSize: "200% 200%" }}
      />

      {/* Light rays */}
      <div className={`absolute inset-0 overflow-hidden ${hasBackgrounds ? "opacity-50" : ""}`}>
        <div className="absolute -top-40 left-1/4 w-150 h-150 bg-blue-500/8 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-125 h-125 bg-violet-500/8 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 left-1/2 w-175 h-100 bg-blue-600/5 rounded-full blur-3xl" />
      </div>

      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 min-h-screen flex items-center py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
        >
          {/* Left: Text content */}
          <div className="space-y-8">
            <motion.div variants={itemVariants}>
              <span className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wider ${activeTheme.pill}`}>
                <Sparkles className="w-3.5 h-3.5" />
                {slideLabel}
              </span>
              {resolvedSlides.length > 1 && (
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-400">
                  Slide {activeSlide + 1} of {resolvedSlides.length}
                </p>
              )}
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]"
            >
              {titleSegments.map((segment, index) => (
                <Fragment key={`${segment}-${index}`}>
                  <span
                    className={
                      index === 1
                        ? "bg-linear-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent"
                        : "text-white"
                    }
                  >
                    {segment}
                    {index < titleSegments.length - 1 ? "." : ""}
                  </span>
                  {index < titleSegments.length - 1 && <br />}
                </Fragment>
              ))}
            </motion.h1>

            <motion.p
              key={`subtitle-${activeSlide}`}
              variants={itemVariants}
              className="text-lg sm:text-xl leading-relaxed text-slate-300 max-w-lg"
            >
              {currentSlide.subtitle}
            </motion.p>

            {currentSlide.supportingText && (
              <motion.p
                key={`support-${activeSlide}`}
                variants={itemVariants}
                className="text-sm leading-relaxed text-slate-400 max-w-lg"
              >
                {currentSlide.supportingText}
              </motion.p>
            )}

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 pt-2"
            >
              <Button
                asChild
                size="lg"
                className={`bg-linear-to-r ${activeTheme.button} text-white shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 px-8 border-0`}
              >
                <Link href={currentSlide.primaryCta.href}>
                  {currentSlide.primaryCta.label}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              {currentSlide.secondaryCta && (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white/15 text-slate-300 hover:bg-white/5 hover:text-white hover:border-white/25 transition-all duration-300 px-8"
                >
                  <Link href={currentSlide.secondaryCta.href}>{currentSlide.secondaryCta.label}</Link>
                </Button>
              )}
            </motion.div>

            {resolvedSlides.length > 1 && (
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-3 pt-2"
              >
                <button
                  type="button"
                  onClick={() =>
                    setActiveSlide((prev) =>
                      prev === 0 ? resolvedSlides.length - 1 : prev - 1,
                    )
                  }
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/90 transition hover:bg-white/10"
                  aria-label="Previous hero slide"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="flex items-center gap-2">
                  {resolvedSlides.map((_, index) => (
                    <button
                      key={`dot-${index}`}
                      type="button"
                      onClick={() => setActiveSlide(index)}
                      className={`h-2.5 rounded-full transition-all ${
                        activeSlide === index
                          ? "w-7 bg-white"
                          : "w-2.5 bg-white/35 hover:bg-white/60"
                      }`}
                      aria-label={`Go to hero slide ${index + 1}`}
                    />
                  ))}
                </div>

                <div className="h-1 w-20 overflow-hidden rounded-full bg-white/20">
                  <motion.div
                    key={`progress-${activeSlide}`}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 7, ease: "linear" }}
                    className="h-full rounded-full bg-white"
                  />
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setActiveSlide((prev) => (prev + 1) % resolvedSlides.length)
                  }
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/90 transition hover:bg-white/10"
                  aria-label="Next hero slide"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </motion.div>
            )}
          </div>

          {/* Right: Distinct visual per slide */}
          <motion.div variants={itemVariants} className="relative flex items-center justify-center">
            <div className="relative w-full max-w-136">
              <div className={`absolute -inset-2 rounded-4xl bg-linear-to-br ${activeVisual.glow} blur-2xl opacity-40`} />

              <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/75 p-5 backdrop-blur-2xl">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                      {activeVisual.eyebrow}
                    </p>
                    <h3 className="mt-1 text-base font-semibold text-white">{activeVisual.title}</h3>
                  </div>
                  <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${activeVisual.badgeTone}`}>
                    {activeVisual.badge}
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`hero-visual-${activeSlide}`}
                    initial={{ opacity: 0, y: 16, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -12, scale: 0.98 }}
                    transition={{ duration: 0.38, ease: "easeOut" }}
                  >
                    {activeSlide % 4 === 0 && (
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: "Throughput", value: "3.2 GB/min", icon: Gauge },
                          { label: "Uptime", value: "99.98%", icon: ShieldCheck },
                          { label: "Data Nodes", value: "24 Active", icon: Server },
                          { label: "Data Models", value: "187", icon: Database },
                        ].map((item) => {
                          const Icon = item.icon;
                          return (
                            <div key={item.label} className="rounded-xl border border-white/10 bg-white/5 p-3">
                              <div className="flex items-center gap-2 text-slate-400">
                                <Icon className="h-3.5 w-3.5 text-cyan-300" />
                                <span className="text-[10px] uppercase tracking-wider">{item.label}</span>
                              </div>
                              <p className="mt-2 text-lg font-semibold text-white">{item.value}</p>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {activeSlide % 4 === 1 && (
                      <div className="space-y-3">
                        {[
                          { module: "Fabric Foundations", progress: 92 },
                          { module: "Power BI Advanced", progress: 78 },
                          { module: "Azure AI Bootcamp", progress: 86 },
                        ].map((m) => (
                          <div key={m.module} className="rounded-xl border border-white/10 bg-white/5 p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <GraduationCap className="h-4 w-4 text-emerald-300" />
                                <p className="text-sm font-medium text-white">{m.module}</p>
                              </div>
                              <span className="text-xs text-emerald-300">{m.progress}%</span>
                            </div>
                            <div className="mt-2 h-2 rounded-full bg-slate-800">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${m.progress}%` }}
                                transition={{ duration: 0.8 }}
                                className="h-full rounded-full bg-linear-to-r from-emerald-400 to-teal-400"
                              />
                            </div>
                          </div>
                        ))}

                        <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm text-emerald-100">
                          <div className="flex items-center gap-2">
                            <Bot className="h-4 w-4" />
                            <span className="font-semibold">Live Mentor Support Enabled</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeSlide % 4 === 2 && (
                      <div className="space-y-3">
                        {[
                          { stage: "Discovery & Blueprint", time: "Week 1", icon: Layers3 },
                          { stage: "Build & Integrations", time: "Weeks 2-3", icon: Workflow },
                          { stage: "Go-Live & Hand-off", time: "Week 4", icon: Rocket },
                        ].map((s, idx) => {
                          const Icon = s.icon;
                          return (
                            <div key={s.stage} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-400/15 text-violet-200">
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-white">{s.stage}</p>
                                <p className="text-xs text-slate-400">{s.time}</p>
                              </div>
                              <div className="text-xs font-semibold text-violet-300">0{idx + 1}</div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {activeSlide % 4 === 3 && (
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: "Delivery Time", value: "-40%", tone: "text-emerald-300" },
                          { label: "Utilization", value: "+300%", tone: "text-cyan-300" },
                          { label: "Cost Efficiency", value: "-28%", tone: "text-violet-300" },
                          { label: "Stakeholder NPS", value: "+21", tone: "text-amber-300" },
                        ].map((kpi) => (
                          <div key={kpi.label} className="rounded-xl border border-white/10 bg-white/5 p-3">
                            <p className="text-[11px] uppercase tracking-wider text-slate-400">{kpi.label}</p>
                            <p className={`mt-2 text-2xl font-semibold ${kpi.tone}`}>{kpi.value}</p>
                          </div>
                        ))}
                        <div className="col-span-2 rounded-xl border border-white/10 bg-white/5 p-3">
                          <div className="flex items-center gap-2 text-slate-300">
                            <TrendingUp className="h-4 w-4 text-amber-300" />
                            <span className="text-sm">Case study performance trend across last 6 months</span>
                          </div>
                          <div className="mt-3 flex h-12 items-end gap-1">
                            {[34, 46, 42, 57, 68, 74, 82, 90].map((h, i) => (
                              <motion.span
                                key={`${h}-${i}`}
                                className="w-2 rounded-sm bg-linear-to-t from-amber-500/40 via-orange-400/60 to-pink-400/90"
                                style={{ height: `${h}%` }}
                                animate={{ opacity: [0.45, 1, 0.45] }}
                                transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.08 }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/35 to-transparent" />
              </div>

              {/* Floating badges */}
              {activeBadges.map((badge, index) => (
                <motion.div
                  key={badge.label}
                  animate={floatAnimation(index * 0.5, 3.5 + index * 0.3)}
                  className={`absolute hidden lg:flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 shadow-xl shadow-black/20 backdrop-blur-lg ${badgePositions[index] || ""}`}
                >
                  <Image src={badge.logo} alt={badge.label} width={20} height={20} className="shrink-0" />
                  <span className="text-xs font-medium whitespace-nowrap text-slate-200">{badge.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
