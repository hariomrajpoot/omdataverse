export interface Service {
  _id?: string;
  title: string;
  slug: string;
  summary: string;
  // Free-form so services are fully admin-manageable. Known categories get a
  // matching icon in ServicesGrid; others fall back to a default icon.
  category: string;
  highlights?: string[];
}

export interface Outcome {
  label: string;
  value: string;
}

export interface CaseStudy {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  industry: string;
  problem: string;
  approach: string[];
  outcomes: Outcome[];
  technologies: string[];
  publishedAt: string; // ISO
}

export interface Training {
  id?: string;
  title: string;
  slug: string;
  level: string;
  duration: string;
  summary: string;
  topics: string[];
}

export interface Project {
  id?: string;
  title: string;
  slug: string;
  summary: string;
  industry?: string | null;
  problem?: string | null;
  approach: string[];
  outcomes: Outcome[];
  technologies: string[];
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
