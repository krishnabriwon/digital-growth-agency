/**
 * Central, editable site configuration.
 * Replace the empty values below once real details are available.
 * Empty strings mean "not configured" — the site will NOT render fake links.
 */
export const siteConfig = {
  name: "Digital Marketing Agency",
  shortName: "DMA",
  siteUrl: "https://digital-growth-agency-nine.vercel.app",
  tagline: "Driving Digital Growth. Delivering Real Results.",
  region: "Pan India",

  contact: {
    /** E.164 format, e.g. "+919876543210". Leave empty until available. */
    phone: "",
    /** Digits only with country code, e.g. "919876543210". Leave empty until available. */
    whatsapp: "",
    /** Public enquiry email. Leave empty until available. */
    email: "",
  },

  tracking: {
    /** Google Tag Manager container, e.g. "GTM-XXXXXXX". Recommended: configure GA4, Ads conversions and Conversion Linker inside GTM. */
    gtmId: "",
    /** GA4 measurement ID, e.g. "G-XXXXXXXXXX". Only used directly when gtmId is empty. */
    ga4Id: "",
    /** Google Ads ID, e.g. "AW-XXXXXXXXX". Only used directly when gtmId is empty. */
    googleAdsId: "",
    /** Google Ads conversion label for confirmed leads. */
    googleAdsLeadLabel: "",
    /** Google Search Console HTML-tag verification token (content value only). */
    searchConsoleVerification: "",
  },
} as const;

export const hasPhone = () => siteConfig.contact.phone.trim().length > 0;
export const hasWhatsApp = () => siteConfig.contact.whatsapp.trim().length > 0;
export const hasEmail = () => siteConfig.contact.email.trim().length > 0;
