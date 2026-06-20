import { prisma } from "@/lib/prisma";
import { ContentManager, type FieldDef } from "@/components/admin/ContentManager";

export const dynamic = "force-dynamic";

const fields: FieldDef[] = [
  { name: "title", label: "Title", type: "text" },
  { name: "slug", label: "Slug", type: "text", hint: "lowercase-with-hyphens" },
  { name: "category", label: "Category", type: "text", placeholder: "e.g. Data Foundations" },
  { name: "summary", label: "Summary", type: "textarea" },
  { name: "highlights", label: "Highlights", type: "list", hint: "One per line" },
  { name: "order", label: "Sort order", type: "number" },
  { name: "published", label: "Published", type: "boolean" },
];

export default async function AdminServicesPage() {
  const rows = await prisma.service.findMany({ orderBy: { order: "asc" } });
  const items = rows.map((r) => ({
    id: r.id,
    title: r.title,
    slug: r.slug,
    published: r.published,
    category: r.category,
    summary: r.summary,
    highlights: r.highlights,
    order: r.order,
  }));

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-brand-fg">Services</h1>
        <p className="mt-1 text-sm text-brand-fg/60">Manage the services shown across the site.</p>
      </header>
      <ContentManager type="services" singular="service" fields={fields} items={items} />
    </div>
  );
}
