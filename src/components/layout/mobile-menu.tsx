"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, UserRound, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { buttonClass } from "@/components/ui/button";
import { LanguageSwitcher } from "./language-switcher";
import { NavLink } from "./nav-link";

type Item = { href: string; label: string };

export function MobileMenu({ items, account, bookLabel }: { items: Item[]; account: Item; bookLabel: string }) {
  const t = useTranslations("common");
  const tNav = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="xl:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? t("close") : t("menu")}
        className="grid size-11 place-items-center rounded-full text-brand-800 hover:bg-brand-50"
      >
        {open ? <X className="size-6" /> : <Menu className="size-6" />}
      </button>

      {open && (
        <div id="mobile-menu" className="absolute inset-x-0 top-full z-50 h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-brand-100 bg-white px-4 pt-4 pb-28">
          <nav className="flex flex-col gap-1">
            <NavLink href="/" className="px-4 py-3 text-base">
              {tNav("home")}
            </NavLink>
            {items.map((i) => (
              <NavLink key={i.href} href={i.href} className="px-4 py-3 text-base">
                {i.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-6 space-y-4 border-t border-brand-100 pt-6">
            <LanguageSwitcher />
            <Link href={account.href} className={buttonClass({ variant: "outline", className: "w-full" })}>
              <UserRound className="size-4" aria-hidden />
              {account.label}
            </Link>
            <Link href="/booking" className={buttonClass({ className: "w-full" })}>
              {bookLabel}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
