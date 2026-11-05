import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { CtaBand, PageHero } from "@/components/site/Layout";
import { ProcessGrid } from "@/components/site/Sections";

export const Route = createFileRoute("/our-process")({
  head: () => seo({ title: "Our Process", description: "Our six-step digital marketing process: discovery, audit, strategy, execution, optimisation and reporting — designed for clarity and measurable growth.", path: "/our-process" }),
  component: () => (
    <>
      <PageHero eyebrow="Our process" title="From first conversation to continuous growth" text="A structured, transparent way of working, so you always know what's happening, why, and what comes next." />
      <section className="container-site py-20"><ProcessGrid /></section>
      <CtaBand title="Start with a discovery conversation" />
    </>
  ),
});
