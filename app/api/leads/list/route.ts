import { NextResponse } from "next/server";
import { listLeads } from "@/features/leads/lib/repository";
import { getCurrentUser } from "@/lib/auth/current-user";

export const runtime = "nodejs";

// Admin-only: powers the /admin/leads dashboard.
export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const leads = await listLeads();
    return NextResponse.json({ leads });
  } catch (error) {
    console.error("Failed to fetch leads:", error);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}
