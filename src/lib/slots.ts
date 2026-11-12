import "server-only";
import { prisma } from "./prisma";
import { CLINIC_UTC_OFFSET, clinicDateKey } from "./format";

export type ConsultationHours = { day: number; start: string; end: string }[];

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h! * 60 + m!;
};
const toHHMM = (mins: number) =>
  `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;

/** Converts a clinic-local date + time to a UTC Date. */
export const clinicDateTime = (date: string, time: string) =>
  new Date(`${date}T${time}:00${CLINIC_UTC_OFFSET}`);

/** Day of week (0 = Sunday) of a YYYY-MM-DD date in clinic time. */
const weekday = (date: string) => new Date(`${date}T12:00:00${CLINIC_UTC_OFFSET}`).getUTCDay();

export const MAX_BOOKING_DAYS_AHEAD = 60;

export function isBookableDate(date: string) {
  const today = clinicDateKey();
  const max = clinicDateKey(new Date(Date.now() + MAX_BOOKING_DAYS_AHEAD * 86_400_000));
  return date >= today && date <= max;
}

/** Free "HH:MM" slots for a doctor on a given clinic-local date. */
export async function getAvailableSlots(doctorId: string, date: string): Promise<string[]> {
  if (!isBookableDate(date)) return [];
  const doctor = await prisma.doctor.findFirst({
    where: { id: doctorId, isActive: true },
    select: { consultationHours: true, slotMinutes: true },
  });
  if (!doctor) return [];

  const hours = (doctor.consultationHours as ConsultationHours).filter((h) => h.day === weekday(date));
  const candidates: string[] = [];
  for (const block of hours) {
    for (let t = toMinutes(block.start); t + doctor.slotMinutes <= toMinutes(block.end); t += doctor.slotMinutes) {
      candidates.push(toHHMM(t));
    }
  }
  if (!candidates.length) return [];

  const dayStart = clinicDateTime(date, "00:00");
  const dayEnd = new Date(dayStart.getTime() + 86_400_000);
  const taken = await prisma.appointment.findMany({
    where: { doctorId, startsAt: { gte: dayStart, lt: dayEnd }, status: { not: "CANCELLED" } },
    select: { startsAt: true },
  });
  const takenSet = new Set(taken.map((a) => a.startsAt.getTime()));
  const minStart = Date.now() + 30 * 60_000; // at least 30 min notice

  return candidates.filter((time) => {
    const ts = clinicDateTime(date, time).getTime();
    return ts >= minStart && !takenSet.has(ts);
  });
}

/** Parses textarea lines like "0 08:00-12:00" into ConsultationHours. */
export function parseHours(text: string): ConsultationHours {
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [day, range] = l.split(/\s+/);
      const [start, end] = range!.split("-");
      return { day: Number(day), start: start!, end: end! };
    });
}

export const hoursToText = (hours: ConsultationHours) =>
  hours.map((h) => `${h.day} ${h.start}-${h.end}`).join("\n");
