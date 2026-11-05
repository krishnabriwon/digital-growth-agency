import {
  Search,
  MousePointerClick,
  Share2,
  Megaphone,
  MonitorSmartphone,
  PenLine,
  Mail,
  ShieldCheck,
  MapPin,
  ShoppingCart,
  Sparkles,
  Magnet,
  type LucideIcon,
} from "lucide-react";

export type Service = {
  slug: string;
  name: string;
  shortName: string;
  icon: LucideIcon;
  summary: string;
  seoTitle: string;
  seoDescription: string;
  heroTitle: string;
  heroText: string;
  overview: string[];
  benefits: { title: string; text: string }[];
  approach: { title: string; text: string }[];
  faqs: { q: string; a: string }[];
  related: string[];
};

export const services: Service[] = [
  {
    slug: "seo",
    name: "SEO (Search Engine Optimization)",
    shortName: "SEO",
    icon: Search,
    summary: "Earn sustainable organic visibility on Google with technical, on-page and content-led SEO.",
    seoTitle: "SEO Services in India – Search Engine Optimization",
    seoDescription:
      "Technical, on-page and content-led SEO services for Indian businesses. Improve organic visibility, attract qualified traffic and build long-term search presence.",
    heroTitle: "SEO that builds lasting organic visibility",
    heroText:
      "We help your website become easier for search engines to understand and more useful for the people searching — so qualified visitors find you without paying for every click.",
    overview: [
      "Search Engine Optimization is the practice of improving your website so it ranks for the searches your customers actually make. Done well, it becomes one of the most cost-efficient acquisition channels a business can own, because traffic keeps arriving long after the work is done.",
      "Our SEO service combines technical health checks, keyword and intent research, on-page optimisation and content planning. We focus on searches with genuine commercial value, not vanity rankings, and report on the metrics that connect to enquiries and revenue.",
    ],
    benefits: [
      { title: "Compounding traffic", text: "Organic rankings keep delivering visitors without a per-click cost." },
      { title: "Higher-intent visitors", text: "People searching for your services are already looking for a solution." },
      { title: "Stronger credibility", text: "Appearing prominently in search results builds trust with new buyers." },
      { title: "Better website quality", text: "Technical fixes improve speed, structure and the experience for every visitor." },
    ],
    approach: [
      { title: "SEO audit", text: "Crawl, indexation, speed, structure and content review to find what is holding you back." },
      { title: "Keyword & intent mapping", text: "Map valuable search terms to the right pages based on what searchers want." },
      { title: "On-page & technical fixes", text: "Optimise titles, headings, internal links, schema and site performance." },
      { title: "Content & authority", text: "Plan helpful content and earn relevant mentions that strengthen your domain." },
    ],
    faqs: [
      { q: "How long does SEO take to show results?", a: "SEO is a medium to long-term channel. Early technical improvements can show movement within weeks, while competitive rankings usually take several months of consistent work. Timelines depend on your website's starting point and your market's competition." },
      { q: "Do you guarantee first-page rankings?", a: "No. Search engines control their rankings and no honest agency can guarantee positions. We commit to a transparent process, best-practice work and clear reporting on progress." },
      { q: "Will you need access to my website?", a: "Yes. To implement technical and on-page improvements we typically need access to your CMS, Google Search Console and analytics. We can also work alongside your developer." },
    ],
    related: ["local-seo", "content-marketing", "website-design-development"],
  },
  {
    slug: "google-ads-ppc",
    name: "Google Ads / PPC Advertising",
    shortName: "Google Ads / PPC",
    icon: MousePointerClick,
    summary: "Reach buyers at the moment of search with structured, conversion-focused Google Ads campaigns.",
    seoTitle: "Google Ads & PPC Management Services in India",
    seoDescription:
      "Google Ads and PPC management focused on qualified leads and measurable return. Search, Performance Max, Display and YouTube campaigns with transparent reporting.",
    heroTitle: "Google Ads built around measurable outcomes",
    heroText:
      "Appear in front of people actively searching for what you offer, and spend your budget on the clicks most likely to become enquiries and sales.",
    overview: [
      "Pay-per-click advertising lets you show up at the top of Google for chosen searches and pay only when someone clicks. It is one of the fastest ways to generate demand, but without careful structure and tracking it can also waste budget quickly.",
      "We plan, build and manage Google Ads campaigns around clear goals — leads, calls or sales. That means intent-based keyword research, tightly themed ad groups, relevant landing pages, proper conversion tracking and continuous optimisation of bids, queries and creatives.",
    ],
    benefits: [
      { title: "Immediate visibility", text: "Campaigns can start generating traffic as soon as they are approved." },
      { title: "Precise targeting", text: "Target by keyword, location, device, schedule and audience." },
      { title: "Full budget control", text: "Set daily limits and adjust spend based on real performance." },
      { title: "Measurable return", text: "Conversion tracking connects ad spend to real enquiries." },
    ],
    approach: [
      { title: "Goal & tracking setup", text: "Define conversions and implement reliable tracking before spending." },
      { title: "Research & structure", text: "Build campaigns around intent, with negative keywords from day one." },
      { title: "Ads & landing pages", text: "Write relevant ads and align landing pages to each search theme." },
      { title: "Optimise & report", text: "Refine bids, search terms and creatives with regular, clear reporting." },
    ],
    faqs: [
      { q: "What budget do I need for Google Ads?", a: "It depends on your industry, location and competition. We recommend starting with a budget that allows enough clicks to learn what converts, then scaling what works. We will suggest a realistic starting range during consultation." },
      { q: "Is the ad spend included in your fee?", a: "Ad spend is paid directly to Google from your own account. Our management fee is separate, so you always keep full ownership and visibility of your account." },
      { q: "How soon can campaigns go live?", a: "After goals, tracking and landing pages are ready, campaigns can usually launch within days, subject to Google's ad review." },
    ],
    related: ["lead-generation", "meta-ads", "seo"],
  },
  {
    slug: "social-media-marketing",
    name: "Social Media Marketing",
    shortName: "Social Media Marketing",
    icon: Share2,
    summary: "Build a consistent, recognisable brand presence across the social platforms your audience uses.",
    seoTitle: "Social Media Marketing Services in India",
    seoDescription:
      "Strategic social media marketing for Instagram, Facebook, LinkedIn and YouTube. Content planning, creative production and community management for growing brands.",
    heroTitle: "Social media that builds a brand people remember",
    heroText:
      "Plan, create and manage social content that reflects your brand, connects with your audience and supports your wider business goals.",
    overview: [
      "Social platforms are where many customers discover, research and talk about brands. A consistent presence helps you stay visible, show your expertise and build relationships long before someone is ready to buy.",
      "Our social media marketing service covers platform strategy, monthly content calendars, creative design, captions, scheduling and community engagement. We choose platforms based on where your audience actually spends time rather than trying to be everywhere at once.",
    ],
    benefits: [
      { title: "Brand awareness", text: "Stay visible to your audience with regular, on-brand content." },
      { title: "Trust & authority", text: "Share expertise and stories that make your business relatable." },
      { title: "Direct engagement", text: "Start conversations and respond to customers where they are." },
      { title: "Support for paid media", text: "A strong organic profile improves the performance of paid campaigns." },
    ],
    approach: [
      { title: "Audience & platform strategy", text: "Identify the right channels, tone and content pillars." },
      { title: "Content calendar", text: "Plan themes, formats and posting schedules month by month." },
      { title: "Creative production", text: "Design posts, carousels and short-form video concepts." },
      { title: "Engage & review", text: "Manage interactions and refine content based on insights." },
    ],
    faqs: [
      { q: "Which platforms should my business be on?", a: "It depends on your audience. B2B brands often benefit from LinkedIn, while consumer brands typically focus on Instagram, Facebook and YouTube. We recommend platforms after understanding your customers." },
      { q: "Do you create the content as well?", a: "Yes. We handle planning, copywriting and graphic design. For photography or video shoots, we can guide the brief or work with your in-house assets." },
      { q: "Is organic social enough to generate leads?", a: "Organic social builds awareness and trust. For predictable lead flow, it works best combined with paid social, search and a strong website." },
    ],
    related: ["meta-ads", "content-marketing", "online-reputation-management"],
  },
  {
    slug: "meta-ads",
    name: "Meta Ads (Facebook & Instagram Ads)",
    shortName: "Meta Ads",
    icon: Megaphone,
    summary: "Reach the right audiences on Facebook and Instagram with creative-led, data-driven campaigns.",
    seoTitle: "Meta Ads Services – Facebook & Instagram Advertising",
    seoDescription:
      "Facebook and Instagram advertising for leads, sales and awareness. Audience strategy, creative testing, Pixel and Conversions API setup, and ongoing optimisation.",
    heroTitle: "Facebook & Instagram ads that reach the right people",
    heroText:
      "Use Meta's audience tools to put the right message in front of potential customers — and keep improving results through structured creative testing.",
    overview: [
      "Meta Ads let you reach people on Facebook and Instagram based on interests, behaviours, demographics and engagement with your brand. They are particularly effective for generating demand, launching offers and retargeting interested visitors.",
      "We manage the full cycle: audience planning, campaign structure, ad creatives and copy, Pixel and Conversions API setup, lead forms and continuous optimisation. Creative testing sits at the heart of our approach, because on social platforms the message often matters as much as the targeting.",
    ],
    benefits: [
      { title: "Scalable reach", text: "Access large, well-defined audiences across India." },
      { title: "Visual storytelling", text: "Showcase products and services with image, video and carousel formats." },
      { title: "Retargeting", text: "Re-engage people who have already shown interest in your brand." },
      { title: "Flexible objectives", text: "Optimise for awareness, traffic, leads or purchases." },
    ],
    approach: [
      { title: "Tracking foundation", text: "Configure Pixel, Conversions API and events correctly." },
      { title: "Audience planning", text: "Build prospecting, lookalike and retargeting audiences." },
      { title: "Creative testing", text: "Test hooks, formats and offers to find what resonates." },
      { title: "Scale & optimise", text: "Shift budget to winning ads and refresh creatives regularly." },
    ],
    faqs: [
      { q: "Are Meta Ads suitable for B2B businesses?", a: "They can be, especially for awareness and retargeting. For many B2B offers, combining Meta with Google Ads and LinkedIn gives better overall results." },
      { q: "Do I need a Facebook Business Page?", a: "Yes. Ads run through a Facebook Page and Meta Business account. We can help you set these up correctly if they are not already in place." },
      { q: "How do you measure success?", a: "We agree on primary metrics such as cost per lead or return on ad spend, and report against them alongside reach, engagement and creative insights." },
    ],
    related: ["social-media-marketing", "google-ads-ppc", "e-commerce-marketing"],
  },
  {
    slug: "website-design-development",
    name: "Website Design & Development",
    shortName: "Website Design",
    icon: MonitorSmartphone,
    summary: "Fast, responsive, conversion-focused websites that represent your brand and generate enquiries.",
    seoTitle: "Website Design & Development Services in India",
    seoDescription:
      "Professional, mobile-first website design and development. Fast, SEO-ready and conversion-focused business websites, landing pages and e-commerce stores.",
    heroTitle: "Websites designed to convert, built to perform",
    heroText:
      "Your website is often the first serious impression a customer has of your business. We design and build sites that look professional, load fast and guide visitors to take action.",
    overview: [
      "Every marketing channel eventually sends people to your website, so its quality directly affects the return on all your marketing spend. A clear structure, persuasive content and fast performance make the difference between a visit and an enquiry.",
      "We design and develop business websites, landing pages and online stores with a mobile-first approach. Each project includes information architecture, UI design, responsive development, on-page SEO foundations, analytics setup and a smooth handover so your team can manage content confidently.",
    ],
    benefits: [
      { title: "Professional first impression", text: "A modern design that reflects the quality of your business." },
      { title: "Mobile-first experience", text: "Layouts that work smoothly on every screen size." },
      { title: "Built for search", text: "Clean structure, fast loading and SEO-ready foundations." },
      { title: "Conversion focus", text: "Clear calls to action and enquiry paths on every page." },
    ],
    approach: [
      { title: "Discovery & sitemap", text: "Understand goals, audiences and the pages you need." },
      { title: "Wireframes & design", text: "Plan layouts and create a polished visual design." },
      { title: "Development", text: "Build a fast, responsive, accessible website." },
      { title: "Launch & support", text: "Test thoroughly, set up tracking and support the go-live." },
    ],
    faqs: [
      { q: "How long does a website project take?", a: "A typical business website takes a few weeks, depending on the number of pages, content readiness and feedback cycles. Larger or e-commerce builds take longer. We share a clear timeline before starting." },
      { q: "Will I be able to update the website myself?", a: "Yes. We build on platforms that let your team edit content, and provide a walkthrough at handover." },
      { q: "Do you write the website content?", a: "We can. Our team can write SEO-friendly page copy, or refine content you provide." },
    ],
    related: ["seo", "lead-generation", "e-commerce-marketing"],
  },
  {
    slug: "content-marketing",
    name: "Content Marketing",
    shortName: "Content Marketing",
    icon: PenLine,
    summary: "Useful, search-friendly content that educates buyers and positions your brand as an authority.",
    seoTitle: "Content Marketing Services – Blogs, Guides & Strategy",
    seoDescription:
      "Strategic content marketing for Indian businesses: content strategy, SEO blogs, guides, website copy and repurposing that attract and educate your buyers.",
    heroTitle: "Content that earns attention and builds trust",
    heroText:
      "Answer your customers' real questions with helpful, well-researched content — and turn your website into a resource that attracts and converts.",
    overview: [
      "Content marketing is about consistently publishing material your audience finds genuinely useful. It supports SEO, gives your social and email channels something valuable to share, and helps buyers understand why your business is the right choice.",
      "We build content strategies around your audience's questions and your commercial priorities, then produce blogs, guides, landing page copy and resources. Every piece is researched, structured for readability and optimised for search without sacrificing quality.",
    ],
    benefits: [
      { title: "Organic growth", text: "Content targets valuable searches and attracts new visitors." },
      { title: "Authority", text: "Demonstrate expertise that sets you apart from competitors." },
      { title: "Shorter sales cycles", text: "Educated prospects arrive with fewer objections." },
      { title: "Reusable assets", text: "Repurpose content across social, email and sales." },
    ],
    approach: [
      { title: "Audience research", text: "Identify questions, pain points and search demand." },
      { title: "Content strategy", text: "Plan topics, formats and a realistic publishing calendar." },
      { title: "Create & optimise", text: "Write, edit and optimise content for readers and search." },
      { title: "Distribute & refresh", text: "Promote content and update it as it ages." },
    ],
    faqs: [
      { q: "How often should we publish content?", a: "Consistency matters more than volume. A steady schedule of well-researched pieces typically outperforms frequent, thin content." },
      { q: "Do you use AI to write content?", a: "We may use AI tools to support research and drafting, but every piece is planned, edited and fact-checked by people to ensure accuracy and quality." },
      { q: "Can you write for technical industries?", a: "Yes. We work closely with your subject-matter experts to ensure accuracy, and translate complex topics into clear language." },
    ],
    related: ["seo", "email-marketing", "social-media-marketing"],
  },
  {
    slug: "email-marketing",
    name: "Email Marketing",
    shortName: "Email Marketing",
    icon: Mail,
    summary: "Nurture leads and retain customers with well-designed campaigns and automated email journeys.",
    seoTitle: "Email Marketing Services – Campaigns & Automation",
    seoDescription:
      "Email marketing strategy, campaign design and automation for Indian businesses. Nurture leads, retain customers and drive repeat business with permission-based email.",
    heroTitle: "Email marketing that nurtures and retains",
    heroText:
      "Stay connected with leads and customers through relevant, well-timed emails — from welcome sequences to newsletters and automated follow-ups.",
    overview: [
      "Email remains one of the most direct ways to communicate with people who have already shown interest in your business. Because you own your list, it is not dependent on algorithms or ad prices.",
      "We plan email strategy, design responsive templates, write campaigns and set up automations such as welcome series, lead nurturing and re-engagement flows. We follow permission-based practices and focus on deliverability, segmentation and relevance.",
    ],
    benefits: [
      { title: "Owned channel", text: "Communicate directly with your audience on your terms." },
      { title: "Lead nurturing", text: "Guide prospects from interest to enquiry over time." },
      { title: "Customer retention", text: "Encourage repeat business and referrals." },
      { title: "Automation", text: "Send the right message at the right time without manual effort." },
    ],
    approach: [
      { title: "List & platform review", text: "Assess your list, tools and compliance basics." },
      { title: "Segmentation", text: "Group contacts by interest, stage and behaviour." },
      { title: "Campaigns & flows", text: "Design templates, write copy and build automations." },
      { title: "Test & improve", text: "Test subject lines and content, and track engagement." },
    ],
    faqs: [
      { q: "Can you send emails to purchased lists?", a: "No. We only work with permission-based lists. Purchased lists harm deliverability and brand reputation." },
      { q: "Which email platforms do you work with?", a: "We work with common email marketing platforms and can recommend one based on your needs and budget." },
      { q: "How do you measure email performance?", a: "We track deliverability, opens, clicks and — most importantly — the actions that follow, such as enquiries or purchases." },
    ],
    related: ["content-marketing", "lead-generation", "e-commerce-marketing"],
  },
  {
    slug: "online-reputation-management",
    name: "Online Reputation Management (ORM)",
    shortName: "Reputation Management",
    icon: ShieldCheck,
    summary: "Monitor, protect and strengthen how your brand appears across search, reviews and social media.",
    seoTitle: "Online Reputation Management (ORM) Services in India",
    seoDescription:
      "Ethical online reputation management: review monitoring, response strategy, search result improvement and brand sentiment tracking for businesses across India.",
    heroTitle: "Protect and strengthen your online reputation",
    heroText:
      "What people find when they search your brand influences their decision. We help you monitor, respond and build a positive, accurate online presence.",
    overview: [
      "Customers read reviews, check search results and scan social conversations before trusting a business. A few unanswered complaints or outdated information can quietly cost you enquiries.",
      "Our ethical ORM service covers brand monitoring, review response guidance, encouraging genuine reviews from real customers, and improving branded search results with accurate, positive content. We never create fake reviews or use manipulative tactics.",
    ],
    benefits: [
      { title: "Greater trust", text: "A well-managed presence reassures potential customers." },
      { title: "Early warning", text: "Spot issues quickly and respond before they escalate." },
      { title: "Better branded search", text: "Strengthen the results people see when they search your name." },
      { title: "Customer insight", text: "Learn from feedback to improve your service." },
    ],
    approach: [
      { title: "Reputation audit", text: "Review search results, review platforms and social mentions." },
      { title: "Monitoring setup", text: "Track new reviews and brand mentions consistently." },
      { title: "Response strategy", text: "Create professional response guidelines and templates." },
      { title: "Positive presence", text: "Encourage genuine reviews and publish accurate brand content." },
    ],
    faqs: [
      { q: "Can you remove negative reviews?", a: "Genuine reviews generally cannot be removed. Reviews that violate platform policies can be reported. Our focus is responding professionally and building a stronger body of authentic feedback." },
      { q: "Do you post fake reviews?", a: "Never. Fake reviews are unethical, violate platform policies and can damage your brand. We only use legitimate methods." },
      { q: "How long does ORM take?", a: "Monitoring and response improvements start immediately. Changing branded search results is gradual and depends on the existing content." },
    ],
    related: ["local-seo", "social-media-marketing", "content-marketing"],
  },
  {
    slug: "local-seo",
    name: "Local SEO",
    shortName: "Local SEO",
    icon: MapPin,
    summary: "Get found by nearby customers on Google Maps and local search results.",
    seoTitle: "Local SEO Services – Google Business Profile Optimization",
    seoDescription:
      "Local SEO services to help customers find your business on Google Maps and local search. Google Business Profile optimisation, local citations and location pages.",
    heroTitle: "Be the business nearby customers find first",
    heroText:
      "When people search for services 'near me', the local results decide who gets the call. We help your business show up clearly and accurately.",
    overview: [
      "Local SEO focuses on visibility in location-based searches and the Google Maps results. For clinics, showrooms, service providers and multi-location brands, it is often the most valuable form of search visibility.",
      "We optimise your Google Business Profile, ensure consistent business information across directories, build relevant location pages, and help you earn genuine reviews. For multi-city brands, we create a scalable structure for each location.",
    ],
    benefits: [
      { title: "Map visibility", text: "Appear in the local results that drive calls and visits." },
      { title: "High-intent traffic", text: "Local searchers are often ready to act quickly." },
      { title: "Accurate information", text: "Consistent details build trust with customers and Google." },
      { title: "Multi-location scale", text: "A clear structure for brands across several cities." },
    ],
    approach: [
      { title: "Local audit", text: "Review your profile, listings, reviews and competitors." },
      { title: "Profile optimisation", text: "Improve categories, services, photos and posts." },
      { title: "Citations & pages", text: "Fix inconsistent listings and build location pages." },
      { title: "Reviews & tracking", text: "Encourage genuine reviews and monitor local visibility." },
    ],
    faqs: [
      { q: "Do I need a physical address for local SEO?", a: "Google Business Profiles require a real address or a defined service area. Service-area businesses can hide their address while still appearing locally." },
      { q: "Can you help businesses with multiple locations?", a: "Yes. We set up and optimise each location's profile and create dedicated location pages on your website." },
      { q: "How is local SEO different from regular SEO?", a: "Local SEO focuses on proximity-based searches and Maps results, using signals like your business profile, reviews and local citations." },
    ],
    related: ["seo", "online-reputation-management", "google-ads-ppc"],
  },
  {
    slug: "e-commerce-marketing",
    name: "E-commerce Marketing",
    shortName: "E-commerce Marketing",
    icon: ShoppingCart,
    summary: "Grow online store sales with shopping ads, product SEO, retargeting and retention campaigns.",
    seoTitle: "E-commerce Marketing Services for Online Stores",
    seoDescription:
      "E-commerce marketing for online stores and D2C brands: Google Shopping, Meta catalogue ads, product page SEO, conversion optimisation and retention email.",
    heroTitle: "Full-funnel marketing for online stores",
    heroText:
      "From product discovery to repeat purchase, we help D2C brands and online stores attract shoppers, convert them and bring them back.",
    overview: [
      "Selling online means competing for attention across search, social and marketplaces. Sustainable growth comes from a full-funnel approach that balances acquisition costs with conversion rate and customer lifetime value.",
      "We combine Google Shopping and Performance Max, Meta catalogue ads, product and category SEO, conversion rate improvements and retention email to build a connected e-commerce growth system — with accurate purchase tracking at its core.",
    ],
    benefits: [
      { title: "Product discovery", text: "Show products to shoppers searching and scrolling." },
      { title: "Higher conversion", text: "Improve product pages, checkout and trust signals." },
      { title: "Smarter retargeting", text: "Bring back visitors who viewed or carted products." },
      { title: "Repeat purchases", text: "Increase lifetime value with retention campaigns." },
    ],
    approach: [
      { title: "Store & tracking audit", text: "Review feeds, analytics and purchase tracking." },
      { title: "Acquisition", text: "Launch Shopping, Performance Max and social catalogue ads." },
      { title: "Conversion", text: "Improve product pages, offers and checkout flow." },
      { title: "Retention", text: "Build email flows for abandoned carts and repeat buyers." },
    ],
    faqs: [
      { q: "Which e-commerce platforms do you work with?", a: "We work with popular platforms such as Shopify and WooCommerce, as well as custom stores, provided tracking can be implemented properly." },
      { q: "Do you manage marketplace listings?", a: "Our core focus is your own store. We can advise on marketplace strategy as part of a wider plan." },
      { q: "What metrics do you focus on?", a: "Return on ad spend, cost per acquisition, conversion rate, average order value and repeat purchase rate." },
    ],
    related: ["meta-ads", "google-ads-ppc", "email-marketing"],
  },
  {
    slug: "ai-powered-digital-marketing",
    name: "AI-Powered Digital Marketing",
    shortName: "AI-Powered Marketing",
    icon: Sparkles,
    summary: "Use AI responsibly to speed up research, personalise campaigns and uncover insights faster.",
    seoTitle: "AI-Powered Digital Marketing Services",
    seoDescription:
      "Practical, responsible AI in digital marketing: faster research, content workflows, audience insights, automation and smarter campaign optimisation for Indian businesses.",
    heroTitle: "Practical AI for smarter, faster marketing",
    heroText:
      "We apply AI tools where they genuinely help — research, analysis, creative iteration and automation — while keeping strategy and quality in human hands.",
    overview: [
      "AI is changing how marketing work gets done. Used thoughtfully, it can shorten research cycles, help test more creative ideas, personalise messaging and surface patterns in data that would otherwise take hours to find.",
      "Our AI-powered marketing service integrates these tools into your campaigns and workflows responsibly. We use AI to support keyword and audience research, draft content variations, analyse performance and automate repetitive tasks — always with human review, brand safety and data privacy in mind.",
    ],
    benefits: [
      { title: "Faster execution", text: "Reduce time spent on repetitive research and production." },
      { title: "More testing", text: "Generate and test more creative variations efficiently." },
      { title: "Deeper insights", text: "Spot trends and opportunities in your marketing data." },
      { title: "Human oversight", text: "Every output is reviewed for accuracy and brand fit." },
    ],
    approach: [
      { title: "Opportunity review", text: "Identify where AI can add real value to your marketing." },
      { title: "Tool & workflow design", text: "Choose suitable tools and define review checkpoints." },
      { title: "Pilot & measure", text: "Test AI-assisted workflows against current results." },
      { title: "Scale responsibly", text: "Expand what works with clear quality and privacy rules." },
    ],
    faqs: [
      { q: "Will AI replace human marketers on my account?", a: "No. AI supports our team's work; strategy, judgement and final quality control remain with experienced people." },
      { q: "Is my business data safe when using AI tools?", a: "We follow data-minimisation practices and avoid sharing sensitive information with tools that are not appropriate for it." },
      { q: "Do I need to be technical to benefit?", a: "Not at all. We handle the tools and explain results in plain language." },
    ],
    related: ["content-marketing", "lead-generation", "google-ads-ppc"],
  },
  {
    slug: "lead-generation",
    name: "Lead Generation",
    shortName: "Lead Generation",
    icon: Magnet,
    summary: "Build a predictable pipeline of qualified enquiries with integrated campaigns and landing pages.",
    seoTitle: "Lead Generation Services for B2B & B2C Businesses",
    seoDescription:
      "Integrated lead generation services: targeted campaigns, high-converting landing pages, lead qualification and accurate tracking to build a predictable sales pipeline.",
    heroTitle: "A steady pipeline of qualified enquiries",
    heroText:
      "We connect targeted campaigns, persuasive landing pages and accurate tracking into one system designed to generate leads your sales team wants to call.",
    overview: [
      "Lead generation is not just about volume — it is about attracting people who match your ideal customer and are likely to buy. That requires the right channels, clear offers and a smooth path from first click to enquiry.",
      "We design end-to-end lead generation funnels across Google, Meta and other relevant channels, build focused landing pages, set up form and call tracking, and work with you to improve lead quality over time based on real sales feedback.",
    ],
    benefits: [
      { title: "Predictable pipeline", text: "Consistent enquiry flow your team can plan around." },
      { title: "Better lead quality", text: "Targeting and qualification focused on ideal customers." },
      { title: "Clear cost per lead", text: "Know what each enquiry costs and which channel delivers." },
      { title: "Sales alignment", text: "Feedback loops that refine targeting over time." },
    ],
    approach: [
      { title: "Ideal customer profile", text: "Define who you want to reach and what they need." },
      { title: "Offer & landing pages", text: "Create compelling offers and focused pages." },
      { title: "Multi-channel campaigns", text: "Launch campaigns on the channels that fit your audience." },
      { title: "Qualify & optimise", text: "Track lead quality and refine continuously." },
    ],
    faqs: [
      { q: "Do you sell leads?", a: "No. We generate leads exclusively for your business through campaigns run on your behalf. We never resell or share them." },
      { q: "How do you improve lead quality?", a: "Through precise targeting, qualifying form questions, clear messaging and regular feedback from your sales team about which leads converted." },
      { q: "Which channels work best for lead generation?", a: "It varies by industry. Search ads capture existing demand, while social ads create new demand. We usually recommend a tested mix." },
    ],
    related: ["google-ads-ppc", "meta-ads", "website-design-development"],
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
