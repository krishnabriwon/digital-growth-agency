import { siteConfig } from "./site-config";

/**
 * dataLayer conventions (GTM triggers should listen for these event names):
 *  - page_view            { page_path, page_title, page_location }  (SPA-safe, deduped)
 *  - cta_click            { cta_label, cta_location }
 *  - phone_click          { link_location }        (only when a real number is configured)
 *  - whatsapp_click       { link_location }        (only when a real number is configured)
 *  - generate_lead        { form_name, service }   (ONLY after the enquiry was saved)
 *  - thank_you_view       {}                       (Thank You page load)
 * A form button click alone is never reported as a lead.
 */

type DataLayerEvent = { event: string; [key: string]: unknown };

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function pushEvent(payload: DataLayerEvent) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
  // Direct gtag fallback when GTM is not used.
  const { gtmId, ga4Id } = siteConfig.tracking;
  if (!gtmId && ga4Id && window.gtag) {
    const { event, ...params } = payload;
    window.gtag("event", event, params);
  }
}

let lastTrackedPath: string | null = null;

/** Called on every route change; dedupes repeats (StrictMode, re-renders). */
export function trackPageView(path: string) {
  if (typeof window === "undefined" || path === lastTrackedPath) return;
  lastTrackedPath = path;
  pushEvent({
    event: "page_view",
    page_path: path,
    page_title: document.title,
    page_location: window.location.href,
  });
}

export const trackCta = (label: string, location: string) =>
  pushEvent({ event: "cta_click", cta_label: label, cta_location: location });

export function trackLead(service: string) {
  pushEvent({ event: "generate_lead", form_name: "contact_enquiry", service });
  const { gtmId, googleAdsId, googleAdsLeadLabel } = siteConfig.tracking;
  if (!gtmId && googleAdsId && googleAdsLeadLabel && window.gtag) {
    window.gtag("event", "conversion", { send_to: `${googleAdsId}/${googleAdsLeadLabel}` });
  }
}

/** Head scripts for GTM or gtag, rendered only when IDs are configured. */
export function trackingHeadScripts(): { children: string }[] {
  const { gtmId, ga4Id, googleAdsId } = siteConfig.tracking;
  if (gtmId) {
    return [
      {
        children: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`,
      },
    ];
  }
  const primary = ga4Id || googleAdsId;
  if (!primary) return [];
  // page_view is sent manually on route changes, so automatic page views are disabled.
  const configs = [ga4Id, googleAdsId]
    .filter(Boolean)
    .map((id) => `gtag('config','${id}',{send_page_view:false});`)
    .join("");
  return [
    {
      children: `(function(){var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=${primary}';document.head.appendChild(s);window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments);};gtag('js',new Date());${configs}})();`,
    },
  ];
}
