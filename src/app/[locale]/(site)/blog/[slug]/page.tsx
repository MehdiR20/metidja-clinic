import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, CalendarCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ARTICLES, getArticle } from "@/content/blog";
import { routing, type Locale } from "@/i18n/routing";
import { formatDate } from "@/lib/format";
import { CLINIC } from "@/lib/clinic";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/primitives";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => ARTICLES.map((a) => ({ locale, slug: a.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  const l = locale as Locale;
  return {
    title: a.title[l],
    description: a.excerpt[l],
    alternates: { languages: Object.fromEntries(routing.locales.map((x) => [x, `/${x}/blog/${slug}`])) },
    openGraph: { type: "article", images: [a.image], publishedTime: a.date },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const article = getArticle(slug);
  if (!article) notFound();
  const l = locale as Locale;
  const t = await getTranslations();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    headline: article.title[l],
    datePublished: article.date,
    inLanguage: locale,
    publisher: { "@type": "MedicalClinic", name: CLINIC.name },
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Container className="max-w-3xl py-10 sm:py-14">
        <Link href="/blog" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-800">
          <ArrowLeft className="flip-rtl size-4" aria-hidden /> {t("blog.back")}
        </Link>
        <p className="mt-6 text-sm font-semibold text-brand-600">
          {formatDate(article.date, locale, { dateStyle: "long" })} · {t("blog.readingTime", { count: article.readingMin })}
        </p>
        <h1 className="mt-2 text-3xl leading-tight font-extrabold text-navy-700 sm:text-4xl">{article.title[l]}</h1>
        <p className="mt-4 text-lg text-muted">{article.excerpt[l]}</p>
        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-3xl">
          <Image src={article.image} alt="" fill priority sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
        </div>
        <div className="prose-clinic mt-10">
          {article.body[l].map((block, i) =>
            "h2" in block ? (
              <h2 key={i}>{block.h2}</h2>
            ) : "ul" in block ? (
              <ul key={i}>
                {block.ul.map((li) => (
                  <li key={li}>{li}</li>
                ))}
              </ul>
            ) : (
              <p key={i}>{block.p}</p>
            ),
          )}
        </div>
        <div className="mt-12 rounded-3xl bg-brand-50 p-8">
          <p className="text-lg font-bold text-brand-800">{t("home.ctaTitle")}</p>
          <ButtonLink href="/booking" className="mt-4">
            <CalendarCheck className="size-4" aria-hidden /> {t("hero.ctaBook")}
          </ButtonLink>
        </div>
      </Container>
    </article>
  );
}
