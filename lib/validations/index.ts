import { z } from 'zod';

const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_{|}~-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

export const contactLeadSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().regex(emailRegex, 'Invalid email address'),
  message: z.string().trim().min(20).max(2000),
  company: z.string().trim().max(120).optional().or(z.literal('')),
});

export type ContactLead = z.infer<typeof contactLeadSchema>;

export const leadSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().regex(emailRegex, 'Invalid email address'),
  phone: z.string().trim().optional(),
  company: z.string().trim().max(120).optional().or(z.literal('')),
  service: z.string().optional(),
  message: z.string().trim().min(10).max(2000).optional(),
  type: z.enum(['contact', 'demo', 'chatbot']),
  status: z.enum(['new', 'contacted', 'demo_scheduled', 'proposal_sent', 'converted', 'lost']).optional(),
  demoDate: z.string().optional(),
  demoTime: z.string().optional(),
  useCase: z.string().trim().max(1000).optional(),
});

export type Lead = z.infer<typeof leadSchema>;

export function escapeHtml(input: string) {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function sanitizeLead(lead: Lead): Lead {
  const sanitized = { ...lead };

  if (sanitized.name) sanitized.name = escapeHtml(sanitized.name);
  if (sanitized.email) sanitized.email = escapeHtml(sanitized.email);
  if (sanitized.phone) sanitized.phone = escapeHtml(sanitized.phone);
  if (sanitized.company) sanitized.company = escapeHtml(sanitized.company);
  if (sanitized.service) sanitized.service = escapeHtml(sanitized.service);
  if (sanitized.message) sanitized.message = escapeHtml(sanitized.message);
  if (sanitized.useCase) sanitized.useCase = escapeHtml(sanitized.useCase);

  return sanitized;
}
