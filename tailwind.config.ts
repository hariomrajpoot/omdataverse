import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "72rem",
      },
    },
    extend: {
      colors: {
        brand: {
          bg: "rgb(var(--brand-bg) / <alpha-value>)",
          fg: "rgb(var(--brand-fg) / <alpha-value>)",
          surface: "rgb(var(--brand-surface) / <alpha-value>)",
          muted: "rgb(var(--brand-muted) / <alpha-value>)",
          border: "rgb(var(--brand-border) / <alpha-value>)",
          primary: "rgb(var(--brand-primary) / <alpha-value>)",
          onPrimary: "rgb(var(--brand-onPrimary) / <alpha-value>)",
          accent: "rgb(var(--brand-accent) / <alpha-value>)",
        },
      },
      boxShadow: {
        soft: "0 1px 0 rgba(255,255,255,0.06) inset, 0 10px 30px rgba(0,0,0,0.22)",
      },
      typography: {
        invert: {
          css: {
            "--tw-prose-body": "rgb(var(--brand-fg) / 0.78)",
            "--tw-prose-headings": "rgb(var(--brand-fg) / 0.96)",
            "--tw-prose-links": "rgb(var(--brand-accent) / 1)",
            "--tw-prose-bold": "rgb(var(--brand-fg) / 0.94)",
            "--tw-prose-bullets": "rgb(var(--brand-fg) / 0.5)",
            "--tw-prose-hr": "rgb(var(--brand-border) / 0.14)",
            "--tw-prose-quotes": "rgb(var(--brand-fg) / 0.88)",
            "--tw-prose-quote-borders": "rgb(var(--brand-border) / 0.2)",
            "--tw-prose-captions": "rgb(var(--brand-fg) / 0.62)",
            "--tw-prose-code": "rgb(var(--brand-fg) / 0.92)",
            "--tw-prose-pre-bg": "rgba(0,0,0,0.35)",
            "--tw-prose-th-borders": "rgb(var(--brand-border) / 0.18)",
            "--tw-prose-td-borders": "rgb(var(--brand-border) / 0.12)",
          },
        },
      },
    },
  },
  plugins: [typography],
} satisfies Config;

