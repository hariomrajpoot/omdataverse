import { NextResponse } from "next/server";
import { leadSchema, sanitizeLead } from "@/features/shared/lib/validation";
import { getClientIp, rateLimit } from "@/features/contact/lib/rateLimit";
import { sendLead } from "@/features/shared/lib/email/sendLead";
import { saveLead } from "@/features/leads/lib/repository";
import { notifyAdmins } from "@/lib/notifications";

export const runtime = "nodejs";

function corsHeaders() {
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");
  return headers;
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

export async function POST(req: Request) {
  const headers = corsHeaders();

  const ip = getClientIp(req.headers);
  const rl = rateLimit({
    key: `lead:${ip}`,
    limit: 10,
    windowMs: 10 * 60 * 1000,
  });

  if (!rl.ok) {
    headers.set(
      "retry-after",
      Math.ceil((rl.resetAt - Date.now()) / 1000).toString()
    );

    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again later." },
      { status: 429, headers }
    );
  }

  let payload: unknown;

  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400, headers }
    );
  }

  const parsed = leadSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Validation failed.",
        issues: parsed.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
      { status: 400, headers }
    );
  }

  const lead = sanitizeLead(parsed.data);

  try {
    // Persist to our database first for guaranteed storage.
    let leadId: string | null = null;
    try {
      const saved = await saveLead(lead);
      leadId = saved.id;
    } catch (dbErr) {
      console.error("Failed to save lead to database:", dbErr);
      // Continue to send email even if persistence fails.
    }

    // In-app notification to admins.
    try {
      await notifyAdmins({
        title: `New ${lead.type === "demo" ? "demo request" : "lead"}: ${lead.name}`,
        body: `${lead.email}${lead.company ? ` · ${lead.company}` : ""}`,
        type: "lead",
        link: "/admin/leads",
      });
    } catch (notifyErr) {
      console.error("Failed to notify admins:", notifyErr);
    }

    // Send email
    const emailResult = await sendLead(lead);

    const message = lead.type === "demo"
      ? "Thanks for your demo request! We'll be in touch soon to schedule your session."
      : "Thanks—message received. We'll get back to you shortly.";

    return NextResponse.json(
      {
        ok: true,
        message,
        provider: emailResult.provider,
        leadId,
      },
      { status: 200, headers }
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Email delivery failed.";
    console.error("Lead submission error:", err);
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500, headers }
    );
  }
}