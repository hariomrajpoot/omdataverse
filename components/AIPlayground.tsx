"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export interface AIPlaygroundProps {
  title?: string;
  description?: string;
}

type Mode = "SQL" | "Python";

function mockGenerate(prompt: string, mode: Mode) {
  const p = prompt.toLowerCase();
  const wantsSql = mode === "SQL" || p.includes("sql") || p.includes("query");
  const wantsPython =
    mode === "Python" || p.includes("python") || p.includes("pandas");

  if (wantsSql && !wantsPython) {
    return `-- Mock Copilot output (deterministic)
-- Prompt: ${prompt.trim()}
WITH base AS (
  SELECT
    /* TODO: select the columns you need */
    *
  FROM your_table
  WHERE 1=1
)
SELECT
  /* TODO: aggregates or projections */
  COUNT(*) AS row_count
FROM base
GROUP BY 1
ORDER BY 1;`;
  }

  return `# Mock Agent output (deterministic)
# Prompt: ${prompt.trim()}
import pandas as pd

df = pd.read_csv("data.csv")  # replace with your dataset

# TODO: filter / transform
result = (
    df
    .groupby(["dimension"])["metric"]
    .agg(["count", "mean", "sum"])
    .reset_index()
)

print(result.head())`;
}

export function AIPlayground({
  title = "Copilot / Agent demo (mocked)",
  description = "Type a request and see a deterministic SQL/Python snippet. No API keys required.",
}: AIPlaygroundProps) {
  const [prompt, setPrompt] = useState(
    "Generate SQL to summarize revenue by month for the last 12 months.",
  );
  const [mode, setMode] = useState<Mode>("SQL");

  const output = useMemo(() => mockGenerate(prompt, mode), [prompt, mode]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-brand-border/10 bg-brand-surface p-6">
          <h2 className="text-xl font-semibold tracking-tight text-brand-fg sm:text-2xl">
            {title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-brand-fg/70 sm:text-base">
            {description}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="text-sm font-semibold text-brand-fg/80" htmlFor="mode">
              Output
            </label>
            <div className="inline-flex rounded-md border border-brand-border/10 bg-brand-bg/60 p-1">
              {(["SQL", "Python"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={cn(
                    "h-9 rounded-md px-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg",
                    mode === m
                      ? "bg-brand-accent/45 text-brand-fg"
                      : "text-brand-fg/70 hover:text-brand-fg",
                  )}
                  aria-pressed={mode === m}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <label className="mt-5 block text-sm font-semibold text-brand-fg/80" htmlFor="prompt">
            Request
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={6}
            className={cn(
              "mt-2 w-full rounded-xl border border-brand-border/10 bg-brand-bg/60 px-4 py-3 text-sm text-brand-fg placeholder:text-brand-muted/70",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg",
            )}
            placeholder="e.g., Write Python to detect anomalies in daily orders"
          />

          <div className="mt-4 rounded-xl border border-brand-border/10 bg-brand-bg/60 p-4 text-xs text-brand-fg/70">
            <div className="font-semibold text-brand-fg">Wire real Azure OpenAI later</div>
            <div className="mt-1">
              Set `AZURE_OPENAI_ENDPOINT`, `AZURE_OPENAI_KEY`, `AZURE_OPENAI_DEPLOYMENT`
              and replace `mockGenerate()` with a server action / API call.
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-brand-border/10 bg-brand-surface p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold text-brand-fg">Generated snippet</div>
            <button
              type="button"
              className="rounded-md border border-brand-border/10 bg-brand-bg/60 px-3 py-1.5 text-xs font-semibold text-brand-fg/80 hover:bg-brand-bg/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg"
              onClick={async () => {
                await navigator.clipboard.writeText(output);
              }}
              aria-label="Copy generated snippet"
            >
              Copy
            </button>
          </div>
          <pre className="mt-4 overflow-auto rounded-xl border border-brand-border/10 bg-black/80 p-4 text-xs leading-5 text-white/90">
            <code>{output}</code>
          </pre>
        </div>
      </div>

      {/**
       * Story-like usage:
       * <AIPlayground />
       * <AIPlayground title="Agent demo" description="Try prompts containing 'sql' or 'python'." />
       */}
    </section>
  );
}

