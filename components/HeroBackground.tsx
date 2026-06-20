"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Animated hero backdrop — adapts the 21st.dev "grid hero" aesthetic
 * (a bordered column frame + ambient glow) into this project's brand tokens,
 * and animates it: two accent auroras slowly drift/pulse behind the content.
 *
 * Single-accent discipline (all glows use --brand-accent). Transform/opacity
 * only → composited at 60fps. Fully static under prefers-reduced-motion.
 */
export function HeroBackground() {
  const reduce = useReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Bordered column grid frame (the "grid hero" structure) */}
      <div className="absolute inset-0 grid grid-cols-[clamp(28px,10vw,120px)_auto_clamp(28px,10vw,120px)]">
        <div className="border-r border-brand-border/40" />
        <div className="border-x border-brand-border/40" />
        <div className="border-l border-brand-border/40" />
      </div>

      {/* Dot grid, masked to fade toward the edges */}
      <div
        className="absolute inset-0 opacity-[0.20] dark:opacity-[0.12]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgb(var(--brand-border)) 1px, transparent 0)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(ellipse 75% 55% at 50% 0%, #000 55%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 75% 55% at 50% 0%, #000 55%, transparent 100%)",
        }}
      />

      {/* Primary drifting aurora */}
      {reduce ? (
        <div className="absolute left-1/2 top-[-12%] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-brand-accent/15 blur-[130px]" />
      ) : (
        <>
          <motion.div
            className="absolute left-1/2 top-[-12%] h-[40rem] w-[40rem] rounded-full bg-brand-accent/15 blur-[130px]"
            initial={{ x: "-50%" }}
            animate={{
              x: ["-58%", "-42%", "-58%"],
              y: ["0%", "10%", "0%"],
              scale: [1, 1.12, 1],
              opacity: [0.55, 0.85, 0.55],
            }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Secondary, offset aurora drifting the other way */}
          <motion.div
            className="absolute left-1/2 top-[6%] h-[30rem] w-[30rem] rounded-full bg-brand-accent/10 blur-[120px]"
            initial={{ x: "-50%" }}
            animate={{
              x: ["-35%", "-65%", "-35%"],
              y: ["6%", "-4%", "6%"],
              scale: [1.05, 0.92, 1.05],
              opacity: [0.4, 0.65, 0.4],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}
    </div>
  );
}
