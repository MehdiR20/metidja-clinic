import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { tr } from "@/lib/format";
import { clinicDateKey } from "@/lib/format";
import { MAX_BOOKING_DAYS_AHEAD } from "@/lib/slots";
import { Container, PageHeader } from "@/components/ui/primitives";
import { BookingWizard, type BookingDepartment } from "@/components/booking/booking-wizard";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ department?: string; doctor?: string; type?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale, namespace: "booking" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function BookingPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("booking");

  const [rows, user] = await Promise.all([
    prisma.department.findMany({
      where: { isActive: true, doctors: { some: { isActive: true } } },
      orderBy: { order: "asc" },
      include: {
        doctors: { where: { isActive: true }, orderBy: { name: "asc" } },
        services: { where: { isActive: true }, orderBy: { order: "asc" } },
      },
    }),
    getCurrentUser(),
  ]);
  const isPatient = user?.role === "PATIENT";

  // Serialize only what the client needs, already translated
  const departments: BookingDepartment[] = rows.map((d) => ({
    id: d.id,
    icon: d.icon,
    name: tr(d.name, locale),
    doctors: d.doctors.map((doc) => ({
      id: doc.id,
      name: doc.name,
      title: tr(doc.title, locale),
      fee: doc.consultationFee,
      telehealth: doc.acceptsTelehealth,
      days: [...new Set((doc.consultationHours as { day: number }[]).map((h) => h.day))],
    })),
    services: d.services.map((s) => ({ id: s.id, name: tr(s.name, locale), price: s.priceDzd })),
  }));

  const preDoctor = departments.flatMap((d) => d.doctors.map((doc) => ({ dept: d.id, doc: doc.id }))).find((x) => x.doc === sp.doctor);

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <Container className="max-w-4xl py-10">
        <BookingWizard
          departments={departments}
          initial={{
            departmentId: preDoctor?.dept ?? (departments.some((d) => d.id === sp.department) ? sp.department : undefined),
            doctorId: preDoctor?.doc,
            type: sp.type === "TELEHEALTH" ? "TELEHEALTH" : "IN_PERSON",
          }}
          today={clinicDateKey()}
          maxDays={MAX_BOOKING_DAYS_AHEAD}
          loggedIn={isPatient}
          prefill={isPatient ? { name: user.name, phone: user.phone, email: user.email } : undefined}
        />
      </Container>
    </>
  );
}
