"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireStaff } from "@/lib/auth";
import { doctorSchema, fieldErrors, serviceSchema, type FormState } from "@/lib/validation";
import { parseHours } from "@/lib/slots";
import { sendStatusUpdate } from "@/lib/notify";
import { slugify } from "@/lib/utils";

const refresh = () => revalidatePath("/[locale]", "layout");

const appointmentStatus = z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"]);
const inquiryStatus = z.enum(["NEW", "IN_PROGRESS", "RESOLVED"]);

const STATUS_LABEL_FR = { PENDING: "en attente", CONFIRMED: "confirmé", COMPLETED: "terminé", CANCELLED: "annulé" };

export async function updateAppointmentAction(formData: FormData) {
  await requireStaff();
  const id = String(formData.get("id"));
  const status = appointmentStatus.parse(formData.get("status"));
  const staffNotes = String(formData.get("staffNotes") ?? "").slice(0, 1000) || null;

  const before = await prisma.appointment.findUnique({ where: { id }, select: { status: true } });
  const appt = await prisma.appointment.update({ where: { id }, data: { status, staffNotes } });

  if (before && before.status !== status && (status === "CONFIRMED" || status === "CANCELLED")) {
    await sendStatusUpdate(appt.channel, appt.patientPhone, appt.reference, STATUS_LABEL_FR[status]);
  }
  refresh();
}

export async function updateInquiryAction(formData: FormData) {
  await requireStaff();
  await prisma.inquiry.update({
    where: { id: String(formData.get("id")) },
    data: { status: inquiryStatus.parse(formData.get("status")) },
  });
  refresh();
}

const localized = (fd: FormData, key: string) => ({
  fr: String(fd.get(`${key}.fr`) ?? ""),
  ar: String(fd.get(`${key}.ar`) ?? ""),
  en: String(fd.get(`${key}.en`) ?? ""),
});
const lines = (s: string) => s.split(/\r?\n/).map((x) => x.trim()).filter(Boolean);

export async function saveServiceAction(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const parsed = serviceSchema.safeParse({
    departmentId: formData.get("departmentId"),
    name: localized(formData, "name"),
    priceDzd: formData.get("priceDzd"),
    durationMin: formData.get("durationMin"),
    isActive: formData.get("isActive") === "on",
  });
  if (!parsed.success) return { fields: fieldErrors(parsed.error) };

  if (id) await prisma.service.update({ where: { id }, data: parsed.data });
  else await prisma.service.create({ data: parsed.data });
  refresh();
  redirect(`/${formData.get("locale") ?? "fr"}/admin/services`);
}

export async function deleteServiceAction(formData: FormData) {
  await requireAdmin();
  await prisma.service.delete({ where: { id: String(formData.get("id")) } });
  refresh();
}

export async function saveDoctorAction(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const parsed = doctorSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    departmentId: formData.get("departmentId"),
    title: localized(formData, "title"),
    bio: localized(formData, "bio"),
    qualifications: localized(formData, "qualifications"),
    languages: formData.getAll("languages"),
    hours: formData.get("hours"),
    consultationFee: formData.get("consultationFee"),
    slotMinutes: formData.get("slotMinutes"),
    acceptsTelehealth: formData.get("acceptsTelehealth") === "on",
    isActive: formData.get("isActive") === "on",
  });
  if (!parsed.success) return { fields: fieldErrors(parsed.error) };

  const { hours, qualifications, slug, ...rest } = parsed.data;
  const data = {
    ...rest,
    slug: slug ?? slugify(rest.name),
    consultationHours: parseHours(hours),
    qualifications: {
      fr: lines(qualifications.fr),
      ar: lines(qualifications.ar),
      en: lines(qualifications.en),
    },
  };

  try {
    if (id) await prisma.doctor.update({ where: { id }, data });
    else await prisma.doctor.create({ data });
  } catch (e) {
    if ((e as { code?: string }).code === "P2002") return { fields: { slug: "slug" } };
    throw e;
  }
  refresh();
  redirect(`/${formData.get("locale") ?? "fr"}/admin/doctors`);
}

/** Soft-delete: keeps appointment & prescription history intact. */
export async function toggleDoctorAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const doc = await prisma.doctor.findUniqueOrThrow({ where: { id }, select: { isActive: true } });
  await prisma.doctor.update({ where: { id }, data: { isActive: !doc.isActive } });
  refresh();
}
