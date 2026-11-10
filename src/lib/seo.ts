import { siteConfig } from "./site-config";

type SeoInput = {
  title: string;
  description: string;
  path: string;
  type?: string;
  noindex?: boolean;
};

/** Builds a consistent head() payload with a self-referencing canonical. */
export function seo({ title, description, path, type = "website", noindex }: SeoInput) {
  const fullTitle = title.includes(siteConfig.name) ? title : `${title} | ${siteConfig.name}`;
  const canonicalUrl = `${siteConfig.siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { property: "og:url", content: canonicalUrl },
      { property: "og:site_name", content: siteConfig.name },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: fullTitle },
      { name: "twitter:description", content: description },
      ...(noindex
        ? [{ name: "robots", content: "noindex, nofollow" }]
        : [{ name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" }]),
    ],
    links: [{ rel: "canonical", href: canonicalUrl }],
  };
}
