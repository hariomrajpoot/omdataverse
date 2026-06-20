import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/current-user";
import {
  caseStudySchema,
  trainingSchema,
  projectSchema,
  serviceSchema,
} from "@/lib/validations/content";

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

function updateRow(type: ContentType, id: string, data: unknown) {
  switch (type) {
    case "case-studies": {
      const d = data as Prisma.CaseStudyUpdateInput & { publishedAt?: string };
      return prisma.caseStudy.update({
        where: { id },
        data: {
          ...d,
          outcomes: (data as { outcomes: Prisma.InputJsonValue }).outcomes,
          publishedAt: d.publishedAt ? new Date(d.publishedAt as string) : undefined,
        },
      });
    }
    case "trainings":
      return prisma.training.update({ where: { id }, data: data as Prisma.TrainingUpdateInput });
    case "services":
      return prisma.service.update({ where: { id }, data: data as Prisma.ServiceUpdateInput });
    case "projects": {
      const d = data as Prisma.ProjectUpdateInput & { industry?: string; problem?: string };
      return prisma.project.update({
        where: { id },
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

function deleteRow(type: ContentType, id: string) {
  switch (type) {
    case "case-studies":
      return prisma.caseStudy.delete({ where: { id } });
    case "trainings":
      return prisma.training.delete({ where: { id } });
    case "services":
      return prisma.service.delete({ where: { id } });
    case "projects":
      return prisma.project.delete({ where: { id } });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ type: string; id: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const { type, id } = await params;
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
    await updateRow(type, id, parsed.data);
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json({ ok: false, error: "That slug is already in use." }, { status: 409 });
    }
    console.error("Content update error:", err);
    return NextResponse.json({ ok: false, error: "Failed to update." }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ type: string; id: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const { type, id } = await params;
  if (!isType(type)) {
    return NextResponse.json({ ok: false, error: "Unknown type" }, { status: 404 });
  }

  try {
    await deleteRow(type, id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Content delete error:", err);
    return NextResponse.json({ ok: false, error: "Failed to delete." }, { status: 500 });
  }
}
