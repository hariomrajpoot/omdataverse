import { prisma } from "@/lib/prisma";
import { ContentManager, type FieldDef } from "@/components/admin/ContentManager";

export const dynamic = "force-dynamic";

const fields: FieldDef[] = [
  { name: "title", label: "Title", type: "text" },
  { name: "slug", label: "Slug", type: "text", hint: "lowercase-with-hyphens" },
  { name: "summary", label: "Summary", type: "textarea" },
  { name: "industry", label: "Industry", type: "text" },
  { name: "problem", label: "Problem", type: "textarea" },
  { name: "approach", label: "Approach", type: "list", hint: "One step per line" },
  { name: "outcomes", label: "Outcomes", type: "outcomes", hint: "One per line as: Label | Value" },
  { name: "technologies", label: "Technologies", type: "list", hint: "One per line" },
  { name: "order", label: "Sort order", type: "number" },
  { name: "published", label: "Published", type: "boolean" },
];

export default async function AdminProjectsPage() {
  const rows = await prisma.project.findMany({ orderBy: { order: "asc" } });
  const items = rows.map((r) => ({
    id: r.id,
    title: r.title,
    slug: r.slug,
    published: r.published,
    summary: r.summary,
    industry: r.industry ?? "",
    problem: r.problem ?? "",
    approach: r.approach,
    outcomes: r.outcomes,
    technologies: r.technologies,
    order: r.order,
  }));

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-brand-fg">Our Work (Projects)</h1>
        <p className="mt-1 text-sm text-brand-fg/60">Manage delivered projects shown on /work.</p>
      </header>
      <ContentManager type="projects" singular="project" fields={fields} items={items} />
    </div>
  );
}
