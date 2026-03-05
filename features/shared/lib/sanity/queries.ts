export const caseStudiesQuery = /* groq */ `
*[_type == "caseStudy"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  industry,
  problem,
  approach,
  outcomes,
  technologies,
  "publishedAt": coalesce(publishedAt, _createdAt)
}`;

export const caseStudyBySlugQuery = /* groq */ `
*[_type == "caseStudy" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  industry,
  problem,
  approach,
  outcomes,
  technologies,
  "publishedAt": coalesce(publishedAt, _createdAt)
}`;

export const servicesQuery = /* groq */ `
*[_type == "service"] | order(category asc, title asc) {
  _id,
  title,
  "slug": slug.current,
  summary,
  category,
  highlights
}`;

export const teamMembersQuery = /* groq */ `
*[_type == "teamMember"] | order(name asc) {
  _id,
  name,
  role,
  bio,
  "avatarUrl": avatar.asset->url
}`;

