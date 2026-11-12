import { getTranslations, setRequestLocale } from "next-intl/server";
import type { AppointmentStatus } from "@prisma/client";
import { Video } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDateTime, tr } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { updateAppointmentAction } from "@/actions/admin";
import { Badge, EmptyState } from "@/components/ui/primitives";
import { StatusBadge } from "@/components/ui/icons";
import { SubmitButton } from "@/components/ui/submit-button";
import { AdminTitle, DataTable, Td, compactSelect } from "@/components/admin/ui";

const STATUSES: AppointmentStatus[] = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ status?: string }> };

export default async function AdminAppointments({ params, searchParams }: Props) {
  const { locale } = await params;
  const { status } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations();
  const filter = STATUSES.includes(status as AppointmentStatus) ? (status as AppointmentStatus) : undefined;

  const appointments = await prisma.appointment.findMany({
    where: filter ? { status: filter } : {},
    include: { doctor: true, department: true, service: true },
    orderBy: { startsAt: "asc" },
    take: 200,
  });

  const chip = (active: boolean) =>
    cn("rounded-full px-3 py-1.5 text-sm font-semibold", active ? "bg-brand-500 text-white" : "bg-white text-brand-800 ring-1 ring-brand-100");

  return (
    <>
      <AdminTitle>{t("admin.appointments")}</AdminTitle>
      <div className="mb-4 flex flex-wrap gap-2">
        <Link href="/admin/appointments" className={chip(!filter)}>{t("admin.all")}</Link>
        {STATUSES.map((s) => (
          <Link key={s} href={{ pathname: "/admin/appointments", query: { status: s } }} className={chip(filter === s)}>
            {t(`status.${s}`)}
          </Link>
        ))}
      </div>

      <DataTable
        head={[t("admin.patient"), t("admin.doctor"), t("admin.date"), t("admin.status"), t("admin.actions")]}
        empty={appointments.length === 0 && <div className="p-6"><EmptyState>{t("admin.empty")}</EmptyState></div>}
      >
        {appointments.map((a) => (
          <tr key={a.id}>
            <Td>
              <span className="font-semibold text-ink">{a.patientName}</span>
              <a href={`tel:${a.patientPhone}`} className="block text-xs text-brand-700" dir="ltr">{a.patientPhone}</a>
              <span className="mt-1 block font-mono text-xs text-muted" dir="ltr">{a.reference}</span>
              {a.reason && <span className="mt-1 block max-w-56 text-xs text-muted">{t("admin.reason")}: {a.reason}</span>}
            </Td>
            <Td>
              {a.doctor.name}
              <span className="block text-xs text-muted">{tr(a.department.name, locale)}</span>
              {a.service && <span className="block text-xs text-muted">{tr(a.service.name, locale)}</span>}
            </Td>
            <Td>
              {formatDateTime(a.startsAt, locale)}
              <div className="mt-1 flex gap-1">
                {a.type === "TELEHEALTH" && <Badge tone="navy"><Video className="size-3" aria-hidden /> {t("status.TELEHEALTH")}</Badge>}
                <Badge tone="gray">{a.channel}</Badge>
              </div>
            </Td>
            <Td>
              <StatusBadge status={a.status} />
            </Td>
            <Td>
              <form action={updateAppointmentAction} className="flex min-w-56 flex-col gap-2">
                <input type="hidden" name="id" value={a.id} />
                <select name="status" defaultValue={a.status} className={compactSelect} aria-label={t("admin.status")}>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{t(`status.${s}`)}</option>
                  ))}
                </select>
                <input
                  name="staffNotes"
                  defaultValue={a.staffNotes ?? ""}
                  placeholder={t("admin.notes")}
                  className={compactSelect}
                  aria-label={t("admin.notes")}
                />
                <SubmitButton size="sm" variant="secondary">{t("admin.update")}</SubmitButton>
              </form>
            </Td>
          </tr>
        ))}
      </DataTable>
    </>
  );
}
