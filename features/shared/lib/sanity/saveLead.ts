import "server-only";

import { createClient } from "next-sanity";
import { sanityEnv } from "@/features/shared/lib/sanity/env";
import type { Lead } from "@/features/shared/lib/validation";

export async function saveLead(lead: Lead) {
  const projectId = sanityEnv.projectId;
  const dataset = sanityEnv.dataset;
  const writeToken = process.env.SANITY_WRITE_TOKEN;

  if (!projectId || !dataset) {
    throw new Error("Sanity configuration incomplete: missing SANITY_PROJECT_ID or SANITY_DATASET");
  }

  if (!writeToken) {
    throw new Error("Sanity write token not configured: set SANITY_WRITE_TOKEN to enable lead storage");
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: sanityEnv.apiVersion,
    token: writeToken,
    useCdn: false,
  });

  const document = {
    _type: "lead",
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
    createdAt: new Date().toISOString(),
  };

  const result = await client.create(document);

  return {
    id: result._id,
    createdAt: result._createdAt,
  };
}