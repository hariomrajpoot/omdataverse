"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/motion";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Override the variant (defaults to fadeInUp). */
  variants?: Variants;
  /** Delay before this element animates. */
  delay?: number;
  as?: "div" | "section" | "li" | "ul" | "header";
};

/**
 * Scroll-triggered reveal. Animates once when it enters the viewport, and is a
 * no-op when the user prefers reduced motion (content renders immediately).
 */
export function Reveal({ children, className, variants = fadeInUp, delay = 0, as = "div" }: Props) {
  const reduce = useReducedMotion();
  const Comp = motion[as];

  if (reduce) {
    const Static = as;
    return <Static className={className}>{children}</Static>;
  }

  return (
    <Comp
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      transition={{ delay }}
    >
      {children}
    </Comp>
  );
}

/**
 * Staggered group: reveals children in a cascade as the group scrolls into
 * view. Wrap each child in <RevealItem> (or any element using `fadeInUp`).
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  delayChildren = 0,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
  as?: "div" | "section" | "ul";
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as];

  if (reduce) {
    const Static = as;
    return <Static className={className}>{children}</Static>;
  }

  return (
    <Comp
      className={className}
      variants={staggerContainer(stagger, delayChildren)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      {children}
    </Comp>
  );
}

/** A single staggered child. Must be rendered inside <RevealGroup>. */
export function RevealItem({
  children,
  className,
  variants = fadeInUp,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  as?: "div" | "li";
}) {
  const Comp = motion[as];
  return (
    <Comp className={className} variants={variants}>
      {children}
    </Comp>
  );
}
