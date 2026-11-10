import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import hero from "@/assets/hero-growth.jpg";
import { seo } from "@/lib/seo";
import { services } from "@/lib/services";
import { benefits, homeFaqs } from "@/lib/content";
import { BtnLink, CheckItem, CtaBand, Faqs, SectionHead, ServiceCard } from "@/components/site/Layout";
import { IndustryGrid, ProcessGrid, WhyGrid } from "@/components/site/Sections";
import { trackCta } from "@/lib/tracking";

export const Route = createFileRoute("/")({
  head: () => ({
    ...seo({
      title: "Digital Marketing Agency – Digital Marketing Company India | DMA",
      description: "Digital Marketing Agency is a premier digital marketing company in India. We drive measurable business growth with SEO services, Google Ads PPC, Meta ads, social media & web development across Pan India.",
      path: "/",
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              "@id": "https://digital-growth-agency-nine.vercel.app/#website",
              "url": "https://digital-growth-agency-nine.vercel.app",
              "name": "Digital Marketing Agency",
              "alternateName": ["DMA", "Digital Growth Agency", "Digital Marketing Agency India", "Digital Growth Agency India", "DMA India"],
              "description": "Leading digital marketing company in India driving business growth through SEO, Google Ads, Meta Ads, social media and web development."
            },
            {
              "@type": "Organization",
              "@id": "https://digital-growth-agency-nine.vercel.app/#organization",
              "name": "Digital Marketing Agency",
              "alternateName": ["DMA", "Digital Growth Agency", "Digital Marketing Agency India", "Digital Growth Agency India", "DMA India"],
              "url": "https://digital-growth-agency-nine.vercel.app",
              "logo": "https://digital-growth-agency-nine.vercel.app/logo.png",
              "slogan": "Driving Digital Growth. Delivering Real Results.",
              "description": "Premier digital marketing agency providing ROI-focused SEO, Google Ads, Meta Ads, social media marketing, and web development across Pan India.",
              "areaServed": {
                "@type": "Country",
                "name": "India"
              },
              "knowsAbout": [
                "Search Engine Optimization",
                "Pay-Per-Click Advertising",
                "Social Media Marketing",
                "Google Ads",
                "Meta Ads",
                "Website Design and Development",
                "Content Marketing",
                "Lead Generation"
              ]
            },
            {
              "@type": "FAQPage",
              "@id": "https://digital-growth-agency-nine.vercel.app/#faq",
              "mainEntity": homeFaqs.map((f) => ({
                "@type": "Question",
                "name": f.q,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": f.a
                }
              }))
            }
          ]
        }),
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <section className="bg-gradient-hero">
        <div className="container-site grid items-center gap-12 py-16 md:py-24 lg:grid-cols-2">
          <div className="animate-rise">
            <p className="eyebrow">Digital marketing across Pan India</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-6xl">Driving Digital Growth. <span className="text-gradient">Delivering Real Results.</span></h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">We help ambitious businesses get found, build trust and turn online attention into genuine enquiries — with strategy-led SEO, advertising, content and websites.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <BtnLink to="/contact" onClick={() => trackCta("Get a Free Consultation", "home_hero")}>Get a Free Consultation <ArrowRight className="h-4 w-4" /></BtnLink>
              <BtnLink to="/services" variant="outline" onClick={() => trackCta("Explore Services", "home_hero")}>Explore Services</BtnLink>
            </div>
          </div>
          <img src={hero} alt="Illustration of digital marketing growth with rising charts, search and analytics dashboards" width={1280} height={1024} className="w-full rounded-3xl" fetchPriority="high" />
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-site grid gap-10 lg:grid-cols-2">
          <SectionHead eyebrow="Who we are" title="A new-generation agency focused on outcomes" />
          <div className="space-y-4 text-muted-foreground">
            <p>Digital Marketing Agency is built for businesses that want marketing to be measurable, honest and tied to real growth. We combine search, social, content and web expertise into one connected strategy.</p>
            <ul className="space-y-3 text-foreground">
              <CheckItem>Strategies tailored to your goals and budget</CheckItem>
              <CheckItem>Accurate tracking so every decision is informed</CheckItem>
              <CheckItem>Clear, jargon-free communication and reporting</CheckItem>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-site">
          <SectionHead eyebrow="Our services" title="Everything you need to grow online" text="Twelve specialised services, planned together so each channel strengthens the others." center />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{services.map((s) => <ServiceCard key={s.slug} s={s} />)}</div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-site">
          <SectionHead eyebrow="Why choose us" title="Built on transparency and accountability" center />
          <div className="mt-12"><WhyGrid /></div>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-site">
          <SectionHead eyebrow="How we work" title="A clear, six-step process" center />
          <div className="mt-12"><ProcessGrid /></div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-site">
          <SectionHead eyebrow="Industries" title="Marketing shaped around your sector" center />
          <div className="mt-12"><IndustryGrid limit={8} /></div>
          <div className="mt-8 text-center"><BtnLink to="/industries" variant="outline">View all industries</BtnLink></div>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-site">
          <SectionHead eyebrow="Why digital" title="The benefits of digital marketing" center />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b) => <div key={b.title} className="rounded-2xl border bg-card p-6"><h3 className="font-bold">{b.title}</h3><p className="mt-2 text-sm text-muted-foreground">{b.text}</p></div>)}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-site max-w-4xl">
          <SectionHead eyebrow="FAQs" title="Frequently asked questions" center />
          <div className="mt-10"><Faqs items={homeFaqs} /></div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
