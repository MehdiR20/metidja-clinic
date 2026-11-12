import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AlertTriangle, CheckCircle2, Video } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Card, Container, PageHeader, SectionHeading } from "@/components/ui/primitives";
import { InquiryForm } from "@/components/forms/inquiry-form";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale, namespace: "telehealth" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function TelehealthPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("telehealth");
  const steps = t.raw("steps") as { title: string; text: string }[];
  const goodFor = t.raw("goodForItems") as string[];

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")}>
        <ButtonLink href={{ pathname: "/booking", query: { type: "TELEHEALTH" } }} size="lg" className="mt-6">
          <Video className="size-5" aria-hidden /> {t("bookCta")}
        </ButtonLink>
      </PageHeader>

      <Container className="py-14">
        <SectionHeading title={t("how")} />
        <ol className="mt-8 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title}>
              <Card className="h-full p-6">
                <span className="grid size-10 place-items-center rounded-full bg-brand-500 font-display font-extrabold text-white">{i + 1}</span>
                <h3 className="mt-4 font-bold text-ink">{s.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{s.text}</p>
              </Card>
            </li>
          ))}
        </ol>

        <div className="mt-12 grid items-start gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="font-bold text-brand-800">{t("goodFor")}</h2>
              <ul className="mt-4 space-y-3">
                {goodFor.map((g) => (
                  <li key={g} className="flex items-start gap-2 text-ink/85">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand-500" aria-hidden /> {g}
                  </li>
                ))}
              </ul>
            </Card>
            <div role="note" className="flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm leading-relaxed text-red-800">
              <AlertTriangle className="size-5 shrink-0" aria-hidden />
              {t("notFor")}
            </div>
            <div className="relative hidden aspect-video overflow-hidden rounded-3xl lg:block">
              <Image src="/images/consultation-wing.jpg" alt="" fill sizes="50vw" className="object-cover" />
            </div>
          </div>

          <Card className="p-6 sm:p-8">
            <h2 className="text-xl font-bold text-brand-800">{t("requestTitle")}</h2>
            <p className="mt-1 mb-6 text-sm text-muted">{t("requestText")}</p>
            <InquiryForm type="TELEHEALTH" defaultSubject={t("title")} />
          </Card>
        </div>
      </Container>
    </>
  );
}
