import { createClient } from "next-sanity";
import { sanityConfigured, sanityEnv } from "@/lib/sanity/env";

export const sanityClient = sanityConfigured()
  ? createClient({
      projectId: sanityEnv.projectId,
      dataset: sanityEnv.dataset,
      apiVersion: sanityEnv.apiVersion,
      useCdn: true,
      perspective: "published",
      stega: { enabled: false },
    })
  : null;

export function getSanityClient(options: { preview: boolean }) {
  if (!sanityConfigured()) {
    throw new Error(
      "Sanity is not configured. Set SANITY_PROJECT_ID and SANITY_DATASET to enable CMS fetching."
    );
  }

  if (!options.preview) return sanityClient!;

  return createClient({
    projectId: sanityEnv.projectId,
    dataset: sanityEnv.dataset,
    apiVersion: sanityEnv.apiVersion,
    useCdn: false,
    perspective: "previewDrafts",
    token: sanityEnv.readToken || undefined,
    stega: { enabled: false },
  });
}

