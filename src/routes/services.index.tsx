import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { services } from "@/lib/services";
import { CtaBand, PageHero, ServiceCard } from "@/components/site/Layout";

export const Route = createFileRoute("/services/")({
  head: () =>
    seo({
      title: "Digital Marketing Services in India – Full-Suite Agency Solutions",
      description:
        "Explore our 12 specialised digital marketing services in India: SEO, Google Ads PPC, Meta Ads, social media, web development, content marketing, and B2B lead generation.",
      path: "/services",
    }),
  component: () => (
    <>
      <PageHero eyebrow="Services" title="Digital marketing services that work together" text="Choose a single specialist service or combine several into an integrated growth plan. Every engagement starts with understanding your goals." />
      <section className="container-site py-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{services.map((s) => <ServiceCard key={s.slug} s={s} />)}</div>
      </section>
      <CtaBand title="Not sure which service you need?" text="Tell us about your business and we'll recommend the right mix." />
    </>
  ),
});
