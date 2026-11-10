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
  {
    slug: "how-to-choose-the-best-digital-marketing-agency-in-india",
    title: "How to Choose the Best Digital Marketing Agency in India (2026 Guide)",
    description: "Looking for a reliable digital marketing agency in India? Here are the critical criteria to evaluate before hiring a growth partner.",
    category: "Agency Selection",
    readTime: "7 min read",
    sections: [
      {
        heading: "Why choosing the right digital marketing agency matters",
        body: [
          "With thousands of agencies operating across India, finding the right growth partner can feel overwhelming. Many agencies promise instant page-one rankings or overnight viral leads, but few deliver transparent, measurable business returns.",
          "Choosing the right agency means finding a team that aligns with your specific industry, communicates clearly without jargon, and treats your marketing budget with accountability."
        ],
      },
      {
        heading: "1. Demand transparent reporting and full account ownership",
        body: [
          "Always ensure that your Google Ads, Meta Business Manager, and Google Analytics accounts belong strictly to your company. A credible digital marketing agency will never hold your ad accounts or data hostage.",
          "Look for agencies that report on business outcomes — cost per qualified lead, conversion rate, and revenue impact — rather than superficial vanity metrics like impressions or raw clicks."
        ],
      },
      {
        heading: "2. Verify multi-channel expertise across search and social",
        body: [
          "Search engines and social media channels don't operate in silos. Your SEO should inform your paid Google Ads keywords, and your content should fuel both social media and email nurture sequences.",
          "An integrated digital marketing company in India coordinates search, paid performance, and web development into one cohesive growth strategy."
        ],
      },
      {
        heading: "3. Avoid guaranteed ranking promises",
        body: [
          "Google's search algorithm evolves constantly with hundreds of ranking factors. No agency in the world has a direct relationship with Google that allows them to guarantee position #1.",
          "Ethical agencies focus on sustainable technical foundations, authoritative content, clean backlinks, and continuous Conversion Rate Optimization (CRO)."
        ],
      },
    ],
  },
  {
    slug: "complete-seo-strategy-for-indian-businesses",
    title: "The Complete SEO Strategy for Indian Businesses: From Audit to Page 1",
    description: "A comprehensive, step-by-step SEO roadmap designed for businesses in India looking to capture organic search traffic and qualified leads.",
    category: "Search Marketing",
    readTime: "8 min read",
    sections: [
      {
        heading: "Understanding the Indian search landscape",
        body: [
          "With over 800 million active internet users in India, consumers and B2B buyers now turn to Google for every purchasing decision. Whether it's finding specialized healthcare, B2B manufacturing, SaaS solutions, or local services, organic search offers compounding ROI.",
          "Winning in organic search requires more than just sprinkling keywords — it requires technical excellence, high-value content, and rock-solid local signals."
        ],
      },
      {
        heading: "Phase 1: Technical SEO foundation",
        body: [
          "Ensure your website is fast, mobile-first, and easily crawlable by Googlebot. This includes clean XML sitemaps, robots.txt directives, absolute canonical URLs, and Schema.org structured data (Organization, LocalBusiness, and Service schemas).",
          "Core Web Vitals — Largest Contentful Paint (LCP), Interaction to Next Paint (INP), and Cumulative Layout Shift (CLS) — are direct ranking factors that affect your organic positioning."
        ],
      },
      {
        heading: "Phase 2: Intent-focused keyword mapping",
        body: [
          "Group your keywords into informational, commercial, and transactional intent. High-intent keywords (like 'SEO services India' or 'digital marketing company') should map to dedicated, high-converting service landing pages with clear calls to action.",
          "Informational queries should be addressed through in-depth blog guides, solving customer questions and building topical authority."
        ],
      },
      {
        heading: "Phase 3: High-authority link acquisition and digital PR",
        body: [
          "Earn links from reputable Indian industry publications, niche directories, and partner organizations. Avoid spammy link networks or bulk directory submissions that risk Google algorithmic penalties."
        ],
      },
    ],
  },
  {
    slug: "google-ads-vs-meta-ads-for-lead-generation",
    title: "Google Ads vs Meta Ads: Which Paid Channel Delivers Better ROI in India?",
    description: "Compare Google Search Ads and Meta (Facebook & Instagram) Ads to discover the best ad channel for your budget, industry, and lead generation goals.",
    category: "Paid Advertising",
    readTime: "6 min read",
    sections: [
      {
        heading: "Intent vs Disruption: The core distinction",
        body: [
          "Google Ads captures high intent: users are actively typing what they want into Google (e.g. 'hire digital marketing agency'). They are already in the buying mindset.",
          "Meta Ads (Instagram and Facebook) creates interest through disruption: users are browsing their social feeds, and visually compelling creative introduces your brand to potential customers based on demographics, interests, and behaviors."
        ],
      },
      {
        heading: "When to choose Google Ads",
        body: [
          "Google Ads is unbeatable for high-intent B2B services, emergency needs, healthcare, education admissions, and local services where prospects need immediate assistance.",
          "Cost per click (CPC) can be higher in competitive industries, but conversion rates are typically strong because the user initiated the search."
        ],
      },
      {
        heading: "When to choose Meta Ads",
        body: [
          "Meta Ads excels for visually appealing consumer brands, lifestyle offerings, real estate project showcases, webinars, and low-friction lead generation via Instant Forms.",
          "It is also the most cost-effective channel for brand awareness and retargeting website visitors who didn't convert on their first visit."
        ],
      },
      {
        heading: "The hybrid full-funnel approach",
        body: [
          "Top-performing brands in India rarely rely on just one platform. A hybrid strategy uses Meta Ads to build broad brand recall and top-of-funnel interest, while Google Search captures active demand and retargets previous visitors to maximize conversions."
        ],
      },
    ],
  },
];

export const getPost = (slug: string) => blogPosts.find((p) => p.slug === slug);
