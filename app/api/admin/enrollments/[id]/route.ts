import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/current-user";
import { enrollmentUpdateSchema } from "@/lib/validations/content";
import { createNotification } from "@/lib/notifications";

export const runtime = "nodejs";

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending review",
  approved: "Approved",
  enrolled: "Enrolled",
  completed: "Completed",
  cancelled: "Cancelled",
};

// Admin updates an enrollment's status / details → student is notified.
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "ADMIN") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = enrollmentUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Validation failed.",
        issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
      },
      { status: 400 },
    );
  }

  const d = parsed.data;
  try {
    const updated = await prisma.enrollment.update({
      where: { id },
      data: {
        status: d.status,
        schedule: d.schedule || null,
        meetingLink: d.meetingLink || null,
        materialsUrl: d.materialsUrl || null,
        certificateUrl: d.certificateUrl || null,
      },
      select: { userId: true, training: { select: { title: true } } },
    });

    try {
      await createNotification({
        userId: updated.userId,
        title: `Enrollment update: ${STATUS_LABEL[d.status] ?? d.status}`,
        body: updated.training.title,
        type: "enrollment",
        link: "/account/trainings",
      });
    } catch (e) {
      console.error("notify student failed:", e);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Enrollment update error:", err);
    return NextResponse.json({ ok: false, error: "Failed to update." }, { status: 500 });
  }
}
