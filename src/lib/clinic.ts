// Single source of truth for the clinic's public contact details
export const CLINIC = {
  name: "Clinique Metidja Al Djazair",
  shortName: "Clinique Metidja",
  address: {
    street: "Boufarik",
    city: "Boufarik",
    region: "Blida",
    // As provided in the brief — verify: Boufarik's postal code is usually 09400 (21000 is Skikda)
    postalCode: "21000",
    country: "DZ",
    display: "21000, Boufarik, Blida",
  },
  phones: {
    main: "0560 07 09 98",
    mainIntl: "+213560070998",
    landline: "028 84 62 25",
    mobiles: ["0560 07 09 90", "0560 07 09 98", "0560 07 09 99"],
  },
  whatsapp: "213560070998",
  openingHours: "24/7",
  maps: {
    query: "Clinique Metidja Al Djazair, Boufarik, Blida",
    embed:
      "https://www.google.com/maps?q=Clinique+Metidja+Al+Djazair+Boufarik+Blida&output=embed",
    directions:
      "https://www.google.com/maps/dir/?api=1&destination=Clinique+Metidja+Al+Djazair+Boufarik+Blida",
  },
  social: {
    instagram: "https://www.instagram.com/",
    facebook: "https://www.facebook.com/",
  },
} as const;

export const telHref = (intl: string = CLINIC.phones.mainIntl) => `tel:${intl}`;
export const whatsappHref = (text?: string) =>
  `https://wa.me/${CLINIC.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

// Insurance / mutual partners accepted at the clinic
export const INSURANCE_PARTNERS = [
  { code: "CNAS", key: "cnas" },
  { code: "CASNOS", key: "casnos" },
  { code: "MUTUELLES", key: "mutuals" },
  { code: "CONVENTIONS", key: "conventions" },
] as const;
