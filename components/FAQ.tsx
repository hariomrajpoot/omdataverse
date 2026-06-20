"use client";

import { useState, useId } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import { EASE_OUT, viewportOnce } from "@/lib/motion";
import { faqs } from "@/features/shared/lib/marketing";

function Item({
  question,
  answer,
  open,
  onToggle,
}: {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}) {
  const id = useId();
  const reduce = useReducedMotion();

  return (
    <div className="border-b border-brand-border/50">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          id={`${id}-button`}
          className="flex w-full items-center justify-between gap-4 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg"
        >
          <span className="text-base font-medium text-brand-fg">{question}</span>
          <motion.span
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-brand-border/60 text-brand-fg/70"
          >
            <Plus className="h-4 w-4" />
          </motion.span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${id}-panel`}
            role="region"
            aria-labelledby={`${id}-button`}
            initial={reduce ? { opacity: 1, height: "auto" } : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
            className="overflow-hidden"
          >
            <p className="pb-5 pr-10 text-sm leading-7 text-brand-fg/70">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  const reduce = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <motion.header
        initial={reduce ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-3xl font-semibold tracking-tight text-brand-fg sm:text-4xl">
          Frequently asked questions
        </h2>
        <p className="mt-3 text-base leading-7 text-brand-fg/70">
          Everything you need to know before booking a strategy audit.
        </p>
      </motion.header>

      <div className="mt-10">
        {faqs.map((f, i) => (
          <Item
            key={f.question}
            question={f.question}
            answer={f.answer}
            open={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </div>
    </section>
  );
}
