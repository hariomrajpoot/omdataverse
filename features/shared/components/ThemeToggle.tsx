"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/features/shared/lib/utils";

type Theme = "dark" | "light";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem("theme");
  if (stored === "dark" || stored === "light") return stored;
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
  return prefersDark ? "dark" : "light";
}

export function ThemeToggle() {
  // Initialize theme to "dark" for server rendering.
  // The actual client theme will be set in the useEffect after hydration.
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // This runs only on the client after hydration.
    // Read the actual theme from client preferences.
    const clientTheme = getInitialTheme();
    setTheme(clientTheme); // Update the theme state
    setMounted(true); // Mark as mounted

    // Apply the initial client theme to the document element
    if (clientTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []); // Run once on mount

  // This useEffect will react to changes in the theme state (e.g., from user click)
  useEffect(() => {
    if (mounted) { // Only run if component is mounted on client
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [theme, mounted]); // Depend on theme and mounted

  const nextTheme = useMemo<Theme>(() => (theme === "dark" ? "light" : "dark"), [theme]);

  // If not mounted, render the dark mode button as a placeholder
  // This will be the server-rendered HTML.
  if (!mounted) {
    return (
      <button
        type="button"
        className={cn(
          "inline-flex h-10 w-10 items-center justify-center rounded-md border border-brand-border/10 bg-brand-surface text-brand-fg/80",
          "hover:bg-brand-surface/80 hover:text-brand-fg",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg",
        )}
        aria-label="Switch to light mode" // Server always renders for "dark" initial state
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path
            d="M21 12.6A8.5 8.5 0 0 1 11.4 3a7 7 0 1 0 9.6 9.6Z" // Dark mode icon path
            fill="currentColor"
            opacity="0.9"
          />
        </svg>
      </button>
    );
  }

  // Once mounted, render the actual toggle based on the client theme
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-md border border-brand-border/10 bg-brand-surface text-brand-fg/80",
        "hover:bg-brand-surface/80 hover:text-brand-fg",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg",
      )}
      aria-label={`Switch to ${nextTheme} mode`}
      onClick={() => {
        const t: Theme = theme === "dark" ? "light" : "dark";
        setTheme(t);
        window.localStorage.setItem("theme", t);
        // The document.documentElement class is updated by the useEffect
      }}
    >
      {theme === "dark" ? (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path
            d="M21 12.6A8.5 8.5 0 0 1 11.4 3a7 7 0 1 0 9.6 9.6Z"
            fill="currentColor"
            opacity="0.9"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path
            d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12Zm0-16v2m0 16v2M4 12H2m20 0h-2M5.6 5.6 4.2 4.2m15.6 15.6-1.4-1.4M18.4 5.6l1.4-1.4M4.2 19.8l1.4-1.4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );
}
