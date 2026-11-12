import "server-only";
import { prisma } from "./prisma";
import type { NotificationChannel } from "@prisma/client";

/**
 * MOCK notification gateway.
 * Messages are written to the NotificationLog table (visible in the admin dashboard) and the server console.
 * To go live, replace the body of `send` with a call to an SMS aggregator (e.g. an Algerian operator API)
 * or the WhatsApp Business Cloud API — the call sites don't need to change.
 */
async function send(channel: NotificationChannel, to: string, body: string) {
  await prisma.notificationLog.create({ data: { channel, to, body } });
  console.info(`[notify:${channel}] → ${to}\n${body}`);
}

const TEMPLATES = {
  fr: (p: Params) =>
    `Clinique Metidja : RDV ${p.reference} le ${p.when} avec ${p.doctor}${p.telehealth ? " (téléconsultation)" : ""}. Pour modifier : 0560 07 09 98.`,
  ar: (p: Params) =>
    `عيادة متيجة: موعدكم ${p.reference} يوم ${p.when} مع ${p.doctor}${p.telehealth ? " (استشارة عن بعد)" : ""}. للتعديل: 0560070998`,
  en: (p: Params) =>
    `Clinique Metidja: appointment ${p.reference} on ${p.when} with ${p.doctor}${p.telehealth ? " (video consultation)" : ""}. To change it call +213 560 07 09 98.`,
};

type Params = { reference: string; when: string; doctor: string; telehealth: boolean };

export async function sendBookingConfirmation(
  channel: NotificationChannel,
  to: string,
  locale: string,
  params: Params,
) {
  const template = TEMPLATES[(locale as keyof typeof TEMPLATES) ?? "fr"] ?? TEMPLATES.fr;
  await send(channel, to, template(params));
}

export async function sendStatusUpdate(channel: NotificationChannel, to: string, reference: string, status: string) {
  await send(channel, to, `Clinique Metidja : votre RDV ${reference} est désormais « ${status} ».`);
}
