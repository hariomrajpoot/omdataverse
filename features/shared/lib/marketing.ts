// Marketing content for the homepage social-proof + FAQ sections.
// Co-located so copy is easy to edit without touching component code.

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  rating: number; // 1–5
  /** Tailwind gradient classes for the initials avatar. */
  gradient: string;
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "They stood up a Microsoft Fabric lakehouse in five weeks that our last vendor quoted six months for. Reporting that took days now runs in minutes.",
    name: "Alex Kerr",
    role: "VP, Data Platform",
    company: "Northwind Health",
    rating: 5,
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    quote:
      "The Copilot agents they shipped are genuinely deterministic and safe — our analysts trust the output. Adoption hit 80% in the first month.",
    name: "Maria Reyes",
    role: "Director of Analytics",
    company: "Helix SaaS",
    rating: 5,
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    quote:
      "Cloud spend dropped 22% while reliability went up. The observability and cost guardrails paid for the engagement on their own.",
    name: "James Doyle",
    role: "Head of Engineering",
    company: "Meridian FinTech",
    rating: 5,
    gradient: "from-fuchsia-500 to-pink-600",
  },
  {
    quote:
      "Clear communication, enterprise-grade security, and they actually hit the timeline. Rare combination. We've already signed the next phase.",
    name: "Sophie Lund",
    role: "CTO",
    company: "Atlas Logistics",
    rating: 5,
    gradient: "from-amber-500 to-orange-600",
  },
  {
    quote:
      "Our medallion architecture finally has lineage and quality checks we can defend in a compliance review. Audit prep went from weeks to a day.",
    name: "Priya Nair",
    role: "Data Governance Lead",
    company: "Cedar Biolabs",
    rating: 5,
    gradient: "from-violet-500 to-purple-600",
  },
  {
    quote:
      "From scoping to production in under two months. The team operates like a senior in-house unit, not an external agency.",
    name: "Tom Becker",
    role: "Chief Data Officer",
    company: "Orbit Retail",
    rating: 5,
    gradient: "from-cyan-500 to-blue-600",
  },
];

export function testimonialInitials(t: Testimonial): string {
  return initials(t.name);
}

export interface Faq {
  question: string;
  answer: string;
}

export const faqs: Faq[] = [
  {
    question: "How fast can you deliver a production data platform?",
    answer:
      "Most foundational platforms go live in 2–6 weeks using our Fabric blueprints, accelerator patterns, and CI/CD automation. We scope a concrete delivery plan in the first strategy session so timelines are clear up front.",
  },
  {
    question: "Do you work with our existing Microsoft / Azure stack?",
    answer:
      "Yes — we specialize in the Microsoft data estate: Fabric, OneLake, Azure Data Factory, Databricks, Power BI, and Azure OpenAI. We meet your environment where it is and modernize incrementally, with no rip-and-replace required.",
  },
  {
    question: "How do you handle security, governance, and compliance?",
    answer:
      "Security-by-design is built into every engagement: role-based access control, audit trails, data lineage, and compliance controls wired into each environment. We've delivered into regulated healthcare, fintech, and bioinformatics settings.",
  },
  {
    question: "What does an engagement actually look like?",
    answer:
      "We start with a 45-minute strategy audit to map risks, quick wins, and a delivery plan. From there we work in tight, measurable milestones — you get production increments early and often, not a big-bang reveal at the end.",
  },
  {
    question: "How is pricing structured?",
    answer:
      "Engagements are scoped to outcomes and milestones rather than open-ended hours. After the initial audit you receive a fixed delivery plan with clear deliverables, so there are no surprises on cost or timeline.",
  },
];
