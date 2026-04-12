import type { AppointmentStatus } from "@prisma/client";

const APPOINTMENT_TRANSITIONS: Record<AppointmentStatus, AppointmentStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PENDING", "COMPLETED", "CANCELLED"],
  CANCELLED: ["PENDING", "CONFIRMED"],
  COMPLETED: [],
};

export function getAllowedAppointmentTransitions(status: AppointmentStatus): AppointmentStatus[] {
  return APPOINTMENT_TRANSITIONS[status] ?? [];
}

export function canTransitionAppointmentStatus(from: AppointmentStatus, to: AppointmentStatus) {
  if (from === to) {
    return true;
  }

  return getAllowedAppointmentTransitions(from).includes(to);
}
