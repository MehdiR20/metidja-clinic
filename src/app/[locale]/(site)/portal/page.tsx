import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CalendarPlus, Download, FileText, FlaskConical, LogOut, Video } from "lucide-react";
import { redirect } from "@/i18n/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate, formatDateTime, tr } from "@/lib/format";
import { cancelMyAppointmentAction } from "@/actions/portal";
import { logoutAction } from "@/actions/auth";
import { Button, ButtonLink } from "@/components/ui/button";
import { Badge, Card, Container, EmptyState } from "@/components/ui/primitives";
import { StatusBadge } from "@/components/ui/icons";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false } };

type LabRow = { analyte: string; value: string; unit: string; range: string; flag: "normal" | "high" | "low" };
type RxItem = { drug: string; dosage: string; duration: string };

export default async function PortalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const user = await getCurrentUser();
  if (!user) return redirect({ href: "/login", locale });
  const t = await getTranslations();

  // Every query is scoped to the authenticated user's id
  const [appointments, prescriptions, labResults] = await Promise.all([
    prisma.appointment.findMany({
      where: { userId: user.id },
      include: { doctor: true, department: true },
      orderBy: { startsAt: "desc" },
    }),
    prisma.prescription.findMany({ where: { userId: user.id }, include: { doctor: true }, orderBy: { issuedAt: "desc" } }),
    prisma.labResult.findMany({ where: { userId: user.id }, orderBy: { collectedAt: "desc" } }),
  ]);

  const now = new Date();
  const upcoming = appointments.filter((a) => a.startsAt > now && a.status !== "CANCELLED").reverse();
  const past = appointments.filter((a) => !upcoming.includes(a));

  return (
    <Container className="py-10 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-semibold text-brand-600">{t("portal.title")}</p>
          <h1 className="text-3xl font-extrabold text-navy-700 sm:text-4xl">{t("portal.welcome", { name: user.name })}</h1>
        </div>
        <div className="flex gap-2">
          <ButtonLink href="/booking">
            <CalendarPlus className="size-4" aria-hidden /> {t("portal.bookNew")}
          </ButtonLink>
          <form action={logoutAction}>
            <input type="hidden" name="locale" value={locale} />
            <Button variant="outline" type="submit">
              <LogOut className="flip-rtl size-4" aria-hidden /> {t("nav.logout")}
            </Button>
          </form>
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        {/* Appointments */}
        <section className="space-y-4 lg:col-span-2" aria-labelledby="upcoming">
          <h2 id="upcoming" className="text-xl font-bold text-brand-800">{t("portal.upcoming")}</h2>
          {upcoming.length === 0 && <EmptyState>{t("portal.noAppointments")}</EmptyState>}
          {upcoming.map((a) => (
            <Card key={a.id} className="flex flex-wrap items-center gap-4 p-5">
              <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-brand-500 text-center text-white">
                <span className="font-display text-xl leading-none font-extrabold">{formatDate(a.startsAt, locale, { day: "2-digit", dateStyle: undefined })}</span>
                <span className="text-xs uppercase">{formatDate(a.startsAt, locale, { month: "short", dateStyle: undefined })}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-ink">{a.doctor.name} · {tr(a.department.name, locale)}</p>
                <p className="text-sm text-muted">{formatDateTime(a.startsAt, locale)}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <StatusBadge status={a.status} />
                  {a.type === "TELEHEALTH" && (
                    <Badge tone="navy">
                      <Video className="size-3.5" aria-hidden /> {t("status.TELEHEALTH")}
                    </Badge>
                  )}
                  <Badge tone="gray" dir="ltr">{a.reference}</Badge>
                </div>
              </div>
              <form action={cancelMyAppointmentAction}>
                <input type="hidden" name="id" value={a.id} />
                <Button type="submit" variant="danger" size="sm">{t("portal.cancel")}</Button>
              </form>
            </Card>
          ))}

          {past.length > 0 && (
            <>
              <h2 className="pt-6 text-xl font-bold text-brand-800">{t("portal.past")}</h2>
              <Card className="divide-y divide-brand-50">
                {past.map((a) => (
                  <div key={a.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-sm">
                    <span>
                      <span className="font-semibold text-ink">{a.doctor.name}</span>
                      <span className="block text-muted">{formatDateTime(a.startsAt, locale)}</span>
                    </span>
                    <StatusBadge status={a.status} />
                  </div>
                ))}
              </Card>
            </>
          )}
        </section>

        <div className="space-y-8">
          {/* Prescriptions */}
          <section aria-labelledby="rx" className="space-y-4">
            <h2 id="rx" className="flex items-center gap-2 text-xl font-bold text-brand-800">
              <FileText className="size-5" aria-hidden /> {t("portal.prescriptions")}
            </h2>
            {prescriptions.length === 0 && <EmptyState>{t("portal.noPrescriptions")}</EmptyState>}
            {prescriptions.map((p) => (
              <Card key={p.id} className="flex items-center justify-between gap-3 p-5">
                <div>
                  <p className="font-semibold text-ink">{formatDate(p.issuedAt, locale, { dateStyle: "long" })}</p>
                  <p className="text-sm text-muted">
                    {t("portal.prescribedBy", { doctor: p.doctor.name })} · {t("portal.items", { count: (p.items as RxItem[]).length })}
                  </p>
                </div>
                <a
                  href={`/api/portal/prescriptions/${p.id}?locale=${locale}`}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-100"
                >
                  <Download className="size-4" aria-hidden /> {t("portal.download")}
                </a>
              </Card>
            ))}
          </section>

          {/* Lab results */}
          <section aria-labelledby="lab" className="space-y-4">
            <h2 id="lab" className="flex items-center gap-2 text-xl font-bold text-brand-800">
              <FlaskConical className="size-5" aria-hidden /> {t("portal.labResults")}
            </h2>
            {labResults.length === 0 && <EmptyState>{t("portal.noLabResults")}</EmptyState>}
            {labResults.map((r) => (
              <Card key={r.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-ink">{tr(r.testName, locale)}</p>
                    <p className="text-sm text-muted">{formatDate(r.collectedAt, locale, { dateStyle: "long" })}</p>
                  </div>
                  {r.status === "PENDING" && <Badge tone="amber">{t("portal.pendingResult")}</Badge>}
                </div>
                {r.status === "AVAILABLE" && Array.isArray(r.results) && (
                  <table className="mt-4 w-full text-sm">
                    <thead>
                      <tr className="text-start text-xs text-muted">
                        <th className="pb-2 text-start font-medium">{t("portal.analyte")}</th>
                        <th className="pb-2 text-end font-medium">{t("portal.value")}</th>
                        <th className="hidden pb-2 text-end font-medium sm:table-cell">{t("portal.range")}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-50">
                      {(r.results as LabRow[]).map((row) => (
                        <tr key={row.analyte}>
                          <td className="py-2 text-ink">{row.analyte}</td>
                          <td
                            className={`py-2 text-end font-semibold ${row.flag === "normal" ? "text-ink" : "text-red-600"}`}
                            dir="ltr"
                          >
                            {row.value} {row.unit} {row.flag === "high" ? "↑" : row.flag === "low" ? "↓" : ""}
                          </td>
                          <td className="hidden py-2 text-end text-muted sm:table-cell" dir="ltr">{row.range}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </Card>
            ))}
          </section>
        </div>
      </div>
    </Container>
  );
}
