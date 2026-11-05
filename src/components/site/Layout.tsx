import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, X, Phone, MessageCircle, ArrowRight, Check } from "lucide-react";
import { siteConfig, hasPhone, hasWhatsApp } from "@/lib/site-config";
import { services, type Service } from "@/lib/services";
import { pushEvent, trackCta } from "@/lib/tracking";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
        <rect width="40" height="40" rx="10" fill="var(--navy)" />
        <path d="M9 29 L18 20 L23 25 L31 12" stroke="var(--primary-glow)" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M25 11 H32 V18" stroke="var(--primary-glow)" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="leading-tight">
        <span className={`block text-lg font-extrabold tracking-tight ${light ? "text-navy-foreground" : "text-navy"}`}>DMA</span>
        <span className={`block text-[10px] font-semibold uppercase tracking-[0.16em] ${light ? "text-navy-foreground/70" : "text-muted-foreground"}`}>Digital Marketing Agency</span>
      </span>
    </span>
  );
}

const nav = [
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/why-choose-us", label: "Why Us" },
  { to: "/our-process", label: "Process" },
  { to: "/industries", label: "Industries" },
  { to: "/blog", label: "Resources" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur">
      <div className="container-site flex h-18 items-center justify-between py-3">
        <Link to="/" aria-label="Digital Marketing Agency home"><Logo /></Link>
        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary" activeProps={{ className: "text-primary" }}>{n.label}</Link>
          ))}
        </nav>
        <div className="hidden lg:block"><BtnLink to="/contact" onClick={() => trackCta("Get a Free Consultation", "header")}>Get a Free Consultation</BtnLink></div>
        <button className="rounded-md p-2 lg:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav aria-label="Mobile" className="border-t bg-background lg:hidden">
          <div className="container-site flex flex-col py-3">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="py-3 font-medium">{n.label}</Link>
            ))}
            <Link to="/contact" onClick={() => setOpen(false)} className="py-3 font-semibold text-primary">Contact Us</Link>
          </div>
        </nav>
      )}
    </header>
  );
}

