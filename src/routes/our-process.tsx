import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { CtaBand, PageHero } from "@/components/site/Layout";
import { ProcessGrid } from "@/components/site/Sections";

export const Route = createFileRoute("/our-process")({
  head: () =>
    seo({
      title: "Our Digital Marketing Process – 6 Steps to Predictable Growth",
      description:
        "Our structured six-step digital marketing process: discovery, audit, strategy, execution, optimization, and transparent reporting for predictable business growth.",
      path: "/our-process",
    }),
  component: () => (
    <>
      <PageHero eyebrow="Our process" title="From first conversation to continuous growth" text="A structured, transparent way of working, so you always know what's happening, why, and what comes next." />
      <section className="container-site py-20"><ProcessGrid /></section>
      <CtaBand title="Start with a discovery conversation" />
    </>
  ),
});
