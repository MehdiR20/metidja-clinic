import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getDepartments, getDoctors } from "@/lib/queries";
import { tr } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Container, EmptyState, PageHeader } from "@/components/ui/primitives";
import { DoctorCard } from "@/components/sections/doctor-card";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ specialty?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale, namespace: "doctors" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function DoctorsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { specialty } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("doctors");
  const [departments, doctors] = await Promise.all([getDepartments(), getDoctors(specialty)]);

  const chip = (active: boolean) =>
    cn(
      "shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
      active ? "bg-brand-500 text-white" : "bg-white text-brand-800 ring-1 ring-brand-100 hover:bg-brand-50",
    );

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <Container className="py-12">
        <nav aria-label={t("all")} className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2">
          <Link href="/doctors" className={chip(!specialty)}>
            {t("all")}
          </Link>
          {departments.map((d) => (
            <Link key={d.id} href={{ pathname: "/doctors", query: { specialty: d.slug } }} className={chip(specialty === d.slug)}>
              {tr(d.name, locale)}
            </Link>
          ))}
        </nav>

        <div className="mt-8">
          {doctors.length ? (
            <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {doctors.map((d) => (
                <li key={d.id}>
                  <DoctorCard doctor={d} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState>{t("empty")}</EmptyState>
          )}
        </div>
      </Container>
    </>
  );
}
