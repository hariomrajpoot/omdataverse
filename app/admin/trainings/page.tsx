import { prisma } from "@/lib/prisma";
import { ContentManager, type FieldDef } from "@/components/admin/ContentManager";

export const dynamic = "force-dynamic";

const fields: FieldDef[] = [
  { name: "title", label: "Title", type: "text" },
  { name: "slug", label: "Slug", type: "text", hint: "lowercase-with-hyphens" },
  { name: "level", label: "Level", type: "text", placeholder: "Beginner / All Levels" },
  { name: "duration", label: "Duration", type: "text", placeholder: "2 days" },
  { name: "summary", label: "Summary", type: "textarea" },
  { name: "topics", label: "Topics", type: "list", hint: "One topic per line" },
  { name: "order", label: "Sort order", type: "number" },
  { name: "published", label: "Published", type: "boolean" },
];

export default async function AdminTrainingsPage() {
  const rows = await prisma.training.findMany({ orderBy: { order: "asc" } });
  const items = rows.map((r) => ({
    id: r.id,
    title: r.title,
    slug: r.slug,
    published: r.published,
    level: r.level,
    duration: r.duration,
    summary: r.summary,
    topics: r.topics,
    order: r.order,
  }));

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-brand-fg">Trainings</h1>
        <p className="mt-1 text-sm text-brand-fg/60">Manage workshops and courses.</p>
      </header>
      <ContentManager type="trainings" singular="training" fields={fields} items={items} />
    </div>
  );
}
