import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Brand-tokenized (see note in button.tsx re: the previous undefined CSS vars).
const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-bg",
  {
    variants: {
      variant: {
        default:
          "border-brand-accent/30 bg-brand-accent/10 text-brand-accent",
        secondary:
          "border-brand-border/60 bg-brand-surface text-brand-fg/80",
        outline: "border-brand-border/60 text-brand-fg/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
