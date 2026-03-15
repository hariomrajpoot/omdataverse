import { z } from "zod";

const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

export const leadSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().regex(emailRegex, "Invalid email address"),
  phone: z.string().trim().optional(),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  service: z.string().optional(),
  message: z.string().trim().min(10).max(2000).optional(),
  type: z.enum(["contact", "demo", "chatbot"]),
  status: z.enum(["new", "contacted", "demo_scheduled", "proposal_sent", "converted", "lost"]).optional(),
  demoDate: z.string().optional(),
  demoTime: z.string().optional(),
  useCase: z.string().trim().max(1000).optional(),
});

export type Lead = z.infer<typeof leadSchema>;

export function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function sanitizeLead(lead: Lead): Lead {
  return {
    ...lead,
    name: escapeHtml(lead.name),
    email: escapeHtml(lead.email),
    phone: lead.phone ? escapeHtml(lead.phone) : lead.phone,
    company: lead.company ? escapeHtml(lead.company) : lead.company,
    message: lead.message ? escapeHtml(lead.message) : lead.message,
    useCase: lead.useCase ? escapeHtml(lead.useCase) : lead.useCase,
  };
}