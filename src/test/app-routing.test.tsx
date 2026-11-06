import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";
import { services } from "@/lib/services";
import { blogPosts } from "@/lib/content";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });
  it("provides all 12 individual service routes", () => {
    const expected = ["seo", "google-ads-ppc", "social-media-marketing", "meta-ads", "website-design-development", "content-marketing", "email-marketing", "online-reputation-management", "local-seo", "e-commerce-marketing", "ai-powered-digital-marketing", "lead-generation"];
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    expect(services.map((s) => s.slug)).toEqual(expected);
    for (const slug of expected) expect(router.matchRoutes(`/services/${slug}`).at(-1)?.routeId).toBe("/services/$slug");
  });
  it("matches every required company page and resource", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    for (const path of ["/about", "/services", "/why-choose-us", "/our-process", "/industries", "/blog", "/contact", "/thank-you", "/privacy-policy"]) {
      expect(router.matchRoutes(path).at(-1)?.routeId).not.toBe(rootRouteId);
    }
    for (const post of blogPosts) expect(router.matchRoutes(`/blog/${post.slug}`).at(-1)?.routeId).toBe("/blog/$slug");
  });
  it("resolves related-service links to an existing service", () => {
    for (const service of services) {
      for (const related of service.related) expect(services.some((s) => s.slug === related)).toBe(true);
    }
  });
});
