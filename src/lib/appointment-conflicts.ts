import type { AppointmentStatus, Prisma, PrismaClient } from "@prisma/client";
import { getUtcRangeForTurkeyDate } from "./date.ts";

type AppointmentConflictDb = PrismaClient | Prisma.TransactionClient;

export function timesOverlap(startA: string, endA: string, startB: string, endB: string) {
  return startA < endB && endA > startB;
}

export function isStatusBlockingSlot(status: AppointmentStatus) {
  return status === "PENDING" || status === "CONFIRMED";
}

export async function hasConflictingActiveAppointment(
  db: AppointmentConflictDb,
  options: {
    specialistId: string;
    date: string;
    startTime: string;
    endTime: string;
    excludeAppointmentId?: string;
  }
) {
  const { specialistId, date, startTime, endTime, excludeAppointmentId } = options;
  const { startUtc, endUtc } = getUtcRangeForTurkeyDate(date);

  const conflict = await db.appointment.findFirst({
    where: {
      specialistId,
      date: {
        gte: startUtc,
        lte: endUtc,
      },
      status: {
        in: ["PENDING", "CONFIRMED"],
      },
      ...(excludeAppointmentId
        ? {
            id: {
              not: excludeAppointmentId,
            },
          }
        : {}),
      startTime: {
        lt: endTime,
      },
      endTime: {
        gt: startTime,
      },
    },
    select: {
      id: true,
    },
  });

  return Boolean(conflict);
}
