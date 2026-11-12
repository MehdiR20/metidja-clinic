import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, CalendarCheck, Clock, GraduationCap, Languages, Video } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getDoctorBySlug } from "@/lib/queries";
import { formatDZD, tr, trList } from "@/lib/format";
import type { ConsultationHours } from "@/lib/slots";
import { ButtonLink } from "@/components/ui/button";
import { Badge, Card, Container } from "@/components/ui/primitives";
import { DepartmentIcon, DoctorAvatar } from "@/components/ui/icons";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const doctor = await getDoctorBySlug(slug);
  if (!doctor) return {};
  return { title: `${doctor.name} — ${tr(doctor.title, locale)}`, description: tr(doctor.bio, locale).slice(0, 160) };
}

export default async function DoctorPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const doctor = await getDoctorBySlug(slug);
  if (!doctor) notFound();
  const t = await getTranslations("doctors");

  const days = t.raw("days") as string[];
  const hours = doctor.consultationHours as ConsultationHours;
  // Week shown Saturday → Friday, as is customary in Algeria
  const weekOrder = [6, 0, 1, 2, 3, 4, 5];

  return (
    <Container className="py-10 sm:py-14">
      <Link href="/doctors" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-800">
        <ArrowLeft className="flip-rtl size-4" aria-hidden /> {t("back")}
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="flex flex-col gap-6 p-8 sm:flex-row sm:items-center">
            <DoctorAvatar name={doctor.name} photoUrl={doctor.photoUrl} className="size-24 text-3xl" />
            <div>
              <h1 className="text-3xl font-extrabold text-navy-700">{doctor.name}</h1>
              <p className="mt-1 text-lg font-semibold text-brand-600">{tr(doctor.title, locale)}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge>
                  <DepartmentIcon icon={doctor.department.icon} className="size-4 shadow-none" />
                  {tr(doctor.department.name, locale)}
                </Badge>
                {doctor.acceptsTelehealth && (
                  <Badge tone="navy">
                    <Video className="size-3.5" aria-hidden /> {t("telehealth")}
                  </Badge>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <h2 className="text-xl font-bold text-brand-800">{t("about")}</h2>
            <p className="mt-3 leading-relaxed text-ink/85">{tr(doctor.bio, locale)}</p>

            <h2 className="mt-8 flex items-center gap-2 text-xl font-bold text-brand-800">
              <GraduationCap className="size-5" aria-hidden /> {t("qualifications")}
            </h2>
            <ul className="mt-3 list-disc space-y-1.5 ps-6 text-ink/85">
              {trList(doctor.qualifications, locale).map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>

            <h2 className="mt-8 flex items-center gap-2 text-xl font-bold text-brand-800">
              <Languages className="size-5" aria-hidden /> {t("languages")}
            </h2>
            <p className="mt-3 text-ink/85">{doctor.languages.map((l) => t(`languageNames.${l}`)).join(" · ")}</p>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card className="p-6">
            <h2 className="flex items-center gap-2 font-bold text-brand-800">
              <Clock className="size-5" aria-hidden /> {t("hours")}
            </h2>
            <dl className="mt-4 divide-y divide-brand-50 text-sm">
              {weekOrder.map((day) => {
                const blocks = hours.filter((h) => h.day === day);
                return (
                  <div key={day} className="flex justify-between gap-4 py-2">
                    <dt className="font-medium text-ink">{days[day]}</dt>
                    <dd className="text-end text-muted" dir="ltr">
                      {blocks.length ? blocks.map((b) => `${b.start}–${b.end}`).join(", ") : "—"}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </Card>
          <Card className="sticky top-24 p-6">
            <p className="text-sm text-muted">{t("fee")}</p>
            <p className="font-display text-3xl font-extrabold text-navy-700" dir="ltr">
              {formatDZD(doctor.consultationFee, locale)}
            </p>
            <ButtonLink href={{ pathname: "/booking", query: { doctor: doctor.id } }} size="lg" className="mt-5 w-full">
              <CalendarCheck className="size-5" aria-hidden /> {t("book")}
            </ButtonLink>
          </Card>
        </aside>
      </div>
    </Container>
  );
}
