export const siteConfig = {
  name: "OM Dataverse",
  description:
    "Modern data + AI consulting. Data foundations, analytics, automation, and platform engineering—delivered with enterprise discipline and startup speed.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  company: {
    email: "hello@example.com",
    location: "North America • Remote-first",
  },
  links: {
    bookAudit: "/contact?intent=audit",
  },
} as const;
