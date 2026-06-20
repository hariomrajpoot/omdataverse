import "server-only";

import { prisma } from "@/lib/prisma";
import type { Lead } from "@/features/shared/lib/validation";

// Prisma-backed lead persistence (replaces the previous Sanity client).

const VALID_STATUSES = [
  "new",
  "contacted",
  "demo_scheduled",
  "proposal_sent",
  "converted",
  "lost",
] as const;
export type LeadStatusValue = (typeof VALID_STATUSES)[number];

export function isValidStatus(value: string): value is LeadStatusValue {
  return (VALID_STATUSES as readonly string[]).includes(value);
}

export async function saveLead(lead: Lead) {
  const created = await prisma.lead.create({
    data: {
      name: lead.name,
      email: lead.email,
      phone: lead.phone || null,
      company: lead.company || null,
      service: lead.service || null,
      message: lead.message || null,
      type: lead.type,
      status: "new",
      demoDate: lead.demoDate || null,
      demoTime: lead.demoTime || null,
      useCase: lead.useCase || null,
    },
    select: { id: true, createdAt: true },
  });

  return { id: created.id, createdAt: created.createdAt.toISOString() };
}

export async function listLeads() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Map to the shape the admin dashboard expects (`_id`, ISO `createdAt`).
  return leads.map((l) => ({
    _id: l.id,
    name: l.name,
    email: l.email,
    phone: l.phone,
    company: l.company,
    service: l.service,
    message: l.message,
    type: l.type,
    status: l.status,
    demoDate: l.demoDate,
    demoTime: l.demoTime,
    useCase: l.useCase,
    createdAt: l.createdAt.toISOString(),
  }));
}

export async function updateLeadStatus(id: string, status: LeadStatusValue) {
  return prisma.lead.update({
    where: { id },
    data: { status },
    select: { id: true, status: true },
  });
}

export interface ContactInput {
  name: string;
  email: string;
  company?: string | null;
  message: string;
}

export async function saveContact(contact: ContactInput) {
  const created = await prisma.contact.create({
    data: {
      name: contact.name,
      email: contact.email,
      company: contact.company || null,
      message: contact.message,
      status: "new",
    },
    select: { id: true, createdAt: true },
  });
  return { id: created.id, createdAt: created.createdAt.toISOString() };
}
