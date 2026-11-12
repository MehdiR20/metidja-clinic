import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, Container, PageHeader } from "@/components/ui/primitives";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale, namespace: "privacy" });
  return { title: t("title") };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("privacy");
  const sections = t.raw("sections") as { title: string; text: string }[];
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("intro")} />
      <Container className="max-w-3xl space-y-4 py-12">
        {sections.map((s) => (
          <Card key={s.title} className="p-6">
            <h2 className="text-lg font-bold text-brand-800">{s.title}</h2>
            <p className="mt-2 leading-relaxed text-ink/85">{s.text}</p>
          </Card>
        ))}
      </Container>
    </>
  );
}
