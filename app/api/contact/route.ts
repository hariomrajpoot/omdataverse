import { NextResponse } from "next/server";
import { contactLeadSchema, sanitizeLead } from "@/lib/validation";
import { getClientIp, rateLimit } from "@/lib/rateLimit";
import { sendLead } from "@/lib/email/sendLead";

export const runtime = "nodejs";

function corsHeaders() {
  // Default: same-origin. If you need cross-origin, set CONTACT_CORS_ORIGIN.
  const origin = process.env.CONTACT_CORS_ORIGIN;
  return origin
    ? {
        "access-control-allow-origin": origin,
        "access-control-allow-methods": "POST, OPTIONS",
        "access-control-allow-headers": "content-type",
      }
    : {};
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

export async function POST(req: Request) {
  const headers = corsHeaders();

  const ip = getClientIp(req.headers);
  const rl = rateLimit({ key: `contact:${ip}`, limit: 5, windowMs: 10 * 60 * 1000 });
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          ...headers,
          "retry-after": Math.ceil((rl.resetAt - Date.now()) / 1000).toString(),
        },
      },
    );
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400, headers },
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
      { status: 400, headers },
    );
  }

  const lead = sanitizeLead(parsed.data);

  try {
    const result = await sendLead(lead);
    return NextResponse.json(
      {
        ok: true,
        message: "Thanks—message received. We’ll get back to you shortly.",
        provider: result.provider,
      },
      { status: 200, headers },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Email delivery failed.";
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500, headers },
    );
  }
}

