import Image from "next/image";

export interface TechLogo {
  name: string;
  src: string;
}

export interface TechStackProps {
  title?: string;
  subtitle?: string;
  logos?: TechLogo[];
}

const defaultLogos: TechLogo[] = [
  { name: "Microsoft Fabric", src: "/logos/fabric.svg" },
  { name: "Azure Data Factory", src: "/logos/adf.svg" },
  { name: "Azure Databricks", src: "/logos/databricks.svg" },
  { name: "Power BI", src: "/logos/powerbi.svg" },
  { name: "Azure OpenAI", src: "/logos/azure-openai.svg" },
];

export function TechStack({
  title = "Microsoft Data & AI stack",
  subtitle = "Fabric, Azure, Databricks, and Power BI—architected as a unified enterprise data platform you can ship in weeks, not months.",
  logos = defaultLogos,
}: TechStackProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
      <div className="grid items-end gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-brand-fg sm:text-3xl">
            {title}
          </h2>
          <p className="mt-3 text-sm leading-6 text-brand-fg/70 sm:text-base">
            {subtitle}
          </p>
        </div>
        <div className="rounded-2xl border border-brand-border/10 bg-brand-surface p-5 text-sm text-brand-fg/70">
          <div className="font-semibold text-brand-fg">Design principles</div>
          <ul className="mt-2 space-y-1">
            <li>Secure by default (RBAC, auditability, least privilege)</li>
            <li>Deterministic-first copilots (guardrails + escalation)</li>
            <li>Observable systems (SLOs, traces, cost signals)</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {logos.map((l) => (
          <div
            key={l.name}
            className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-brand-border/10 bg-brand-surface p-4 text-center ring-1 ring-brand-border/5"
          >
            <Image
              src={l.src}
              alt=""
              width={140}
              height={48}
              className="h-10 w-auto opacity-90"
              priority={false}
            />
            <div className="text-xs font-semibold text-brand-fg/75">{l.name}</div>
          </div>
        ))}
      </div>

      {/**
       * Story-like usage:
       * <TechStack />
       *
       * Variant:
       * <TechStack logos={[{name:"Postgres", src:"/logos/postgres.svg"}]} />
       */}
    </section>
  );
}

