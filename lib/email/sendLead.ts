import "server-only";

import os from "node:os";
import path from "node:path";
import { writeFile } from "node:fs/promises";
import nodemailer from "nodemailer";
import type { ContactLead } from "@/lib/validation";

export type EmailProvider = "resend" | "smtp" | "tmp";

export interface SendLeadResult {
  provider: EmailProvider;
  messageId?: string;
  savedTo?: string;
}

function renderText(lead: ContactLead) {
  return [
    "New contact form submission",
    "",
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Company: ${lead.company || "-"}`,
    "",
    "Message:",
    lead.message,
  ].join("\n");
}

export async function sendLead(lead: ContactLead): Promise<SendLeadResult> {
  const to = process.env.CONTACT_TO || process.env.CONTACT_EMAIL || "hello@example.com";
  const subject = `New contact: ${lead.name}`;
  const text = renderText(lead);

  if (process.env.RESEND_API_KEY) {
    const from = process.env.RESEND_FROM || "onboarding@resend.dev";

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        text,
        reply_to: lead.email,
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`Resend failed (${res.status}): ${body}`);
    }

    const data = (await res.json().catch(() => null)) as { id?: string } | null;
    return { provider: "resend", messageId: data?.id };
  }

  if (process.env.SMTP_URL) {
    const transport = nodemailer.createTransport(process.env.SMTP_URL);
    const from = process.env.SMTP_FROM || "omdataverse@localhost";
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

