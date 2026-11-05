import {
  Target,
  LineChart,
  Users,
  Eye,
  Layers,
  Handshake,
  HeartPulse,
  GraduationCap,
  Building2,
  ShoppingBag,
  Factory,
  Plane,
  Landmark,
  UtensilsCrossed,
  Cpu,
  Car,
  Briefcase,
  Dumbbell,
  type LucideIcon,
} from "lucide-react";

export const whyChooseUs: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Target, title: "Goal-first strategy", text: "Every plan starts with your business goals, not a fixed package. We recommend only what fits." },
  { icon: Eye, title: "Transparent reporting", text: "Clear reports in plain language, focused on enquiries, sales and cost — not vanity metrics." },
  { icon: LineChart, title: "Data-informed decisions", text: "Accurate tracking guides where budget goes and what we improve next." },
  { icon: Layers, title: "Integrated expertise", text: "Search, social, content, web and automation planned together as one connected system." },
  { icon: Users, title: "Dedicated point of contact", text: "A single, accountable contact who understands your business and keeps work moving." },
  { icon: Handshake, title: "Ethical practices", text: "No fake reviews, no guaranteed-ranking promises, no hidden fees. You own your accounts and data." },
];

export const processSteps = [
  { title: "Discovery", text: "We learn about your business, audience, competitors and goals through a focused consultation." },
  { title: "Audit & research", text: "We review your current website, channels and tracking to identify gaps and opportunities." },
  { title: "Strategy", text: "We present a clear plan with priorities, channels, timelines and the metrics we will measure." },
  { title: "Execution", text: "Our team sets up tracking, builds campaigns and content, and launches with care." },
  { title: "Optimisation", text: "We monitor performance, test improvements and reallocate effort to what works best." },
  { title: "Reporting & growth", text: "Regular reviews keep you informed and help us plan the next stage of growth together." },
];

export const industries: { icon: LucideIcon; name: string; text: string }[] = [
  { icon: HeartPulse, name: "Healthcare & Clinics", text: "Patient acquisition with local visibility, trust-building content and compliant advertising." },
  { icon: GraduationCap, name: "Education & EdTech", text: "Admissions and enrolment campaigns for institutes, coaching centres and online courses." },
  { icon: Building2, name: "Real Estate", text: "Project launches, site-visit lead generation and location-focused campaigns." },
  { icon: ShoppingBag, name: "E-commerce & D2C", text: "Full-funnel growth for online stores, from product discovery to repeat purchases." },
  { icon: Factory, name: "Manufacturing & B2B", text: "Search and content strategies that reach procurement teams and decision-makers." },
  { icon: Plane, name: "Travel & Hospitality", text: "Bookings-focused campaigns for hotels, resorts, tour operators and travel agencies." },
  { icon: Landmark, name: "Finance & Professional Services", text: "Credibility-led marketing for advisors, CA firms, insurance and legal practices." },
  { icon: UtensilsCrossed, name: "Restaurants & Food", text: "Local discovery, social presence and reputation management for food brands." },
  { icon: Cpu, name: "Technology & SaaS", text: "Demand generation and content marketing for software and IT service companies." },
  { icon: Car, name: "Automotive", text: "Dealership and service-centre campaigns that drive enquiries and test drives." },
  { icon: Briefcase, name: "Startups & SMEs", text: "Practical, budget-conscious plans that build visibility from the ground up." },
  { icon: Dumbbell, name: "Fitness & Wellness", text: "Membership and appointment campaigns for gyms, studios and wellness brands." },
];

export const benefits = [
  { title: "Reach customers where they search", text: "Most buying journeys in India now begin online — on Google, YouTube, Instagram and marketplaces." },
  { title: "Measure what matters", text: "Unlike traditional media, digital channels show exactly which efforts generate enquiries." },
  { title: "Control your budget", text: "Start with what you can afford and scale the channels that prove their value." },
  { title: "Target precisely", text: "Reach audiences by location, interest, intent and behaviour across Pan India." },
];

