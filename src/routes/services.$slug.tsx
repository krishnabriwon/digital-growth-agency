import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { seo } from "@/lib/seo";
import { getService } from "@/lib/services";
import { BtnLink, CtaBand, Faqs, PageHero, SectionHead, ServiceCard } from "@/components/site/Layout";
import { ProcessGrid } from "@/components/site/Sections";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { trackCta } from "@/lib/tracking";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = getService(params.slug);
    if (!service) throw notFound();
    return { slug: service.slug };
  },
  head: ({ params, loaderData }) => {
    const s = loaderData ? getService(loaderData.slug) : undefined;
    if (!s) return { meta: [{ title: "Service not found | Digital Marketing Agency" }, { name: "robots", content: "noindex" }] };
    return {
      ...seo({ title: s.seoTitle, description: s.seoDescription, path: `/services/${params.slug}`, type: "article" }),
      scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "Service", name: s.name, description: s.seoDescription, provider: { "@type": "Organization", name: "Digital Marketing Agency" }, areaServed: "IN" }) }],
    };
  },
  notFoundComponent: () => (
    <div className="container-site py-24 text-center"><h1 className="text-3xl font-bold">Service not found</h1><Link to="/services" className="mt-6 inline-block font-semibold text-primary">View all services</Link></div>
  ),
  errorComponent: () => <div className="container-site py-24 text-center"><h1 className="text-2xl font-bold">This page couldn't load</h1></div>,
  component: ServicePage,
});

function ServicePage() {
  const { slug } = Route.useLoaderData();
  const s = getService(slug)!;
  const Icon = s.icon;
  return (
    <>
      <PageHero eyebrow={s.shortName} title={s.heroTitle} text={s.heroText}>
        <BtnLink to="/contact" onClick={() => trackCta(`Enquire – ${s.shortName}`, "service_hero")}>Enquire about {s.shortName} <ArrowRight className="h-4 w-4" /></BtnLink>
        <BtnLink to="/services" variant="outline">All services</BtnLink>
      </PageHero>

      <section className="container-site grid gap-10 py-20 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground"><Icon className="h-7 w-7" aria-hidden="true" /></span>
          <h2 className="mt-5 text-3xl font-bold">What is {s.name}?</h2>
        </div>
        <div className="space-y-4 text-lg text-muted-foreground">{s.overview.map((p) => <p key={p}>{p}</p>)}</div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-site">
          <SectionHead eyebrow="Benefits" title={`How ${s.shortName} helps your business`} center />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {s.benefits.map((b) => <div key={b.title} className="rounded-2xl border bg-card p-6 shadow-card"><h3 className="font-bold">{b.title}</h3><p className="mt-2 text-sm text-muted-foreground">{b.text}</p></div>)}
          </div>
        </div>
      </section>

      <section className="container-site py-20">
        <SectionHead eyebrow="Our approach" title="How we deliver" center />
        <div className="mt-12"><ProcessGrid steps={s.approach} /></div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-site max-w-4xl">
          <SectionHead eyebrow="FAQs" title={`${s.shortName} questions, answered`} center />
          <div className="mt-10"><Faqs items={s.faqs} /></div>
        </div>
      </section>

      <section className="container-site grid gap-10 py-20 lg:grid-cols-[1fr_1.3fr]">
        <SectionHead eyebrow="Enquire" title={`Let's discuss your ${s.shortName} goals`} text="Share a few details and our team will review your requirements and get in touch." />
        <EnquiryForm defaultService={s.name} />
      </section>

      <section className="bg-surface py-20">
        <div className="container-site">
          <SectionHead eyebrow="Related services" title="Services that work well together" center />
          <div className="mt-12 grid gap-6 md:grid-cols-3">{s.related.map((r) => { const rs = getService(r); return rs ? <ServiceCard key={r} s={rs} /> : null; })}</div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
