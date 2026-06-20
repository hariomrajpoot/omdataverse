import "server-only";

import { prisma } from "@/lib/prisma";
import type { CaseStudy, Outcome, Project, Service, Training } from "@/types";
import type {
  CaseStudy as DbCaseStudy,
  Project as DbProject,
  Service as DbService,
  Training as DbTraining,
} from "@prisma/client";

// Read layer for admin-managed marketing content. Public pages call these;
// they return only published rows. Outcomes are stored as JSON and normalized.

function toOutcomes(json: unknown): Outcome[] {
  if (!Array.isArray(json)) return [];
  const out: Outcome[] = [];
  for (const item of json) {
    if (item && typeof item === "object" && "label" in item && "value" in item) {
      const rec = item as Record<string, unknown>;
      out.push({ label: String(rec.label), value: String(rec.value) });
    }
  }
  return out;
}

function mapCaseStudy(row: DbCaseStudy): CaseStudy {
  return {
    _id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    industry: row.industry,
    problem: row.problem,
    approach: row.approach,
    outcomes: toOutcomes(row.outcomes),
    technologies: row.technologies,
    publishedAt: row.publishedAt.toISOString(),
  };
}

function mapTraining(
  row: DbTraining & { _count?: { enrollments: number } },
): Training {
  return {
    id: row.id,
    _id: row.id,
    title: row.title,
    slug: row.slug,
    level: row.level,
    duration: row.duration,
    summary: row.summary,
    topics: row.topics,
    category: row.category,
    imageUrl: row.imageUrl,
    rating: row.rating,
    eventDate: row.eventDate ? row.eventDate.toISOString() : null,
    capacity: row.capacity,
    registrationCount: row._count?.enrollments ?? 0,
  };
}

function mapProject(row: DbProject): Project {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    summary: row.summary,
    industry: row.industry,
    problem: row.problem,
    approach: row.approach,
    outcomes: toOutcomes(row.outcomes),
    technologies: row.technologies,
  };
}

export async function getCaseStudies(): Promise<CaseStudy[]> {
  const rows = await prisma.caseStudy.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });
  return rows.map(mapCaseStudy);
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  const row = await prisma.caseStudy.findUnique({ where: { slug } });
  if (!row || !row.published) return null;
  return mapCaseStudy(row);
}

export async function getTrainings(): Promise<Training[]> {
  const rows = await prisma.training.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    include: { _count: { select: { enrollments: true } } },
  });
  return rows.map(mapTraining);
}

export async function getTrainingBySlug(slug: string): Promise<Training | null> {
  const row = await prisma.training.findUnique({
    where: { slug },
    include: { _count: { select: { enrollments: true } } },
  });
  if (!row || !row.published) return null;
  return mapTraining(row);
}

export async function getProjects(): Promise<Project[]> {
  const rows = await prisma.project.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });
  return rows.map(mapProject);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const row = await prisma.project.findUnique({ where: { slug } });
  if (!row || !row.published) return null;
  return mapProject(row);
}

function mapService(row: DbService): Service {
  return {
    _id: row.id,
    title: row.title,
    slug: row.slug,
    summary: row.summary,
    category: row.category,
    highlights: row.highlights,
  };
}

export async function getServices(): Promise<Service[]> {
  const rows = await prisma.service.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });
  return rows.map(mapService);
}
