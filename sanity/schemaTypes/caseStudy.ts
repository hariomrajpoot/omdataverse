import { defineField, defineType } from "sanity";

export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case Study",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required().min(5).max(120),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().min(30).max(300),
    }),
    defineField({
      name: "industry",
      title: "Industry",
      type: "string",
      validation: (Rule) => Rule.required().min(2).max(60),
    }),
    defineField({
      name: "problem",
      title: "Problem",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required().min(30).max(1200),
    }),
    defineField({
      name: "approach",
      title: "Approach",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required().min(2).max(10),
    }),
    defineField({
      name: "outcomes",
      title: "Outcomes",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (Rule) => Rule.required().min(2).max(40),
            }),
            defineField({
              name: "value",
              title: "Value",
              type: "string",
              validation: (Rule) => Rule.required().min(1).max(80),
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(2).max(8),
    }),
    defineField({
      name: "technologies",
      title: "Technologies",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required().min(2).max(12),
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
    }),
  ],
});

