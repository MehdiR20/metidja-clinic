"use server";

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { bookingSchema, echo, fieldErrors, type FormState } from "@/lib/validation";
import { clinicDateTime, getAvailableSlots } from "@/lib/slots";
import { sendBookingConfirmation } from "@/lib/notify";
import { bookingReference } from "@/lib/utils";
import { formatDateTime } from "@/lib/format";

export async function createAppointmentAction(_: FormState, formData: FormData): Promise<FormState> {
  const locale = String(formData.get("locale") ?? "fr");
  const parsed = bookingSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fields: fieldErrors(parsed.error), data: echo(formData) };
  const d = parsed.data;

  const doctor = await prisma.doctor.findFirst({
    where: { id: d.doctorId, departmentId: d.departmentId, isActive: true },
    select: { id: true, name: true, acceptsTelehealth: true },
  });
  if (!doctor) return { error: "generic" };
  if (d.type === "TELEHEALTH" && !doctor.acceptsTelehealth) return { error: "generic" };

  if (d.serviceId) {
    const ok = await prisma.service.count({ where: { id: d.serviceId, departmentId: d.departmentId, isActive: true } });
    if (!ok) return { error: "generic" };
  }

  // Re-check availability server-side — the client list may be stale
  const free = await getAvailableSlots(doctor.id, d.date);
  if (!free.includes(d.time)) return { error: "slotUnavailable" };

  const session = await getSession();
  const startsAt = clinicDateTime(d.date, d.time);

  try {
    const appt = await prisma.appointment.create({
      data: {
        reference: bookingReference(),
        startsAt,
        type: d.type,
        channel: d.channel,
        patientName: d.patientName,
        patientPhone: d.patientPhone,
        patientEmail: d.patientEmail,
        reason: d.reason || null,
        doctorId: doctor.id,
        departmentId: d.departmentId,
        serviceId: d.serviceId ?? null,
        userId: session?.role === "PATIENT" ? session.sub : null,
      },
    });

    await sendBookingConfirmation(d.channel, d.patientPhone, locale, {
      reference: appt.reference,
      when: formatDateTime(startsAt, locale),
      doctor: doctor.name,
      telehealth: d.type === "TELEHEALTH",
    });

    return {
      ok: true,
      data: {
        reference: appt.reference,
        startsAt: startsAt.toISOString(),
        doctor: doctor.name,
        channel: d.channel,
        phone: d.patientPhone,
      },
    };
  } catch (e) {
    // Unique (doctorId, startsAt) — someone booked the same slot concurrently
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") return { error: "slotTaken" };
    console.error(e);
    return { error: "generic" };
  }
}
