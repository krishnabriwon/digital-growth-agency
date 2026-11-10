import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { getPost } from "@/lib/content";
import { CtaBand } from "@/components/site/Layout";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    if (!getPost(params.slug)) throw notFound();
    return { slug: params.slug };
  },
  head: ({ params, loaderData }) => {
    const p = loaderData ? getPost(loaderData.slug) : undefined;
    if (!p) return { meta: [{ title: "Article not found | Digital Marketing Agency" }, { name: "robots", content: "noindex" }] };
    return {
      ...seo({ title: p.title, description: p.description, path: `/blog/${params.slug}`, type: "article" }),
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: p.title,
            description: p.description,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://digital-growth-agency-nine.vercel.app/blog/${params.slug}`,
            },
            author: {
              "@type": "Organization",
              name: "Digital Marketing Agency",
              url: "https://digital-growth-agency-nine.vercel.app",
            },
            publisher: {
              "@type": "Organization",
              name: "Digital Marketing Agency",
              logo: "https://digital-growth-agency-nine.vercel.app/logo.png",
            },
          }),
        },
      ],
    };
  },
  notFoundComponent: () => <div className="container-site py-24 text-center"><h1 className="text-3xl font-bold">Article not found</h1><Link to="/blog" className="mt-6 inline-block font-semibold text-primary">Back to resources</Link></div>,
  errorComponent: () => <div className="container-site py-24 text-center"><h1 className="text-2xl font-bold">This article couldn't load</h1></div>,
  component: Post,
});

function Post() {
  const p = getPost(Route.useLoaderData().slug);
  if (!p) throw notFound();
  return (
    <>
      <div className="bg-white">
        <article className="container-site max-w-3xl py-16 md:py-24">
          <Link to="/blog" className="text-sm font-semibold text-primary">← All resources</Link>
          <p className="eyebrow mt-6">{p.category} · {p.readTime}</p>
          <h1 className="mt-3 text-4xl font-extrabold md:text-5xl">{p.title}</h1>
          <p className="mt-5 text-lg text-muted-foreground">{p.description}</p>
          {p.sections.map((s) => (
            <section key={s.heading} className="mt-10">
              <h2 className="text-2xl font-bold">{s.heading}</h2>
              {s.body.map((b) => <p key={b} className="mt-4 leading-relaxed">{b}</p>)}
            </section>
          ))}
        </article>
      </div>
      <CtaBand />
    </>
  );
}
