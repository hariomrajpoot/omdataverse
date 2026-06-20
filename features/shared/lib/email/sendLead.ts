import "server-only";

import os from "node:os";
import path from "node:path";
import { writeFile } from "node:fs/promises";
import nodemailer from "nodemailer";
import { Resend } from "resend";
import type { Lead } from "@/features/shared/lib/validation";

export type EmailProvider = "resend" | "smtp" | "tmp";

export interface SendLeadResult {
  provider: EmailProvider;
  messageId?: string;
  savedTo?: string;
}

function renderText(lead: Lead) {
  const typeLabel = lead.type === "demo" ? "Demo Request" : lead.type === "contact" ? "Contact Form" : "Chatbot Lead";
  const lines = [
    `New ${typeLabel}`,
    "",
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone || "-"}`,
    `Company: ${lead.company || "-"}`,
  ];

  if (lead.service) {
    lines.push(`Service: ${lead.service}`);
  }

  if (lead.type === "demo") {
    lines.push(`Demo Date: ${lead.demoDate || "-"}`);
    lines.push(`Demo Time: ${lead.demoTime || "-"}`);
    if (lead.useCase) {
      lines.push("");
      lines.push("Use Case / Project Details:");
      lines.push(lead.useCase);
    }
  }

  if (lead.message) {
    lines.push("");
    lines.push("Message:");
    lines.push(lead.message);
  }

  return lines.join("\n");
}

export async function sendLead(lead: Lead): Promise<SendLeadResult> {
  const to =
    process.env.CONTACT_TO ||
    process.env.CONTACT_EMAIL ||
    process.env.LEAD_NOTIFY_TO ||
    "hello@example.com";
  const typeLabel = lead.type === "demo" ? "demo request" : lead.type === "contact" ? "contact" : "lead";
  const subject = `New ${typeLabel}: ${lead.name}`;
  const text = renderText(lead);

  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const from = process.env.RESEND_FROM || "onboarding@resend.dev";

    try {
      const data = await resend.emails.send({
        from,
        to: [to],
        subject,
        text,
        replyTo: lead.email,
      });
      return { provider: "resend", messageId: data.data?.id };
    } catch (error) {
      throw new Error(`Resend failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  if (process.env.SMTP_URL) {
    const transport = nodemailer.createTransport(process.env.SMTP_URL);
    const from = process.env.SMTP_FROM || "omansai@localhost";
    const info = await transport.sendMail({
      from,
      to,
      subject,
      text,
      replyTo: lead.email,
    });
    return { provider: "smtp", messageId: info.messageId };
  }

  const tmp = process.env.TMPDIR || os.tmpdir();
  const savedTo = path.join(tmp, "last-lead.json");
  await writeFile(savedTo, JSON.stringify({ receivedAt: new Date().toISOString(), lead }, null, 2), "utf8");
  return { provider: "tmp", savedTo };
}

