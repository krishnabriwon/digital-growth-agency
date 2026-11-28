import type {
  CmsArticle,
  CmsFaq,
  CmsAnnouncement,
  CmsHeroSettings,
  CmsProcessStep,
} from "./types";
import { blogPosts, homeFaqs, processSteps } from "@/lib/content";

export const INITIAL_CMS_ARTICLES: CmsArticle[] = blogPosts.map((post, idx) => ({
  id: `cms-art-${idx + 1}`,
  slug: post.slug,
  title: post.title,
  description: post.description,
  category: post.category,
  readTime: post.readTime,
  published: true,
  featured: idx === 0,
  createdAt: "2026-11-01T10:00:00.000Z",
  updatedAt: "2026-11-20T12:00:00.000Z",
  author: "Editorial Team",
  sections: post.sections,
}));

export const INITIAL_CMS_FAQS: CmsFaq[] = homeFaqs.map((faq, idx) => ({
  id: `cms-faq-${idx + 1}`,
  q: faq.q,
  a: faq.a,
  category:
    idx === 2
      ? "Pricing"
      : idx === 3
      ? "Guarantees"
      : idx === 0
      ? "Services"
      : idx === 5
      ? "Process"
      : "General",
  order: idx + 1,
  published: true,
}));

export const INITIAL_CMS_ANNOUNCEMENT: CmsAnnouncement = {
  enabled: true,
  badgeText: "2026 Growth",
  message: "Book a complimentary 30-minute growth roadmap session with our lead strategists.",
  linkText: "Claim Free Audit",
  linkUrl: "/contact",
  theme: "primary",
};

export const INITIAL_CMS_HERO: CmsHeroSettings = {
  eyebrow: "Digital marketing across Pan India",
  title: "Driving Digital Growth.",
  highlightText: "Delivering Real Results.",
  subtitle:
    "We help ambitious businesses get found, build trust and turn online attention into genuine enquiries — with strategy-led SEO, advertising, content and websites.",
  primaryCtaText: "Get a Free Consultation",
  primaryCtaLink: "/contact",
  secondaryCtaText: "Explore Services",
  secondaryCtaLink: "/services",
};

export const INITIAL_CMS_PROCESS: CmsProcessStep[] = processSteps.map((s, idx) => ({
  id: `cms-step-${idx + 1}`,
  stepNumber: idx + 1,
  title: s.title,
  text: s.text,
}));
