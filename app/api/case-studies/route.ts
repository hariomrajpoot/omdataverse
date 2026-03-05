import { NextResponse } from "next/server";
import { getCaseStudies } from "@/lib/caseStudies";

export const runtime = "nodejs";

export async function GET() {
  const data = await getCaseStudies();
  return NextResponse.json({ ok: true, caseStudies: data }, { status: 200 });
}

