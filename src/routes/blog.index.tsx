import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Search, BookOpen } from "lucide-react";
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
  component: BlogIndex,
});

function BlogIndex() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("" );

  const categories = useMemo(() => {
    const set = new Set(blogPosts.map((p) => p.category));
    return ["All", ...Array.from(set)];
  }, []);

  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        query === "" ||
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <>
      <PageHero
        eyebrow="Resources & Knowledge Hub"
        title="Practical digital marketing guides for real growth"
        text="In-depth strategies, step-by-step checklists, and actionable insights on SEO, Google Ads, lead generation, and analytics for businesses in India."
      />

      <section className="bg-white py-16 md:py-20">
        <div className="container-site">
          {/* Controls: Category Filter and Search */}
          <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-surface text-navy hover:bg-secondary"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full rounded-full border bg-surface py-2.5 pl-10 pr-4 text-xs font-medium text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:bg-background"
              />
            </div>
          </div>

          {/* Articles grid */}
          {filteredPosts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((p) => (
                <Link
                  key={p.slug}
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  className="card-lift flex flex-col justify-between rounded-2xl border bg-card p-6 shadow-card"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="eyebrow">{p.category}</span>
                      <span className="text-muted-foreground">{p.readTime}</span>
                    </div>
                    <h2 className="mt-4 text-xl font-bold leading-snug">{p.title}</h2>
                    <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{p.description}</p>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-primary">
                    <BookOpen className="h-3.5 w-3.5" /> Read full article →
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border bg-surface p-12 text-center">
              <p className="text-lg font-bold">No articles found</p>
              <p className="mt-2 text-sm text-muted-foreground">Try searching with different keywords or reset your category filter.</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="mt-4 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
