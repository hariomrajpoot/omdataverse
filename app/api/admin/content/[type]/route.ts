import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/current-user";
import {
  caseStudySchema,
  trainingSchema,
  projectSchema,
  serviceSchema,
  type TrainingInput,
} from "@/lib/validations/content";

// Coerce the training form payload into Prisma shape (date string -> Date,
// empty strings -> null, 0 numbers -> null).
function buildTraining(d: TrainingInput) {
  return {
    title: d.title,
    slug: d.slug,
    level: d.level,
    duration: d.duration,
    summary: d.summary,
    topics: d.topics,
    category: d.category || "workshop",
    imageUrl: d.imageUrl || null,
    rating: typeof d.rating === "number" && d.rating > 0 ? d.rating : null,
    capacity: typeof d.capacity === "number" && d.capacity > 0 ? d.capacity : null,
    eventDate: d.eventDate ? new Date(d.eventDate) : null,
    published: d.published,
    order: d.order,
  };
}

export const runtime = "nodejs";

const TYPES = ["case-studies", "trainings", "projects", "services"] as const;
type ContentType = (typeof TYPES)[number];

function isType(t: string): t is ContentType {
  return (TYPES as readonly string[]).includes(t);
}

async function requireAdmin() {
  const user = await getCurrentUser();
  return user && user.role === "ADMIN" ? user : null;
}

function validate(type: ContentType, data: unknown) {
  switch (type) {
    case "case-studies":
      return caseStudySchema.safeParse(data);
    case "trainings":
      return trainingSchema.safeParse(data);
    case "projects":
      return projectSchema.safeParse(data);
    case "services":
      return serviceSchema.safeParse(data);
  }
}

// Build the create payload for the given content type.
function createRow(type: ContentType, data: unknown) {
  switch (type) {
    case "case-studies": {
      const d = data as Prisma.CaseStudyCreateInput & { publishedAt?: string };
      return prisma.caseStudy.create({
        data: {
          ...d,
          outcomes: (data as { outcomes: Prisma.InputJsonValue }).outcomes,
          publishedAt: d.publishedAt ? new Date(d.publishedAt) : undefined,
        },
      });
    }
    case "trainings":
      return prisma.training.create({ data: buildTraining(data as TrainingInput) });
    case "services":
      return prisma.service.create({ data: data as Prisma.ServiceCreateInput });
    case "projects": {
      const d = data as Prisma.ProjectCreateInput & { industry?: string; problem?: string };
      return prisma.project.create({
        data: {
          ...d,
          outcomes: (data as { outcomes: Prisma.InputJsonValue }).outcomes,
          industry: d.industry || null,
          problem: d.problem || null,
        },
      });
    }
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ type: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const { type } = await params;
  if (!isType(type)) {
    return NextResponse.json({ ok: false, error: "Unknown type" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const parsed = validate(type, body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Validation failed.",
        issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
      },
      { status: 400 },
    );
  }

  try {
    const row = await createRow(type, parsed.data);
    return NextResponse.json({ ok: true, id: row.id }, { status: 201 });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json({ ok: false, error: "That slug is already in use." }, { status: 409 });
    }
    console.error("Content create error:", err);
    return NextResponse.json({ ok: false, error: "Failed to create." }, { status: 500 });
  }
}
