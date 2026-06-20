import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { getCaseStudies } from "@/lib/content";

// Generated at request time since case studies / projects / trainings are
// DB-backed and admin-editable.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteConfig.url}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteConfig.url}/work`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteConfig.url}/trainings`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteConfig.url}/accelerator`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteConfig.url}/case-studies`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteConfig.url}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${siteConfig.url}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
  ];

  try {
    // Only case studies have their own detail routes.
    const caseStudies = await getCaseStudies();
    const caseRoutes: MetadataRoute.Sitemap = caseStudies.map((cs) => ({
      url: `${siteConfig.url}/case-studies/${cs.slug}`,
      lastModified: cs.publishedAt ? new Date(cs.publishedAt) : now,
      changeFrequency: "yearly",
      priority: 0.6,
    }));
    return [...staticRoutes, ...caseRoutes];
  } catch {
    // If the database is unreachable (e.g. at build time), still emit the
    // static routes rather than failing the whole sitemap.
    return staticRoutes;
  }
}
