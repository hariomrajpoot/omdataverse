import { NextResponse } from "next/server";
import { isValidStatus, updateLeadStatus } from "@/features/leads/lib/repository";
import { getCurrentUser } from "@/lib/auth/current-user";

export const runtime = "nodejs";

// Admin-only: update a lead's pipeline status.
export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, status } = body ?? {};

    if (!id || !status) {
      return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
    }
    if (!isValidStatus(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const lead = await updateLeadStatus(id, status);
    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error("Failed to update lead:", error);
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
  }
}
