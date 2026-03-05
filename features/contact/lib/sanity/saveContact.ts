import "server-only";

import { createClient } from "next-sanity";
import { sanityEnv } from "@/features/shared/lib/sanity/env";
import type { ContactLead } from "@/features/contact/lib/validation";

export async function saveContact(lead: ContactLead) {
  const projectId = sanityEnv.projectId;
  const dataset = sanityEnv.dataset;
  const writeToken = process.env.SANITY_WRITE_TOKEN;

  if (!projectId || !dataset) {
    throw new Error("Sanity configuration incomplete: missing SANITY_PROJECT_ID or SANITY_DATASET");
  }

  if (!writeToken) {
    throw new Error("Sanity write token not configured: set SANITY_WRITE_TOKEN to enable contact storage");
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: sanityEnv.apiVersion,
    token: writeToken,
    useCdn: false,
  });

  const document = {
    _type: "contact",
    name: lead.name,
    email: lead.email,
    company: lead.company || null,
    message: lead.message,
    submittedAt: new Date().toISOString(),
    status: "new", // Can be: new, in-progress, resolved, spam
    notes: "",
  };

  const result = await client.create(document);

  return {
    id: result._id,
    createdAt: result._createdAt,
  };
}
