import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { CtaBand, PageHero } from "@/components/site/Layout";
import { IndustryGrid } from "@/components/site/Sections";

export const Route = createFileRoute("/industries")({
  head: () => seo({ title: "Industries We Serve", description: "Digital marketing tailored for healthcare, education, real estate, e-commerce, B2B, travel, finance, food, SaaS, automotive, startups and wellness businesses across India.", path: "/industries" }),
  component: () => (
    <>
      <PageHero eyebrow="Industries" title="Digital marketing shaped around your sector" text="Every industry has different buyers, regulations and buying cycles. We adapt our strategy to the realities of your market." />
      <section className="container-site py-20"><IndustryGrid /></section>
      <CtaBand title="Don't see your industry?" text="We work with businesses of many kinds. Tell us about yours." />
    </>
  ),
});
