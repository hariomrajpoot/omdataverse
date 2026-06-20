import "server-only";

import { prisma } from "@/lib/prisma";

// Enrollment queries for the student panel + admin dashboard.

export async function getUserEnrollment(userId: string, trainingId: string) {
  return prisma.enrollment.findUnique({
    where: { userId_trainingId: { userId, trainingId } },
    select: { id: true, status: true },
  });
}

export async function listUserEnrollments(userId: string) {
  return prisma.enrollment.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      training: { select: { title: true, slug: true, level: true, duration: true } },
    },
  });
}

export async function listAllEnrollments() {
  return prisma.enrollment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      training: { select: { title: true, slug: true } },
      user: {
        select: {
          email: true,
          profile: { select: { firstName: true, lastName: true } },
        },
      },
    },
  });
}
