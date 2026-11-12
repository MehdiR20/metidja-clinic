import {
  Activity,
  Baby,
  Droplets,
  Ear,
  Flower2,
  HeartPulse,
  Microscope,
  Scissors,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import { cn, initials } from "@/lib/utils";
import { Badge, type BadgeTone } from "./primitives";
import { useTranslations } from "next-intl";

const DEPARTMENT_ICONS: Record<string, LucideIcon> = {
  stethoscope: Stethoscope,
  "heart-pulse": HeartPulse,
  baby: Baby,
  flower: Flower2,
  scissors: Scissors,
  ear: Ear,
  activity: Activity,
  droplets: Droplets,
  microscope: Microscope,
};

export const DEPARTMENT_ICON_KEYS = Object.keys(DEPARTMENT_ICONS);

/** Teal round badge icon, as on the clinic's Instagram posts. */
export function DepartmentIcon({ icon, className }: { icon: string; className?: string }) {
  const Icon = DEPARTMENT_ICONS[icon] ?? Stethoscope;
  return (
    <span className={cn("inline-grid size-12 place-items-center rounded-full bg-brand-500 text-white shadow-soft", className)}>
      <Icon className="size-1/2" aria-hidden />
    </span>
  );
}

export function DoctorAvatar({ name, photoUrl, className }: { name: string; photoUrl?: string | null; className?: string }) {
  if (photoUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={photoUrl} alt="" className={cn("size-16 rounded-2xl object-cover", className)} />;
  }
  return (
    <span
      aria-hidden
      className={cn(
        "inline-grid size-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-700 font-display text-xl font-bold text-white",
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}

const STATUS_TONES: Record<string, BadgeTone> = {
  PENDING: "amber",
  CONFIRMED: "green",
  COMPLETED: "gray",
  CANCELLED: "red",
  NEW: "brand",
  IN_PROGRESS: "amber",
  RESOLVED: "green",
  IN_PERSON: "gray",
  TELEHEALTH: "navy",
};

export function StatusBadge({ status }: { status: string }) {
  const t = useTranslations("status");
  return <Badge tone={STATUS_TONES[status] ?? "gray"}>{t.has(status) ? t(status) : status}</Badge>;
}
