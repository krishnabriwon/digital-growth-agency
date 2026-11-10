import { createFileRoute, Link } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { blogPosts } from "@/lib/content";
import { CtaBand, PageHero } from "@/components/site/Layout";

export const Route = createFileRoute("/blog/")({
  head: () =>
    seo({
      title: "Digital Marketing Insights & Strategy Guides | Blog & Resources",
      description:
        "Actionable digital marketing guides on SEO, Google Ads, local search optimization, and conversion tracking for ambitious business owners in India.",
      path: "/blog",
    }),
  component: () => (
    <>
      <PageHero eyebrow="Resources" title="Practical guides for growing online" text="Clear, useful insights to help you make better digital marketing decisions." />
      <section className="bg-white py-20">
        <div className="container-site grid gap-6 md:grid-cols-3">
          {blogPosts.map((p) => (
            <Link key={p.slug} to="/blog/$slug" params={{ slug: p.slug }} className="card-lift flex flex-col rounded-2xl border bg-card p-6 shadow-card">
              <span className="eyebrow">{p.category}</span>
              <h2 className="mt-3 text-xl font-bold">{p.title}</h2>
              <p className="mt-3 flex-1 text-sm text-muted-foreground">{p.description}</p>
              <span className="mt-5 text-xs text-muted-foreground">{p.readTime}</span>
            </Link>
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  ),
});
