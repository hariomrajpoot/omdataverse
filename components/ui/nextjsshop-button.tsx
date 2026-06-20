import Link from "next/link";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

// Pixel-reveal button, restyled to match the project's brand accent.
// Note: indices are deterministic (no Math.random) to avoid hydration
// mismatches, and the accent color is driven by the --brand-accent token
// so it matches light/dark automatically.
export function Button01({
  text = "Get started",
  href = "#",
  className,
}: {
  text?: string;
  href?: string;
  className?: string;
}) {
  return (
    <Link href={href} className={cn("button01", className)}>
      <span className="button01_bg" aria-hidden="true">
        <span className="button01_bg-mid" />
        <span className="button01_bg-right">
          {Array.from({ length: 25 }).map((_, index) => (
            <span
              key={`pixel-${index}`}
              style={{ "--index": index % 4 } as CSSProperties}
              className="button01_bg-pixel"
            />
          ))}
        </span>
        <span className="button01_bg-right-overlay">
          {Array.from({ length: 11 }).map((_, index) => (
            <span
              key={`overlay-${index}`}
              style={{ "--index": 4 + (index % 4) } as CSSProperties}
              className="button01_bg-pixel"
            />
          ))}
        </span>
      </span>
      <span data-text={text} className="button01_inner">
        <span className="button01_text">{text}</span>
      </span>
    </Link>
  );
}
