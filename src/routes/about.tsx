import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { CheckItem, CtaBand, PageHero, SectionHead } from "@/components/site/Layout";
import { WhyGrid } from "@/components/site/Sections";

export const Route = createFileRoute("/about")({
  head: () => seo({ title: "About Us", description: "Learn about Digital Marketing Agency — a new, outcome-focused digital marketing partner for businesses across Pan India, built on transparency and ethical practice.", path: "/about" }),
  component: () => (
    <>
      <PageHero eyebrow="About us" title="A digital partner built for measurable growth" text="Digital Marketing Agency was founded to give Indian businesses a marketing partner that is strategic, transparent and genuinely invested in their results." />
      <section className="container-site grid gap-12 py-20 lg:grid-cols-2">
        <div>
          <SectionHead eyebrow="Our story" title="Why we started" />
          <div className="mt-6 space-y-4 text-muted-foreground">
            <p>Many businesses invest in digital marketing without clarity on what's working. Reports are full of impressions and likes, while the real question — is this bringing in customers? — goes unanswered.</p>
            <p>We are a new agency built to change that. We focus on the fundamentals: clear goals, accurate tracking, quality execution and honest communication. We'd rather earn your trust through transparent work than impress you with inflated promises.</p>
          </div>
        </div>
        <div className="grid gap-6">
          <div className="rounded-2xl border bg-card p-6 shadow-card"><h3 className="text-lg font-bold">Our mission</h3><p className="mt-2 text-muted-foreground">To help businesses across India grow online through strategy-led, measurable and ethical digital marketing.</p></div>
          <div className="rounded-2xl border bg-card p-6 shadow-card"><h3 className="text-lg font-bold">Our vision</h3><p className="mt-2 text-muted-foreground">To be the trusted growth partner businesses recommend for clarity, quality and integrity.</p></div>
          <div className="rounded-2xl border bg-card p-6 shadow-card"><h3 className="text-lg font-bold">Our values</h3>
            <ul className="mt-3 space-y-2"><CheckItem>Honesty over hype</CheckItem><CheckItem>Outcomes over activity</CheckItem><CheckItem>Clarity in every conversation</CheckItem><CheckItem>Continuous learning</CheckItem></ul>
          </div>
        </div>
      </section>
      <section className="bg-surface py-20"><div className="container-site"><SectionHead eyebrow="What sets us apart" title="How we work with clients" center /><div className="mt-12"><WhyGrid /></div></div></section>
      <CtaBand />
    </>
  ),
});
