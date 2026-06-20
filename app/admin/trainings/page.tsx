import { prisma } from "@/lib/prisma";
import { ContentManager, type FieldDef } from "@/components/admin/ContentManager";

export const dynamic = "force-dynamic";

const fields: FieldDef[] = [
  { name: "title", label: "Title", type: "text" },
  { name: "slug", label: "Slug", type: "text", hint: "lowercase-with-hyphens" },
  { name: "category", label: "Category", type: "text", placeholder: "workshop / bootcamp / masterclass" },
  { name: "level", label: "Level", type: "text", placeholder: "Beginner / All Levels" },
  { name: "duration", label: "Duration", type: "text", placeholder: "2 days" },
  { name: "summary", label: "Summary", type: "textarea" },
  { name: "topics", label: "Topics / Agenda", type: "list", hint: "One per line" },
  { name: "imageUrl", label: "Cover image", type: "image", hint: "Optional; leave blank for a gradient cover" },
  { name: "rating", label: "Rating (0–5)", type: "number" },
  { name: "eventDate", label: "Event date", type: "text", hint: "ISO, e.g. 2026-08-15T09:00:00Z (blank = no countdown)" },
  { name: "capacity", label: "Seat capacity", type: "number", hint: "0 = no seat counter" },
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
    category: r.category,
    level: r.level,
    duration: r.duration,
    summary: r.summary,
    topics: r.topics,
    imageUrl: r.imageUrl ?? "",
    rating: r.rating ?? 0,
    eventDate: r.eventDate ? r.eventDate.toISOString() : "",
    capacity: r.capacity ?? 0,
    order: r.order,
  }));

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-brand-fg">Trainings</h1>
        <p className="mt-1 text-sm text-brand-fg/60">Manage workshops, events, and courses.</p>
      </header>
      <ContentManager type="trainings" singular="training" fields={fields} items={items} />
    </div>
  );
}