export function BtnLink({ to, children, variant = "primary", onClick, params }: { to: string; children: ReactNode; variant?: "primary" | "outline" | "light"; onClick?: () => void; params?: Record<string, string> }) {
  const styles = {
    primary: "bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-95",
    outline: "border border-input bg-background text-navy hover:border-primary hover:text-primary",
    light: "bg-background text-navy hover:bg-secondary",
  }[variant];
  return (
    <Link to={to as "/"} params={params as never} onClick={onClick} className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-all ${styles}`}>
      {children}
    </Link>
  );
}

export function ContactOptions({ location, light = false }: { location: string; light?: boolean }) {
  const { phone, whatsapp } = siteConfig.contact;
  const base = `inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium ${light ? "border-navy-foreground/25 text-navy-foreground" : "text-navy"}`;
  return (
    <div className="flex flex-wrap gap-3">
      {hasPhone() ? (
        <a href={`tel:${phone}`} className={base} onClick={() => pushEvent({ event: "phone_click", link_location: location })}><Phone className="h-4 w-4" /> Call us</a>
      ) : (
        <span className={`${base} border-dashed opacity-80`} title="Phone number pending configuration"><Phone className="h-4 w-4" /> Phone: coming soon</span>
      )}
      {hasWhatsApp() ? (
        <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className={base} onClick={() => pushEvent({ event: "whatsapp_click", link_location: location })}><MessageCircle className="h-4 w-4" /> WhatsApp</a>
      ) : (
        <span className={`${base} border-dashed opacity-80`} title="WhatsApp number pending configuration"><MessageCircle className="h-4 w-4" /> WhatsApp: coming soon</span>
      )}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-gradient-navy text-navy-foreground">
      <div className="container-site grid gap-10 py-16 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo light />
          <p className="mt-4 text-sm text-navy-foreground/75">{siteConfig.tagline}</p>
          <p className="mt-2 text-sm text-navy-foreground/75">Serving businesses across Pan India.</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-navy-foreground">Services</h2>
          <ul className="mt-4 space-y-2 text-sm text-navy-foreground/75">
            {services.slice(0, 6).map((s) => (
              <li key={s.slug}><Link to="/services/$slug" params={{ slug: s.slug }} className="hover:text-navy-foreground">{s.shortName}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-navy-foreground">More services</h2>
          <ul className="mt-4 space-y-2 text-sm text-navy-foreground/75">
            {services.slice(6).map((s) => (
              <li key={s.slug}><Link to="/services/$slug" params={{ slug: s.slug }} className="hover:text-navy-foreground">{s.shortName}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-navy-foreground">Company</h2>
          <ul className="mt-4 space-y-2 text-sm text-navy-foreground/75">
            {[...nav, { to: "/contact", label: "Contact Us" }, { to: "/privacy-policy", label: "Privacy Policy" }].map((n) => (
              <li key={n.to}><Link to={n.to} className="hover:text-navy-foreground">{n.label}</Link></li>
            ))}
          </ul>
          <div className="mt-5"><ContactOptions location="footer" light /></div>
        </div>
      </div>
      <div className="border-t border-navy-foreground/10">
        <p className="container-site py-6 text-xs text-navy-foreground/60">© {new Date().getFullYear()} Digital Marketing Agency. All rights reserved.</p>
      </div>
    </footer>
  );
}

export function PageHero({ eyebrow, title, text, children }: { eyebrow: string; title: string; text: string; children?: ReactNode }) {
  return (
    <section className="bg-gradient-hero border-b">
      <div className="container-site animate-rise py-16 md:py-24">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-extrabold md:text-5xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{text}</p>
        {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
      </div>
    </section>
  );
}

export function SectionHead({ eyebrow, title, text, center = false }: { eyebrow: string; title: string; text?: string; center?: boolean }) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-bold md:text-4xl">{title}</h2>
      {text && <p className="mt-4 text-muted-foreground">{text}</p>}
    </div>
  );
}

export function ServiceCard({ s }: { s: Service }) {
  const Icon = s.icon;
  return (
    <Link to="/services/$slug" params={{ slug: s.slug }} className="card-lift group flex flex-col rounded-2xl border bg-card p-6 shadow-card">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground"><Icon className="h-6 w-6" aria-hidden="true" /></span>
      <h3 className="mt-5 text-lg font-bold">{s.shortName}</h3>
      <p className="mt-2 flex-1 text-sm text-muted-foreground">{s.summary}</p>
      <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary">Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
    </Link>
  );
}

export function Faqs({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y rounded-2xl border bg-card shadow-card">
      {items.map((f) => (
        <details key={f.q} className="group p-6">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-navy">
            {f.q}
            <span className="text-primary transition-transform group-open:rotate-45" aria-hidden="true">+</span>
          </summary>
          <p className="mt-3 text-muted-foreground">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export function CtaBand({ title = "Ready to grow your business online?", text = "Tell us about your goals and we'll get back to you with practical recommendations — no obligation." }: { title?: string; text?: string }) {
  return (
    <section className="container-site py-20">
      <div className="rounded-3xl bg-gradient-navy p-10 text-center md:p-16">
        <h2 className="text-3xl font-bold text-navy-foreground md:text-4xl">{title}</h2>
        <p className="mx-auto mt-4 max-w-xl text-navy-foreground/80">{text}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <BtnLink to="/contact" variant="light" onClick={() => trackCta("Send an Enquiry", "cta_band")}>Send an Enquiry <ArrowRight className="h-4 w-4" /></BtnLink>
        </div>
        <div className="mt-6 flex justify-center"><ContactOptions location="cta_band" light /></div>
      </div>
    </section>
  );
}

export function CheckItem({ children }: { children: ReactNode }) {
  return <li className="flex gap-3"><Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" /><span>{children}</span></li>;
}
