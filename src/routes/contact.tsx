import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { ContactOptions, PageHero } from "@/components/site/Layout";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { siteConfig, hasEmail } from "@/lib/site-config";

export const Route = createFileRoute("/contact")({
  head: () =>
    seo({
      title: "Contact Digital Marketing Agency – Get a Free Growth Consultation",
      description:
        "Get in touch with Digital Marketing Agency. Share your requirements for SEO, Google Ads, social media, or website development and receive a strategic plan.",
      path: "/contact",
    }),
  component: () => (
    <>
      <PageHero eyebrow="Contact us" title="Let's talk about your growth" text="Share your requirements and our team will review them and get back to you." />
      <section className="container-site grid gap-10 py-20 lg:grid-cols-[1fr_1.5fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border bg-card p-6 shadow-card">
            <h2 className="text-xl font-bold">Other ways to reach us</h2>
            <p className="mt-2 text-sm text-muted-foreground">Our phone and WhatsApp lines are being set up. For now, the enquiry form is the best way to reach us.</p>
            <div className="mt-5"><ContactOptions location="contact_page" /></div>
            {hasEmail() && <p className="mt-4 text-sm">Email: <a className="font-semibold text-primary" href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a></p>}
          </div>
          <div className="rounded-2xl border bg-card p-6 shadow-card">
            <h2 className="text-xl font-bold">Service area</h2>
            <p className="mt-2 text-sm text-muted-foreground">We work with businesses across Pan India, collaborating online through calls and shared reports.</p>
          </div>
        </div>
        <EnquiryForm />
      </section>
    </>
  ),
});
