import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { sortedArticles } from "@/content/blog";
import { Container, PageHeader } from "@/components/ui/primitives";
import { ArticleCard } from "@/components/sections/shared";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale, namespace: "blog" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <Container className="grid gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {sortedArticles().map((a) => (
          <ArticleCard key={a.slug} article={a} />
        ))}
      </Container>
    </>
  );
}
