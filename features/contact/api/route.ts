import { NextResponse } from "next/server";
import { contactLeadSchema, sanitizeLead } from "@/features/contact/lib/validation";
import { getClientIp, rateLimit } from "@/features/contact/lib/rateLimit";
import { sendLead } from "@/features/shared/lib/email/sendLead";
import { saveContact } from "@/features/contact/lib/sanity/saveContact";

export const runtime = "nodejs";

function corsHeaders() {
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
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
    key: `contact:${ip}`,
    limit: 5,
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

  const parsed = contactLeadSchema.safeParse(payload);

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
    // Save to Sanity first for guaranteed persistence
    let contactId: string | null = null;
    try {
      const saved = await saveContact(lead);
      contactId = saved.id;
    } catch (sanityErr) {
      console.error("Failed to save contact to Sanity:", sanityErr);
      // Continue to send email even if Sanity save fails
    }

    // Send email
    const emailResult = await sendLead(lead);

    return NextResponse.json(
      {
        ok: true,
        message: "Thanks—message received. We'll get back to you shortly.",
        provider: emailResult.provider,
        contactId,
      },
      { status: 200, headers }
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Email delivery failed.";

    return NextResponse.json(
      { ok: false, error: message },
      { status: 500, headers }
    );
  }
}