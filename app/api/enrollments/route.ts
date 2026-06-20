import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/current-user";
import { enrollmentCreateSchema } from "@/lib/validations/content";
import { notifyAdmins } from "@/lib/notifications";

export const runtime = "nodejs";

// A signed-in user (student) enrolls in a training.
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Please sign in to enroll." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = enrollmentCreateSchema.safeParse(body);
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

  const training = await prisma.training.findUnique({
    where: { id: parsed.data.trainingId },
    select: { id: true, title: true },
  });
  if (!training) {
    return NextResponse.json({ ok: false, error: "Training not found." }, { status: 404 });
  }

  try {
    await prisma.enrollment.create({
      data: {
        userId: user.id,
        trainingId: training.id,
        phone: parsed.data.phone || null,
        experience: parsed.data.experience || null,
        goals: parsed.data.goals || null,
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json(
        { ok: false, error: "You're already enrolled in this training." },
        { status: 409 },
      );
    }
    console.error("Enrollment create error:", err);
    return NextResponse.json({ ok: false, error: "Could not enroll." }, { status: 500 });
  }

  const who =
    [user.profile?.firstName, user.profile?.lastName].filter(Boolean).join(" ") || user.email;
  try {
    await notifyAdmins({
      title: `New enrollment: ${training.title}`,
      body: `${who} requested to enroll`,
      type: "enrollment",
      link: "/admin/enrollments",
    });
  } catch (e) {
    console.error("notifyAdmins (enrollment) failed:", e);
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
