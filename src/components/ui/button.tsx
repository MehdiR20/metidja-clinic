import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "navy" | "danger" | "whatsapp";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-brand-500 text-white hover:bg-brand-600 shadow-soft",
  secondary: "bg-brand-50 text-brand-800 hover:bg-brand-100",
  outline: "border border-brand-200 bg-white text-brand-800 hover:border-brand-400 hover:bg-brand-50",
  ghost: "text-brand-800 hover:bg-brand-50",
  navy: "bg-navy-700 text-white hover:bg-navy-800 shadow-soft",
  danger: "bg-red-50 text-red-700 hover:bg-red-100",
  whatsapp: "bg-[#25D366] text-white hover:bg-[#1ebe5b] shadow-soft",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-13 px-7 text-base gap-2.5",
};

export function buttonClass({ variant = "primary", size = "md", className }: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn(
    "inline-flex shrink-0 items-center justify-center rounded-full font-semibold transition-colors duration-200 disabled:pointer-events-none disabled:opacity-60 cursor-pointer select-none",
    VARIANTS[variant],
    SIZES[size],
    className,
  );
}

type Common = { variant?: Variant; size?: Size };

export function Button({ variant, size, className, ...props }: ComponentProps<"button"> & Common) {
  return <button className={buttonClass({ variant, size, className })} {...props} />;
}

/** Locale-aware internal link styled as a button. */
export function ButtonLink({ variant, size, className, ...props }: ComponentProps<typeof Link> & Common) {
  return <Link className={buttonClass({ variant, size, className })} {...props} />;
}

/** External / protocol link (tel:, wa.me) styled as a button. */
export function ButtonAnchor({ variant, size, className, ...props }: ComponentProps<"a"> & Common) {
  return <a className={buttonClass({ variant, size, className })} {...props} />;
}
