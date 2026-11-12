import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { tr, type LocalizedList } from "@/lib/format";
import { hoursToText, type ConsultationHours } from "@/lib/slots";
import { AdminTitle } from "@/components/admin/ui";
import { DoctorForm, type DoctorFormValue } from "@/components/admin/forms";

type L = DoctorFormValue["title"];

export default async function EditDoctor({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");

  const [departments, doctor] = await Promise.all([
    prisma.department.findMany({ orderBy: { order: "asc" } }),
    id === "new" ? null : prisma.doctor.findUnique({ where: { id } }),
  ]);
  if (id !== "new" && !doctor) notFound();

  const q = (doctor?.qualifications ?? {}) as LocalizedList;
  const value: DoctorFormValue | undefined = doctor
    ? {
        id: doctor.id,
        name: doctor.name,
        slug: doctor.slug,
        departmentId: doctor.departmentId,
        title: doctor.title as L,
        bio: doctor.bio as L,
        qualifications: { fr: (q.fr ?? []).join("\n"), ar: (q.ar ?? []).join("\n"), en: (q.en ?? []).join("\n") },
        languages: doctor.languages,
        hours: hoursToText(doctor.consultationHours as ConsultationHours),
        consultationFee: doctor.consultationFee,
        slotMinutes: doctor.slotMinutes,
        acceptsTelehealth: doctor.acceptsTelehealth,
        isActive: doctor.isActive,
      }
    : undefined;

  return (
    <>
      <AdminTitle>{doctor ? t("editDoctor") : t("newDoctor")}</AdminTitle>
      <DoctorForm value={value} departments={departments.map((d) => ({ id: d.id, name: tr(d.name, locale) }))} />
    </>
  );
}
