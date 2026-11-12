"use client";

import type { ReactNode } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function NavLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-full px-3.5 py-2 text-sm font-semibold whitespace-nowrap transition-colors",
        active ? "bg-brand-50 text-brand-700" : "text-ink/80 hover:bg-brand-50 hover:text-brand-700",
        className,
      )}
    >
      {children}
    </Link>
  );
}
