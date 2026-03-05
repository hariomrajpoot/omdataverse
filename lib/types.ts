export interface Service {
  _id?: string;
  title: string;
  slug: string;
  summary: string;
  category:
    | "Data Foundations"
    | "AI & Automation"
    | "Advanced Analytics"
    | "Infrastructure & DevOps";
  highlights?: string[];
}

export interface CaseStudy {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  industry: string;
  problem: string;
  approach: string[];
  outcomes: { label: string; value: string }[];
  technologies: string[];
  publishedAt: string; // ISO
}

export interface TeamMember {
  _id?: string;
  name: string;
  role: string;
  bio: string;
  avatarUrl?: string;
}

export interface SiteSettings {
  _id?: string;
  companyName: string;
  tagline: string;
  contactEmail: string;
}

