import { defineField, defineType } from "sanity";

export const contact = defineType({
  name: "contact",
  title: "Contact Submission",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required().min(2).max(80),
      readOnly: true,
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
      readOnly: true,
    }),
    defineField({
      name: "company",
      title: "Company",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "message",
      title: "Message",
      type: "text",
      rows: 5,
      validation: (Rule) => Rule.required().min(20).max(2000),
      readOnly: true,
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted At",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "In Progress", value: "in-progress" },
          { title: "Resolved", value: "resolved" },
          { title: "Spam", value: "spam" },
        ],
      },
      validation: (Rule) => Rule.required(),
      initialValue: "new",
    }),
    defineField({
      name: "notes",
      title: "Internal Notes",
      type: "text",
      rows: 4,
    }),
  ],
  orderings: [
    {
      title: "Newest First",
      name: "newestFirst",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "email",
      media: "status",
    },
    prepare(selection) {
      const { title, subtitle } = selection;
      return {
        title: title || "Untitled",
        subtitle: subtitle || "No email",
      };
    },
  },
});
