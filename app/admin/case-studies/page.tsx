import { prisma } from "@/lib/prisma";
import { ContentManager, type FieldDef } from "@/components/admin/ContentManager";

export const dynamic = "force-dynamic";

const fields: FieldDef[] = [
  { name: "title", label: "Title", type: "text" },
  { name: "slug", label: "Slug", type: "text", hint: "lowercase-with-hyphens, used in the URL" },
  { name: "excerpt", label: "Excerpt", type: "textarea" },
  { name: "industry", label: "Industry", type: "text" },
  { name: "problem", label: "Problem", type: "textarea" },
  { name: "approach", label: "Approach", type: "list", hint: "One step per line" },
  { name: "outcomes", label: "Outcomes", type: "outcomes", hint: "One per line as: Label | Value" },
  { name: "technologies", label: "Technologies", type: "list", hint: "One per line" },
  { name: "published", label: "Published", type: "boolean" },
];

export default async function AdminCaseStudiesPage() {
  const rows = await prisma.caseStudy.findMany({ orderBy: { publishedAt: "desc" } });
  const items = rows.map((r) => ({
    id: r.id,
    title: r.title,
    slug: r.slug,
    published: r.published,
    excerpt: r.excerpt,
    industry: r.industry,
    problem: r.problem,
    approach: r.approach,
    outcomes: r.outcomes,
    technologies: r.technologies,
  }));

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-brand-fg">Case Studies</h1>
        <p className="mt-1 text-sm text-brand-fg/60">Create, edit, and publish case studies.</p>
      </header>
      <ContentManager type="case-studies" singular="case study" fields={fields} items={items} />
    </div>
  );
}
