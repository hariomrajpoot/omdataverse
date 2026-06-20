import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/current-user";
import { userRoleUpdateSchema } from "@/lib/validations/content";

export const runtime = "nodejs";

// Sentinel used to turn the last-admin guard (thrown inside the transaction)
// into a clean 409 response.
const LAST_ADMIN = "LAST_ADMIN";

// Admin-only: change a user's role (ADMIN <-> CLIENT).
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
  const parsed = userRoleUpdateSchema.safeParse(body);
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

  const { role } = parsed.data;

  // Don't let an admin strip their own access (they'd lock themselves out).
  if (id === admin.id && role !== "ADMIN") {
    return NextResponse.json(
      { ok: false, error: "You can't remove your own admin access." },
      { status: 400 },
    );
  }

  try {
    await prisma.$transaction(async (tx) => {
      const target = await tx.user.findUnique({ where: { id }, select: { role: true } });
      if (!target) throw new Error("NOT_FOUND");
      if (target.role === role) return; // no-op

      // Never demote the last remaining admin.
      if (target.role === "ADMIN" && role === "CLIENT") {
        const adminCount = await tx.user.count({ where: { role: "ADMIN" } });
        if (adminCount <= 1) throw new Error(LAST_ADMIN);
      }

      await tx.user.update({ where: { id }, data: { role } });

      // On demotion, revoke the user's sessions so the lost admin access takes
      // effect immediately (their next refresh fails -> forced re-login).
      if (role === "CLIENT") {
        await tx.session.updateMany({
          where: { userId: id, revokedAt: null },
          data: { revokedAt: new Date() },
        });
      }
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (msg === "NOT_FOUND") {
      return NextResponse.json({ ok: false, error: "User not found." }, { status: 404 });
    }
    if (msg === LAST_ADMIN) {
      return NextResponse.json(
        { ok: false, error: "Can't demote the last admin." },
        { status: 409 },
      );
    }
    console.error("Role update error:", err);
    return NextResponse.json({ ok: false, error: "Failed to update role." }, { status: 500 });
  }
}
