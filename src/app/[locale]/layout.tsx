import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Cairo, Montserrat } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { isRtl, routing } from "@/i18n/routing";
import { CLINIC } from "@/lib/clinic";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", display: "swap", weight: ["500", "600", "700", "800"] });
const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo", display: "swap" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const viewport: Viewport = { themeColor: "#17a2b2", width: "device-width", initialScale: 1 };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t("title"), template: `%s · ${CLINIC.shortName}` },
    description: t("description"),
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}`])),
    },
    openGraph: { type: "website", siteName: CLINIC.name, locale, images: ["/images/building-day.jpg"] },
  };
}

// Structured data for local SEO ("clinique Boufarik", "clinique Blida")
const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["MedicalClinic", "Hospital"],
  name: CLINIC.name,
  url: SITE_URL,
  telephone: CLINIC.phones.mainIntl,
  image: `${SITE_URL}/images/building-day.jpg`,
  openingHours: "Mo-Su 00:00-23:59",
  priceRange: "DZD",
  currenciesAccepted: "DZD",
  address: {
    "@type": "PostalAddress",
    addressLocality: CLINIC.address.city,
    addressRegion: CLINIC.address.region,
    postalCode: CLINIC.address.postalCode,
    addressCountry: CLINIC.address.country,
  },
  medicalSpecialty: ["Surgical", "Obstetric", "Gynecologic", "Cardiovascular", "Pediatric", "Emergency"],
};

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={locale} dir={isRtl(locale) ? "rtl" : "ltr"} className={`${montserrat.variable} ${cairo.variable}`}>
      <body className="min-h-dvh">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
