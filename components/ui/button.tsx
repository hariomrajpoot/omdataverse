import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Brand-tokenized variants. (The previous shadcn defaults referenced CSS vars
// like `bg-primary`/`ring-ring` that are not defined in this project — only
// `--brand-*` exists — so base variants rendered uncolored.)
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-[transform,background-color,box-shadow,color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-brand-primary text-brand-onPrimary shadow-sm hover:bg-brand-primary/90 active:scale-[0.98]",
        accent:
          "bg-brand-accent text-white shadow-sm shadow-brand-accent/25 hover:bg-brand-accent/90 hover:shadow-md hover:shadow-brand-accent/30 active:scale-[0.98]",
        outline:
          "border border-brand-border/60 bg-transparent text-brand-fg hover:bg-brand-surface hover:border-brand-border active:scale-[0.98]",
        secondary:
          "bg-brand-surface text-brand-fg hover:bg-brand-surface/70 active:scale-[0.98]",
        ghost: "text-brand-fg hover:bg-brand-surface active:scale-[0.98]",
        link: "text-brand-accent underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-lg px-7 text-[0.95rem]",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
