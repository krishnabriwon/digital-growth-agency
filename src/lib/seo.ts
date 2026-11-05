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
  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { property: "og:url", content: path },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: fullTitle },
      { name: "twitter:description", content: description },
      ...(noindex ? [{ name: "robots", content: "noindex, nofollow" }] : []),
    ],
    links: [{ rel: "canonical", href: path }],
  };
}
