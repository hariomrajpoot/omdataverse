import { defineField, defineType } from "sanity";

export const lead = defineType({
  name: "lead",
  title: "Lead",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required().min(2).max(80),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
    }),
    defineField({
      name: "company",
      title: "Company",
      type: "string",
    }),
    defineField({
      name: "service",
      title: "Service Interested",
      type: "string",
      options: {
        list: [
          { title: "Data Platform", value: "data-platform" },
          { title: "AI Analytics", value: "ai-analytics" },
          { title: "Machine Learning", value: "machine-learning" },
          { title: "Custom AI Solutions", value: "custom-ai" },
          { title: "Consulting", value: "consulting" },
          { title: "Other", value: "other" },
        ],
      },
    }),
    defineField({
      name: "message",
      title: "Message",
      type: "text",
      rows: 5,
    }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Contact", value: "contact" },
          { title: "Demo", value: "demo" },
          { title: "Chatbot", value: "chatbot" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Contacted", value: "contacted" },
          { title: "Demo Scheduled", value: "demo_scheduled" },
          { title: "Proposal Sent", value: "proposal_sent" },
          { title: "Converted", value: "converted" },
          { title: "Lost", value: "lost" },
        ],
      },
      initialValue: "new",
    }),
    defineField({
      name: "demoDate",
      title: "Demo Date",
      type: "date",
    }),
    defineField({
      name: "demoTime",
      title: "Demo Time",
      type: "string",
    }),
    defineField({
      name: "useCase",
      title: "Use Case / Project Details",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "email",
      status: "status",
      type: "type",
    },
    prepare({ title, subtitle, status, type }) {
      return {
        title,
        subtitle: `${type} - ${status} | ${subtitle}`,
      };
    },
  },
});