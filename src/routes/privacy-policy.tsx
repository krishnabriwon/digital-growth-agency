import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { PageHero } from "@/components/site/Layout";

const sections = [
  { h: "Information we collect", p: "When you submit our enquiry form, we collect the details you provide: your name, business email, contact number, company name (optional), the service you're interested in and your message. Please do not include passwords, payment details or sensitive personal information in your message." },
  { h: "How we use your information", p: "We use your enquiry details only to respond to your request, understand your requirements and communicate with you about our services. We do not sell or rent your personal information." },
  { h: "Cookies and analytics", p: "Google Analytics, Google Tag Manager and Google Ads tracking are not currently configured. If enabled later, these tools may process device information, page visits and campaign interactions, and this policy will need updating before activation. Your browser's session storage remembers a successful enquiry in the current tab; it does not contain your form details." },
  { h: "Data storage and security", p: "Enquiries are stored securely with access limited to authorised team members. We take reasonable measures to protect your information from unauthorised access." },
  { h: "Service providers", p: "Lovable Cloud provides the website's enquiry storage. Hosting and storage providers process information needed to operate the website. No marketing mailing list subscription is created when you send an enquiry." },
  { h: "Retention", p: "Enquiry information is used to manage your request and any resulting service discussions. You can use the contact form to request deletion or ask about the retention of your specific enquiry. A fixed retention schedule has not yet been published." },
  { h: "Your rights", p: "You may request access to, correction of, or deletion of the personal information you have shared with us by contacting us through the enquiry form." },
  { h: "Changes to this policy", p: "We may update this policy from time to time. Changes will be posted on this page." },
];

export const Route = createFileRoute("/privacy-policy")({
  head: () => seo({ title: "Privacy Policy", description: "How Digital Marketing Agency collects, uses and protects the information you share through our website and enquiry form.", path: "/privacy-policy" }),
  component: () => (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" text="Your privacy matters to us. This policy explains what we collect and how we use it." />
      <section className="container-site max-w-3xl py-16">
        {sections.map((s) => (
          <div key={s.h} className="mb-10"><h2 className="text-2xl font-bold">{s.h}</h2><p className="mt-3 leading-relaxed">{s.p}</p></div>
        ))}
      </section>
    </>
  ),
});
