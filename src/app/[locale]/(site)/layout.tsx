import type { ReactNode } from "react";
import { setRequestLocale } from "next-intl/server";
import { ContactBar, MobileActionBar } from "@/components/layout/contact-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

// Public website shell: emergency strip, header, footer and the phone action bar
export default async function SiteLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:start-2 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2">
        Skip to content
      </a>
      <ContactBar />
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <MobileActionBar />
    </>
  );
}
