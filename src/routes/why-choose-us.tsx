import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { CheckItem, CtaBand, PageHero, SectionHead } from "@/components/site/Layout";
import { WhyGrid } from "@/components/site/Sections";

export const Route = createFileRoute("/why-choose-us")({
  head: () =>
    seo({
      title: "Why Choose Digital Marketing Agency – Transparency & Proven Growth",
      description:
        "Why ambitious businesses across India choose Digital Marketing Agency: goal-first strategy, honest performance reporting, full account ownership, and ethical execution.",
      path: "/why-choose-us",
    }),
  component: () => (
    <>
      <PageHero eyebrow="Why choose us" title="A marketing partner you can rely on" text="We keep things simple: understand your business, do excellent work, measure honestly and keep improving." />
      <section className="bg-white py-20"><div className="container-site"><WhyGrid /></div></section>
      <section className="bg-surface py-20">
        <div className="container-site grid gap-10 lg:grid-cols-2">
          <SectionHead eyebrow="Our commitments" title="What you can expect from us" />
          <ul className="space-y-4 text-lg">
            <CheckItem>We'll explain recommendations in plain language.</CheckItem>
            <CheckItem>We won't promise guaranteed rankings or results.</CheckItem>
            <CheckItem>Your ad accounts, analytics and data stay in your ownership.</CheckItem>
            <CheckItem>We'll never use fake reviews or misleading tactics.</CheckItem>
            <CheckItem>We'll report regularly on the metrics that matter to you.</CheckItem>
          </ul>
        </div>
      </section>
      <CtaBand />
    </>
  ),
});
