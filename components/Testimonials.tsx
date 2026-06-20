"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Star } from "lucide-react";
import { viewportOnce } from "@/lib/motion";
import {
  testimonials,
  testimonialInitials,
  type Testimonial,
} from "@/features/shared/lib/marketing";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={
            i < rating ? "h-3.5 w-3.5 fill-amber-400 text-amber-400" : "h-3.5 w-3.5 text-brand-border"
          }
        />
      ))}
    </div>
  );
}

function Card({ t }: { t: Testimonial }) {
  return (
    <figure className="flex w-[20rem] shrink-0 flex-col gap-4 rounded-2xl border border-brand-border/50 bg-brand-surface/60 p-6 backdrop-blur">
      <Stars rating={t.rating} />
      <blockquote className="text-sm leading-6 text-brand-fg/85">
        &ldquo;{t.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-auto flex items-center gap-3">
        <span
          className={`inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${t.gradient} text-xs font-semibold text-white`}
        >
          {testimonialInitials(t)}
        </span>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-brand-fg">{t.name}</div>
          <div className="truncate text-xs text-brand-fg/60">
            {t.role}, {t.company}
          </div>
        </div>
      </figcaption>
    </figure>
  );
}

function Row({ items, reverse }: { items: Testimonial[]; reverse?: boolean }) {
  // Duplicate the track so the translateX loop is seamless.
  const track = [...items, ...items];
  return (
    <div className="group relative flex overflow-hidden">
      <div
        className="flex gap-5 pr-5"
        style={{
          animation: `om-marquee ${reverse ? "44s" : "38s"} linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
        data-marquee
      >
        {track.map((t, i) => (
          <Card key={`${t.name}-${i}`} t={t} />
        ))}
      </div>
    </div>
  );
}

export function Testimonials() {
  const reduce = useReducedMotion();
  const half = Math.ceil(testimonials.length / 2);
  const rowA = testimonials.slice(0, half);
  const rowB = testimonials.slice(half);

  return (
    <section className="overflow-hidden py-16 sm:py-24">
      {/* Marquee keyframes + hover-pause, scoped here so the component is
          self-contained. Transform-only → composited, 60fps. */}
      <style>{`
        @keyframes om-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .group:hover [data-marquee] { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) { [data-marquee] { animation: none !important; } }
      `}</style>

      <motion.header
        initial={reduce ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.5 }}
        className="mx-auto mb-12 max-w-2xl px-4 text-center sm:px-6"
      >
        <h2 className="text-3xl font-semibold tracking-tight text-brand-fg sm:text-4xl">
          Trusted by data leaders
        </h2>
        <p className="mt-3 text-base leading-7 text-brand-fg/70">
          Teams ship faster, spend less, and trust their data more after working with us.
        </p>
      </motion.header>

      {reduce ? (
        <div className="mx-auto grid max-w-6xl gap-5 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name} t={t} />
          ))}
        </div>
      ) : (
        <div className="relative flex flex-col gap-5">
          {/* Edge fade masks */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-brand-bg to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-brand-bg to-transparent" />
          <Row items={rowA} />
          <Row items={rowB} reverse />
        </div>
      )}
    </section>
  );
}
