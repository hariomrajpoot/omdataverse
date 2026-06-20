import { z } from "zod";

// Validation for admin CRUD of marketing content.

const slug = z
  .string()
  .trim()
  .min(1, "Slug is required")
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens");

const outcome = z.object({
  label: z.string().trim().min(1).max(80),
  value: z.string().trim().min(1).max(80),
});

export const caseStudySchema = z.object({
  title: z.string().trim().min(2).max(160),
  slug,
  excerpt: z.string().trim().min(2).max(400),
  industry: z.string().trim().min(1).max(80),
  problem: z.string().trim().min(2).max(2000),
  approach: z.array(z.string().trim().min(1).max(400)).max(12),
  outcomes: z.array(outcome).max(8),
  technologies: z.array(z.string().trim().min(1).max(60)).max(20),
  published: z.boolean().default(true),
  publishedAt: z.string().datetime().optional(),
});
export type CaseStudyInput = z.infer<typeof caseStudySchema>;

export const trainingSchema = z.object({
  title: z.string().trim().min(2).max(160),
  slug,
  level: z.string().trim().min(1).max(40),
  duration: z.string().trim().min(1).max(40),
  summary: z.string().trim().min(2).max(600),
  topics: z.array(z.string().trim().min(1).max(200)).max(20),
  published: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
});
export type TrainingInput = z.infer<typeof trainingSchema>;

export const serviceSchema = z.object({
  title: z.string().trim().min(2).max(160),
  slug,
  summary: z.string().trim().min(2).max(600),
  category: z.string().trim().min(1).max(80),
  highlights: z.array(z.string().trim().min(1).max(120)).max(12),
  published: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
});
export type ServiceInput = z.infer<typeof serviceSchema>;

export const enrollmentCreateSchema = z.object({
  trainingId: z.string().min(1, "Training is required"),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  experience: z.string().trim().max(60).optional().or(z.literal("")),
  goals: z.string().trim().max(1000).optional().or(z.literal("")),
});
export type EnrollmentCreateInput = z.infer<typeof enrollmentCreateSchema>;

export const enrollmentUpdateSchema = z.object({
  status: z.enum(["pending", "approved", "enrolled", "completed", "cancelled"]),
  schedule: z.string().trim().max(200).optional().or(z.literal("")),
  meetingLink: z.string().trim().url("Must be a URL").max(500).optional().or(z.literal("")),
  materialsUrl: z.string().trim().url("Must be a URL").max(500).optional().or(z.literal("")),
  certificateUrl: z.string().trim().url("Must be a URL").max(500).optional().or(z.literal("")),
});
export type EnrollmentUpdateInput = z.infer<typeof enrollmentUpdateSchema>;

export const projectSchema = z.object({
  title: z.string().trim().min(2).max(160),
  slug,
  summary: z.string().trim().min(2).max(600),
  industry: z.string().trim().max(80).optional().or(z.literal("")),
  problem: z.string().trim().max(2000).optional().or(z.literal("")),
  approach: z.array(z.string().trim().min(1).max(400)).max(12),
  outcomes: z.array(outcome).max(8),
  technologies: z.array(z.string().trim().min(1).max(60)).max(20),
  published: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
});
export type ProjectInput = z.infer<typeof projectSchema>;
