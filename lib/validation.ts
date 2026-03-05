import { z } from "zod";

const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

export const contactLeadSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().regex(emailRegex, "Invalid email address"),
  message: z.string().trim().min(20).max(2000),
  company: z.string().trim().max(120).optional().or(z.literal("")),
});

export type ContactLead = z.infer<typeof contactLeadSchema>;

export function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function sanitizeLead(lead: ContactLead): ContactLead {
  return {
    ...lead,
    name: escapeHtml(lead.name),
    email: escapeHtml(lead.email),
    message: escapeHtml(lead.message),
    company: lead.company ? escapeHtml(lead.company) : lead.company,
  };
}

