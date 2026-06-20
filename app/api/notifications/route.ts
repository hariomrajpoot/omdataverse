import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import {
  listNotifications,
  markAllRead,
  markRead,
  unreadCount,
} from "@/lib/notifications";

export const runtime = "nodejs";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const [notifications, unread] = await Promise.all([
    listNotifications(user.id),
    unreadCount(user.id),
  ]);
  return NextResponse.json({ ok: true, notifications, unread });
}

// Mark a single notification read ({ id }) or all read (no body).
export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  if (body && typeof body.id === "string") {
    await markRead(user.id, body.id);
  } else {
    await markAllRead(user.id);
  }
  return NextResponse.json({ ok: true, unread: await unreadCount(user.id) });
}
