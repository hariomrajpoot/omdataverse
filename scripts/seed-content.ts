import { createClient } from "@sanity/client";
import {
  mockCaseStudies,
  mockServices,
  mockSiteSettings,
  mockTeam,
} from "../lib/mockData";

function required(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

async function main() {
  const projectId = required("SANITY_PROJECT_ID");
  const dataset = required("SANITY_DATASET");
  const token = process.env.SANITY_WRITE_TOKEN;

  if (!token) {
    // eslint-disable-next-line no-console
    console.log(
      "SANITY_WRITE_TOKEN not set. Skipping Sanity seeding.\n" +
        "You can still run the website using local mock data.\n" +
        "To seed Sanity, create a token with write access and set SANITY_WRITE_TOKEN.",
    );
    process.exit(0);
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: process.env.SANITY_API_VERSION ?? "2024-01-01",
    token,
    useCdn: false,
  });

  // Seed site settings (singleton-ish)
  await client.createOrReplace({
    _id: "siteSettings.default",
    _type: "siteSettings",
    companyName: mockSiteSettings.companyName,
    tagline: mockSiteSettings.tagline,
    contactEmail: mockSiteSettings.contactEmail,
  });

  // Seed team
  for (const member of mockTeam) {
    await client.createOrReplace({
      _id: `teamMember.${member.name.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}`,
      _type: "teamMember",
      name: member.name,
      role: member.role,
      bio: member.bio,
    });
  }

  // Seed services
  for (const s of mockServices) {
    await client.createOrReplace({
      _id: `service.${s.slug}`,
      _type: "service",
      title: s.title,
      slug: { _type: "slug", current: s.slug },
      category: s.category,
      summary: s.summary,
      highlights: s.highlights ?? [],
    });
  }

  // Seed case studies
  for (const cs of mockCaseStudies) {
    await client.createOrReplace({
      _id: `caseStudy.${cs.slug}`,
      _type: "caseStudy",
      title: cs.title,
      slug: { _type: "slug", current: cs.slug },
      excerpt: cs.excerpt,
      industry: cs.industry,
      problem: cs.problem,
      approach: cs.approach,
      outcomes: cs.outcomes.map((o) => ({
        _type: "object",
        label: o.label,
        value: o.value,
      })),
      technologies: cs.technologies,
      publishedAt: cs.publishedAt,
    });
  }

  // eslint-disable-next-line no-console
  console.log("Seeded Sanity content successfully.");
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

