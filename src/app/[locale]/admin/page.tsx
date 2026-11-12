import { getTranslations, setRequestLocale } from "next-intl/server";
import { CalendarDays, Clock, Inbox, Stethoscope } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { clinicDateKey, formatDateTime, tr } from "@/lib/format";
import { clinicDateTime } from "@/lib/slots";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/primitives";
import { StatusBadge } from "@/components/ui/icons";
import { AdminTitle, DataTable, Td } from "@/components/admin/ui";

export default async function AdminOverview({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");

  const dayStart = clinicDateTime(clinicDateKey(), "00:00");
  const dayEnd = new Date(dayStart.getTime() + 86_400_000);

  const [today, pending, newInquiries, activeDoctors, recent] = await Promise.all([
    prisma.appointment.count({ where: { startsAt: { gte: dayStart, lt: dayEnd }, status: { not: "CANCELLED" } } }),
    prisma.appointment.count({ where: { status: "PENDING", startsAt: { gte: new Date() } } }),
    prisma.inquiry.count({ where: { status: "NEW" } }),
    prisma.doctor.count({ where: { isActive: true } }),
    prisma.appointment.findMany({ take: 8, orderBy: { createdAt: "desc" }, include: { doctor: true, department: true } }),
  ]);

  const stats = [
    { label: t("today"), value: today, icon: CalendarDays, href: "/admin/appointments" },
    { label: t("pending"), value: pending, icon: Clock, href: "/admin/appointments?status=PENDING" },
    { label: t("newInquiries"), value: newInquiries, icon: Inbox, href: "/admin/inquiries" },
    { label: t("activeDoctors"), value: activeDoctors, icon: Stethoscope, href: "/admin/doctors" },
  ];

  return (
    <>
      <AdminTitle>{t("overview")}</AdminTitle>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link key={label} href={href}>
            <Card className="flex items-center gap-4 p-5 transition hover:shadow-lift">
              <span className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                <Icon className="size-6" aria-hidden />
              </span>
              <span>
                <span className="block font-display text-3xl font-extrabold text-navy-700">{value}</span>
                <span className="text-sm text-muted">{label}</span>
              </span>
            </Card>
          </Link>
        ))}
      </div>

      <h2 className="mt-10 mb-4 text-lg font-bold text-brand-800">{t("recentAppointments")}</h2>
      <DataTable head={[t("patient"), t("doctor"), t("date"), t("status")]}>
        {recent.map((a) => (
          <tr key={a.id}>
            <Td>
              <span className="font-semibold text-ink">{a.patientName}</span>
              <span className="block text-xs text-muted" dir="ltr">{a.patientPhone}</span>
            </Td>
            <Td>
              {a.doctor.name}
              <span className="block text-xs text-muted">{tr(a.department.name, locale)}</span>
            </Td>
            <Td>{formatDateTime(a.startsAt, locale)}</Td>
            <Td>
              <StatusBadge status={a.status} />
            </Td>
          </tr>
        ))}
      </DataTable>
    </>
  );
}
