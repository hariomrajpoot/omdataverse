import "server-only";

import { mockCaseStudies, isSanityConfigured } from "@/lib/mockData";
import type { CaseStudy } from "@/lib/types";
import { sanityFetch } from "@/lib/sanity/fetch";
import { caseStudyBySlugQuery, caseStudiesQuery } from "@/lib/sanity/queries";

export async function getCaseStudies(): Promise<CaseStudy[]> {
  if (!isSanityConfigured()) return mockCaseStudies;

  try {
    const data = await sanityFetch<CaseStudy[]>({
      query: caseStudiesQuery,
      revalidate: 60,
    });
    return data?.length ? data : mockCaseStudies;
  } catch {
    return mockCaseStudies;
  }
}

export async function getCaseStudyBySlug(
  slug: string,
): Promise<CaseStudy | null> {
  if (!isSanityConfigured()) {
    return mockCaseStudies.find((c) => c.slug === slug) ?? null;
  }

  try {
    const cs = await sanityFetch<CaseStudy | null>({
      query: caseStudyBySlugQuery,
      params: { slug },
      revalidate: 60,
    });
    return cs ?? null;
  } catch {
    return mockCaseStudies.find((c) => c.slug === slug) ?? null;
  }
}

