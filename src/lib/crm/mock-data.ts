import type { Lead, Client, FollowUp, Activity, ServiceItem, TeamMember } from "./types";

export const AGENCY_SERVICES: ServiceItem[] = [
  {
    id: "srv-1",
    name: "Search Engine Optimization (SEO)",
    slug: "seo",
    description: "Data-driven organic search strategy to rank higher and generate consistent inbound leads.",
    isActive: true,
  },
  {
    id: "srv-2",
    name: "Google Ads / PPC Advertising",
    slug: "google-ads",
    description: "High-intent search and shopping campaigns designed for immediate ROI and customer acquisition.",
    isActive: true,
  },
  {
    id: "srv-3",
    name: "Social Media Marketing",
    slug: "social-media",
    description: "Engaging brand presence, community management, and organic social growth across channels.",
    isActive: true,
  },
  {
    id: "srv-4",
    name: "Meta Ads",
    slug: "meta-ads",
    description: "Precision-targeted Facebook and Instagram ad funnels for conversions and e-commerce scaling.",
    isActive: true,
  },
  {
    id: "srv-5",
    name: "Website Design & Development",
    slug: "web-dev",
    description: "High-converting, mobile-first agency websites built on modern tech stacks with fast load times.",
    isActive: true,
  },
  {
    id: "srv-6",
    name: "Content Marketing",
    slug: "content-marketing",
    description: "Thought leadership articles, authoritative guides, and brand storytelling that build customer trust.",
    isActive: true,
  },
  {
    id: "srv-7",
    name: "Email Marketing",
    slug: "email-marketing",
    description: "Automated nurture sequences, newsletter broadcasts, and retention funnels that boost LTV.",
    isActive: true,
  },
  {
    id: "srv-8",
    name: "Online Reputation Management",
    slug: "orm",
    description: "Review monitoring, brand sentiment enhancement, and corporate digital reputation building.",
    isActive: true,
  },
  {
    id: "srv-9",
    name: "Local SEO",
    slug: "local-seo",
    description: "Google Business Profile optimization, local citations, and map pack dominance for local footfall.",
    isActive: true,
  },
  {
    id: "srv-10",
    name: "E-commerce Marketing",
    slug: "ecommerce-marketing",
    description: "Full-funnel catalog ads, Shopify optimization, ROAS scaling, and cart abandonment recovery.",
    isActive: true,
  },
  {
    id: "srv-11",
    name: "AI-Powered Digital Marketing",
    slug: "ai-marketing",
    description: "Automated audience personalization, predictive lead scoring, and generative creative optimization.",
    isActive: true,
  },
  {
    id: "srv-12",
    name: "Lead Generation",
    slug: "lead-generation",
    description: "B2B appointment setting, landing page conversion rate optimization, and qualified sales pipeline creation.",
    isActive: true,
  },
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "user-1",
    name: "Krishna",
    email: "krishna.briwon@gmail.com",
    role: "admin",
    title: "Founder & Managing Director",
    avatar: "KB",
  },
  {
    id: "user-2",
    name: "Rajesh Verma",
    email: "rajesh@dma.agency",
    role: "team_member",
    title: "Senior Growth Specialist",
    avatar: "RV",
  },
  {
    id: "user-3",
    name: "Ananya Patel",
    email: "ananya@dma.agency",
    role: "team_member",
    title: "Performance Marketing Lead",
    avatar: "AP",
  },
  {
    id: "user-4",
    name: "Vikram Malhotra",
    email: "vikram@dma.agency",
    role: "team_member",
    title: "Client Success Manager",
    avatar: "VM",
  },
];

export const INITIAL_LEADS: Lead[] = [];

export const INITIAL_CLIENTS: Client[] = [];

export const INITIAL_FOLLOW_UPS: FollowUp[] = [];

export const INITIAL_ACTIVITIES: Activity[] = [];
