# Clinique Metidja Al Djazair — web platform

Trilingual (FR / AR-RTL / EN) website, online booking, patient portal and admin dashboard for Clinique Metidja, Boufarik (Blida).

**Stack:** Next.js 15 (App Router, Server Actions) · React 19 · TypeScript · Tailwind CSS 4 · next-intl 4 · Prisma 6 + PostgreSQL · Zod · JWT sessions (jose) + bcrypt.

## Quick start

```bash
npm install
cp .env.example .env          # then set AUTH_SECRET (≥ 32 chars)

# Database — pick one:
docker compose up -d          # PostgreSQL 16 in Docker
npm run db:local              # …or an embedded PostgreSQL (no Docker), keep it running in its own terminal

npm run db:push               # create tables
npm run db:seed               # departments, services (DZD), doctors, admin + demo patient
npm run dev                   # http://localhost:3000  → redirects to /fr
```

Seed accounts: the admin uses `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` from `.env`; demo patient `patient@demo.dz` / `Patient2026`. **Change or delete both before going live.**

## Structure

```
prisma/schema.prisma      Data model (User, Department, Service, Doctor, Appointment, Prescription, LabResult, Inquiry, NotificationLog)
prisma/seed.ts            Seed data — see the ⚠️ notes at the top
scripts/local-db.mjs      Embedded PostgreSQL for dev machines without Docker
src/middleware.ts         Locale routing + JWT guard for /portal and /admin
src/i18n/                 next-intl routing, navigation and request config
src/messages/{fr,ar,en}.json   All UI strings
src/lib/                  clinic info, formatting (formatDZD, dates in Africa/Algiers), auth, Zod schemas, slot engine, mock notifier
src/actions/              Server Actions (auth, booking, inquiries, portal, admin CRUD) — each re-checks auth & validates with Zod
src/app/[locale]/(site)/  Public site: home, doctors, services, booking, telehealth, blog, contact, privacy, login/register, portal
src/app/[locale]/admin/   Dashboard: overview, appointments, doctors, services & prices, inquiries, notification outbox
src/app/api/              /api/slots (free slots), /api/portal/prescriptions/[id] (printable prescription)
src/components/           ui/ primitives, layout/ (header, contact bar, language switcher), sections/, forms/, booking/, admin/
src/content/blog.ts       Trilingual SEO articles
```

## Key behaviours

- **i18n / RTL** — URLs are `/fr`, `/ar`, `/en`; `<html dir="rtl">` for Arabic, Cairo font, logical CSS properties (`ms-`, `ps-`, `start-`…) so layouts mirror automatically.
- **Booking** — specialty → doctor (in-person or telehealth) → date → free slot → details. Slots come from each doctor's weekly hours minus existing bookings; the server re-checks availability and a unique `(doctorId, startsAt)` index prevents double booking under concurrency.
- **Notifications** — `src/lib/notify.ts` is a mock: messages go to the `NotificationLog` table (Admin → Notifications) and the console. Replace `send()` with an SMS gateway / WhatsApp Business API call.
- **Prices** — stored as integer DZD, displayed with `formatDZD()` → `3,500 DZD` (`3,500 د.ج` in Arabic).
- **Security / Law 18-07** — bcrypt (12 rounds), httpOnly SameSite JWT cookie, role checks in middleware *and* in every server action/route, ownership-scoped queries in the portal, explicit timestamped consent on sign-up and on each booking/inquiry, privacy page, security headers, open-redirect protection on `?next=`, honeypot on the contact form.

## Before going live — content to confirm

- Doctors: only **Dr Fares, Dr Benamane, Dr Hassen** come from public reviews; Benamane's specialty and all bios/diplomas are placeholders. The other four doctors are fictional demo profiles — edit or deactivate them in Admin → Doctors.
- Prices in the seed are indicative examples.
- Testimonials (`testimonials.*` in the message files) are placeholders: paste the verbatim Google reviews, with the reviewers' consent.
- Postal code: the brief says 21000, but Boufarik is usually 09400 — check `src/lib/clinic.ts`.
- Replace the simplified "CM" monogram (`src/components/layout/logo.tsx`, `src/app/icon.svg`) with the official logo.
- Add rate limiting on login/booking (e.g. at the reverse proxy) and use migrations (`npm run db:migrate`) instead of `db push` in production.
