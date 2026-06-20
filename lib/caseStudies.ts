import "server-only";

// Case studies are now DB-backed and admin-managed (see lib/content.ts).
// Kept as a re-export so existing imports continue to work.
export { getCaseStudies, getCaseStudyBySlug } from "@/lib/content";
