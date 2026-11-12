import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MessageCircle } from "lucide-react";
import { whatsappHref } from "@/lib/clinic";
import { ButtonAnchor } from "@/components/ui/button";
import { Card, Container, PageHeader } from "@/components/ui/primitives";
import { LocationBlock } from "@/components/sections/shared";
import { InquiryForm } from "@/components/forms/inquiry-form";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale, namespace: "contact" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>
      <PageHeader title={t("contact.title")} subtitle={t("contact.subtitle")}>
        <ButtonAnchor href={whatsappHref()} target="_blank" rel="noopener noreferrer" variant="whatsapp" className="mt-6">
          <MessageCircle className="size-4" aria-hidden /> {t("contactBar.whatsapp")}
        </ButtonAnchor>
      </PageHeader>
      <Container className="space-y-12 py-12">
        <Card className="mx-auto max-w-3xl p-6 sm:p-10">
          <InquiryForm />
        </Card>
        <LocationBlock />
      </Container>
    </>
  );
}
