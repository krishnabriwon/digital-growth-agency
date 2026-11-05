import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { seo } from "@/lib/seo";
import { BtnLink, ContactOptions } from "@/components/site/Layout";
import { pushEvent } from "@/lib/tracking";

export const Route = createFileRoute("/thank-you")({
  head: () => seo({ title: "Thank You", description: "Your enquiry has been received by Digital Marketing Agency.", path: "/thank-you", noindex: true }),
  component: ThankYou,
});

function ThankYou() {
  useEffect(() => { pushEvent({ event: "thank_you_view" }); }, []);
  return (
    <section className="bg-gradient-hero">
      <div className="container-site flex min-h-[70vh] max-w-2xl flex-col items-center justify-center py-20 text-center animate-rise">
        <CheckCircle2 className="h-16 w-16 text-success" aria-hidden="true" />
        <h1 className="mt-6 text-4xl font-extrabold">Thank you — your enquiry is in</h1>
        <p className="mt-4 text-lg text-muted-foreground">We've received your details. Our team will review your requirements and get in touch with you soon.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <BtnLink to="/">Back to Home</BtnLink>
          <BtnLink to="/services" variant="outline">Explore Services</BtnLink>
        </div>
        <div className="mt-6"><ContactOptions location="thank_you" /></div>
      </div>
    </section>
  );
}
