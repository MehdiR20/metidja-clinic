import type { ReactNode } from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Bell, CalendarDays, ExternalLink, Inbox, LayoutDashboard, LogOut, Stethoscope, Tags } from "lucide-react";
import { Link, redirect } from "@/i18n/navigation";
import { getCurrentUser } from "@/lib/auth";
import { isStaffRole } from "@/lib/session";
import { logoutAction } from "@/actions/auth";
import { Logo } from "@/components/layout/logo";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { NavLink } from "@/components/layout/nav-link";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

const ITEMS = [
  { href: "/admin", key: "overview", icon: LayoutDashboard },
  { href: "/admin/appointments", key: "appointments", icon: CalendarDays },
  { href: "/admin/doctors", key: "doctors", icon: Stethoscope },
  { href: "/admin/services", key: "services", icon: Tags },
  { href: "/admin/inquiries", key: "inquiries", icon: Inbox },
  { href: "/admin/notifications", key: "notifications", icon: Bell },
] as const;

export default async function AdminLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Defence in depth: middleware already checks the JWT, here we re-check the role against the database
  const user = await getCurrentUser();
  if (!user) return redirect({ href: "/login", locale });
  if (!isStaffRole(user.role)) return redirect({ href: "/portal", locale });

  const t = await getTranslations("admin");

  return (
    <div className="min-h-dvh bg-surface lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="border-b border-brand-100 bg-white lg:sticky lg:top-0 lg:h-dvh lg:border-e lg:border-b-0">
        <div className="flex items-center justify-between p-4 lg:block lg:p-6">
          <Link href="/admin">
            <Logo />
          </Link>
          <p className="hidden text-xs font-semibold tracking-wider text-muted uppercase lg:mt-2 lg:block">{t("title")}</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-4 pb-3 lg:flex-col lg:px-3">
          {ITEMS.map(({ href, key, icon: Icon }) => (
            <NavLink key={href} href={href} className="flex shrink-0 items-center gap-2.5 rounded-xl">
              <Icon className="size-4" aria-hidden />
              {t(key)}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="min-w-0">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-100 bg-white px-4 py-3 sm:px-8">
          <p className="text-sm text-muted">
            <span className="font-semibold text-ink">{user.name}</span> · {user.role}
          </p>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link href="/" className="hidden items-center gap-1 text-sm font-semibold text-brand-700 hover:underline sm:flex">
              <ExternalLink className="size-4" aria-hidden /> {t("viewSite")}
            </Link>
            <form action={logoutAction}>
              <input type="hidden" name="locale" value={locale} />
              <button type="submit" className="grid size-9 place-items-center rounded-full text-muted hover:bg-brand-50 hover:text-ink" title="Logout">
                <LogOut className="flip-rtl size-4" aria-hidden />
              </button>
            </form>
          </div>
        </header>
        <main className="p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
