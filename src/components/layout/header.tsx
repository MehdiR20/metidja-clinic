import { getTranslations } from "next-intl/server";
import { UserRound } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getSession } from "@/lib/auth";
import { isStaffRole } from "@/lib/session";
import { Container } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "./logo";
import { LanguageSwitcher } from "./language-switcher";
import { MobileMenu } from "./mobile-menu";
import { NavLink } from "./nav-link";

export const NAV_ITEMS = [
  { href: "/doctors", key: "doctors" },
  { href: "/services", key: "services" },
  { href: "/telehealth", key: "telehealth" },
  { href: "/blog", key: "blog" },
  { href: "/contact", key: "contact" },
] as const;

export async function Header() {
  const t = await getTranslations("nav");
  const session = await getSession();
  const account = session
    ? isStaffRole(session.role)
      ? { href: "/admin", label: t("admin") }
      : { href: "/portal", label: t("portal") }
    : { href: "/login", label: t("login") };

  return (
    <header className="sticky top-0 z-30 border-b border-brand-100/70 bg-white/90 backdrop-blur-md">
      <Container className="flex h-18 items-center justify-between gap-4">
        <Link href="/" aria-label="Clinique Metidja — accueil" className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-1 xl:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {t(item.key)}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <LanguageSwitcher />
          <Link
            href={account.href}
            className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-brand-800 hover:bg-brand-50"
          >
            <UserRound className="size-4" aria-hidden />
            {account.label}
          </Link>
          <ButtonLink href="/booking">{t("book")}</ButtonLink>
        </div>

        <MobileMenu
          items={NAV_ITEMS.map((i) => ({ href: i.href, label: t(i.key) }))}
          account={account}
          bookLabel={t("book")}
        />
      </Container>
    </header>
  );
}
