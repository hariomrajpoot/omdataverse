import "server-only";

import { prisma } from "@/lib/prisma";

// In-app notification helpers. Notifications are per-user; admin alerts fan out
// to every ADMIN account.

export interface NotificationInput {
  userId: string;
  title: string;
  body?: string | null;
  type?: string;
  link?: string | null;
}

export async function createNotification(input: NotificationInput) {
  return prisma.notification.create({
    data: {
      userId: input.userId,
      title: input.title,
      body: input.body ?? null,
      type: input.type ?? "info",
      link: input.link ?? null,
    },
  });
}

/** Fan a notification out to all admins (e.g. a new lead arrived). */
export async function notifyAdmins(input: Omit<NotificationInput, "userId">) {
  const admins = await prisma.user.findMany({
    where: { role: "ADMIN" },
    select: { id: true },
  });
  if (admins.length === 0) return;
  await prisma.notification.createMany({
    data: admins.map((a) => ({
      userId: a.id,
      title: input.title,
      body: input.body ?? null,
      type: input.type ?? "info",
      link: input.link ?? null,
    })),
  });
}

export async function listNotifications(userId: string, limit = 20) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function unreadCount(userId: string) {
  return prisma.notification.count({ where: { userId, read: false } });
}

export async function markRead(userId: string, id: string) {
  return prisma.notification.updateMany({ where: { id, userId }, data: { read: true } });
}

export async function markAllRead(userId: string) {
  return prisma.notification.updateMany({ where: { userId, read: false }, data: { read: true } });
}