export const homeFaqs = [
  { q: "What services does Digital Marketing Agency offer?", a: "We offer SEO, Google Ads, social media marketing, Meta Ads, website design and development, content marketing, email marketing, online reputation management, local SEO, e-commerce marketing, AI-powered marketing and lead generation." },
  { q: "Do you work with businesses outside major cities?", a: "Yes. We work with businesses across Pan India. Most of our collaboration happens online through calls, shared dashboards and regular reports." },
  { q: "How much do your services cost?", a: "Pricing depends on your goals, the channels involved and the scope of work. After understanding your requirements, we share a clear proposal with no hidden fees." },
  { q: "Do you guarantee results?", a: "We do not make guarantees about rankings or specific numbers, because outcomes depend on many factors outside any agency's control. We do commit to a transparent process, best-practice execution and honest reporting." },
  { q: "Will I own my ad accounts and data?", a: "Yes. Ad accounts, analytics and website assets are set up under your business ownership, with access granted to our team." },
  { q: "How do we get started?", a: "Send us an enquiry through the contact form. We will review your requirements and get in touch to schedule a consultation." },
];

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  sections: { heading: string; body: string[] }[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "seo-vs-google-ads-which-is-right-for-your-business",
    title: "SEO vs Google Ads: Which Is Right for Your Business?",
    description: "Understand how SEO and Google Ads differ in cost, speed and long-term value — and how to decide where to invest first.",
    category: "Search Marketing",
    readTime: "6 min read",
    sections: [
      { heading: "Two ways to appear on Google", body: ["SEO earns your website a place in the organic results, while Google Ads lets you pay for placement in the sponsored results. Both target people actively searching, which makes them among the highest-intent channels available.", "The key differences lie in speed, cost structure and how long the results last."] },
      { heading: "When Google Ads makes sense", body: ["Ads are ideal when you need visibility quickly — for a launch, a seasonal offer, or while organic rankings are still developing. They also let you test which keywords and messages convert before investing in long-term content.", "The trade-off is that traffic stops as soon as spend stops, and competitive keywords can be expensive."] },
      { heading: "When SEO makes sense", body: ["SEO is a long-term investment. It takes time to build, but well-ranking pages continue to bring visitors without a cost per click. It also improves your website for every visitor, regardless of where they come from."] },
      { heading: "The practical answer: use both strategically", body: ["Many businesses start with Google Ads for immediate enquiries while building SEO in parallel. Over time, data from ads informs SEO priorities, and growing organic traffic reduces reliance on paid clicks. The right balance depends on your budget, timeline and competition."] },
    ],
  },
  {
    slug: "google-business-profile-checklist-for-local-businesses",
    title: "A Google Business Profile Checklist for Local Businesses",
    description: "A practical checklist to help local businesses in India improve their visibility on Google Maps and local search.",
    category: "Local SEO",
    readTime: "5 min read",
    sections: [
      { heading: "Why your profile matters", body: ["For many local searches, your Google Business Profile is the first thing a customer sees — often before your website. A complete, accurate profile makes it easier for customers to choose you and for Google to show you."] },
      { heading: "Get the basics right", body: ["Use your real business name without extra keywords. Choose the most accurate primary category and relevant secondary categories. Make sure your address or service area, phone number, website and opening hours are correct and consistent with your website and other listings."] },
      { heading: "Add depth and freshness", body: ["List your services with clear descriptions, upload genuine photos of your premises, team and work, and publish posts about offers or updates. Answer common questions in the Q&A section."] },
      { heading: "Build genuine reviews", body: ["Ask satisfied customers for honest reviews and respond professionally to every review, positive or negative. Never buy or fabricate reviews — it violates Google's policies and can lead to penalties."] },
    ],
  },
  {
    slug: "how-to-set-up-conversion-tracking-before-running-ads",
    title: "Why You Should Set Up Conversion Tracking Before Running Ads",
    description: "Running ads without accurate conversion tracking means guessing. Here's what to track and why it matters.",
    category: "Analytics",
    readTime: "5 min read",
    sections: [
      { heading: "Clicks are not results", body: ["Ad platforms report clicks and impressions by default, but what matters to your business are enquiries, calls and sales. Without conversion tracking, platforms cannot optimise for those outcomes, and you cannot judge which campaigns are worth the spend."] },
      { heading: "What to track", body: ["Track confirmed actions: a form submission that was actually received, a purchase that completed, or a call from a tracked number. Avoid counting button clicks as leads — a click on 'Submit' does not mean an enquiry arrived."] },
      { heading: "Use a tag manager", body: ["Google Tag Manager lets you manage GA4, Google Ads and other tags in one place without editing website code for every change. Pair it with a clear dataLayer naming convention so events stay consistent."] },
      { heading: "Verify before you spend", body: ["Test every conversion end to end before launching campaigns. Accurate data from day one means every rupee of ad spend teaches you something useful."] },
    ],
  },
];

export const getPost = (slug: string) => blogPosts.find((p) => p.slug === slug);
