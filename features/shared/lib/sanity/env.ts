export const sanityEnv = {
  projectId: process.env.SANITY_PROJECT_ID ?? "",
  dataset: process.env.SANITY_DATASET ?? "",
  apiVersion: process.env.SANITY_API_VERSION ?? "2024-01-01",
  readToken: process.env.SANITY_READ_TOKEN ?? "",
} as const;

export function sanityConfigured() {
  return Boolean(sanityEnv.projectId && sanityEnv.dataset);
}

