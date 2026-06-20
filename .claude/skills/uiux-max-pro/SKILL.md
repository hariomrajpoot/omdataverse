---
name: uiux-max-pro
description: >-
  Build distinctive, production-grade UI/UX in this Next.js + Tailwind v4 +
  shadcn/ui codebase. Use when creating or restyling pages, sections, or
  components; when adding motion/scroll animation; or when the user asks for a
  polished, on-brand interface rather than a quick wireframe. Enforces a
  deliberate design process (tokens first, then build) and this repo's stack
  conventions (RSC, motion/framer-motion, gsap, lenis, lucide icons).
---

# UI/UX Max Pro

A skill for producing intentional, polished interfaces in **this** repository —
not generic templates. Follow the process; reuse the stack; verify the result.

## Stack you must build with

| Concern        | Use this                                                              |
| -------------- | --------------------------------------------------------------------- |
| Framework      | Next.js 16 App Router, **React Server Components by default**          |
| Styling        | Tailwind CSS **v4** (config in `tailwind.config.ts`, tokens in `app/globals.css`) |
| Components     | shadcn/ui (`@/components`), Radix primitives, `cva` for variants      |
| Class merging  | `cn()` from `@/lib/utils` (clsx + tailwind-merge) — never concat strings |
| Icons          | `lucide-react` only                                                   |
| Motion         | `motion` / `framer-motion` for component animation; `gsap` for timelines; `lenis` for smooth scroll |
| Color base     | shadcn `slate`, CSS variables (`bg-background`, `text-foreground`, …) |

Rules:

- Default to **Server Components**. Add `"use client"` only when a file needs
  state, effects, event handlers, or motion hooks — push interactivity into the
  smallest leaf component.
- Style with **token classes** (`bg-background`, `text-muted-foreground`,
  `border-border`), never raw hex or arbitrary `#fff`. New tokens go in
  `app/globals.css` as CSS variables, then map in `tailwind.config.ts`.
- New shadcn-style components belong in `@/components/ui`; compose feature UI in
  `features/` or `components/`. Mirror the existing file's structure before
  inventing a new one.
- Animate with `motion` (already installed). Prefer transform/opacity for
  60fps; respect `prefers-reduced-motion`.

## Process — do not skip to coding

### 1. Brainstorm a token system (before any markup)

Decide and write down, in one short block:

- **Palette** — pick from / extend the existing CSS variables. Name the role of
  each color (surface, accent, danger). Check contrast (WCAG AA: 4.5:1 body,
  3:1 large text).
- **Type scale** — sizes, weights, line-heights as a small ramp, not ad hoc.
- **Spacing & radius** — a consistent rhythm (e.g. 4/8px base) and one radius
  scale.
- **Motion language** — durations (e.g. 150/250/400ms), easing, what moves and
  why.

### 2. Critique the tokens

Before building, ask: Is this distinctive or default-bootstrap? Does it match
the product's voice? Is anything arbitrary (a one-off color, a magic number)?
Fix the system, then commit it.

### 3. Build

- Compose from shadcn primitives first; only hand-roll when none fit.
- Mobile-first: design the small breakpoint, then enhance up. No horizontal
  body scroll; wide content (tables, code) scrolls inside its own
  `overflow-x-auto` container.
- Semantic HTML + a11y: real `<button>`/`<a>`, labels on inputs, `alt` on
  images, visible focus states, keyboard operability.
- Copy matters: write specific, confident microcopy — never "Lorem ipsum" or
  "Click here".

### 4. Verify

- Run the app (`npm run dev`) and look at the change at mobile + desktop widths.
- `npm run lint` and `npm run build` must pass.
- Re-check: contrast, focus order, reduced-motion, no layout shift, no leftover
  placeholder text.

## Taste guidance (principles over prescriptions)

- **Intentional, not decorative** — every color, shadow, and animation earns its
  place. When unsure, remove it.
- **Hierarchy through restraint** — establish emphasis with scale, weight, and
  space before reaching for color or borders.
- **One accent, used sparingly** — a single confident accent reads as designed;
  many compete and read as a template.
- **Consistent rhythm** — repeated spacing and alignment beat pixel-perfect
  one-offs.
- **Motion supports meaning** — entrances orient, transitions preserve context;
  motion that only decorates is noise.

## Anti-patterns to reject

- Marking a whole page `"use client"` to animate one element.
- Inline hex / arbitrary Tailwind values when a token exists.
- Reimplementing a dialog, dropdown, or tooltip instead of using the Radix/shadcn one.
- Centered max-w-2xl card on a gradient — the default-AI look. Make a deliberate choice.
- Animation without `prefers-reduced-motion` handling.

## Example: client motion leaf

```tsx
"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export function FadeIn({ className, children }: { className?: string; children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
```
