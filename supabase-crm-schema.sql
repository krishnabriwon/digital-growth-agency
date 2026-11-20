-- ==============================================================================
-- DMA Agency CRM – Production Database Architecture & SQL Schema
-- Brand: Digital Marketing Agency
-- Purpose: Complete CRM for leads, pipeline, clients, follow-ups, and analytics
-- ==============================================================================

-- 1. PROFILES (Staff & User Roles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'team_member' CHECK (role IN ('admin', 'team_member')),
  title text DEFAULT 'Growth Specialist',
  phone text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. SERVICES CATALOGUE
CREATE TABLE IF NOT EXISTS public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 3. LEADS (Central Lead Management Table)
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_code text NOT NULL UNIQUE,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  company text,
  service text NOT NULL,
  message text NOT NULL,
  source text NOT NULL DEFAULT 'Website Enquiry' CHECK (source IN (
    'Website Enquiry', 'Google Ads', 'Meta Ads', 'Referral', 'Direct', 'Organic Search', 'LinkedIn', 'Cold Outreach'
  )),
  status text NOT NULL DEFAULT 'New' CHECK (status IN (
    'New', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'
  )),
  priority text NOT NULL DEFAULT 'Medium' CHECK (priority IN (
    'Low', 'Medium', 'High', 'Urgent'
  )),
  assigned_to text DEFAULT 'Unassigned',
  estimated_budget numeric DEFAULT 50000,
  notes text,
  submission_id uuid REFERENCES public.contact_submissions(id) ON DELETE SET NULL,
  last_contacted_at timestamptz,
  next_follow_up_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for high-performance lead queries
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_source ON public.leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON public.leads(assigned_to);

-- 4. CLIENTS (Converted Accounts & Retainers)
CREATE TABLE IF NOT EXISTS public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_code text NOT NULL UNIQUE,
  lead_id uuid REFERENCES public.leads(id) ON DELETE SET NULL,
  name text NOT NULL,
  company text,
  email text NOT NULL,
  phone text NOT NULL,
  services_purchased text[] NOT NULL DEFAULT '{}',
  project_start_date date NOT NULL DEFAULT CURRENT_DATE,
  contract_value numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'Active' CHECK (status IN (
    'Active', 'Inactive', 'Completed', 'On Hold'
  )),
  assigned_manager text NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_clients_status ON public.clients(status);

-- 5. FOLLOW-UPS
CREATE TABLE IF NOT EXISTS public.follow_ups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  title text NOT NULL,
  type text NOT NULL CHECK (type IN ('Call', 'Email', 'Meeting', 'WhatsApp', 'Demo')),
  scheduled_at timestamptz NOT NULL,
  notes text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  completed_at timestamptz,
  created_by text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_follow_ups_lead ON public.follow_ups(lead_id);
CREATE INDEX IF NOT EXISTS idx_follow_ups_scheduled_at ON public.follow_ups(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_follow_ups_status ON public.follow_ups(status);

-- 6. ACTIVITIES & AUDIT TIMELINE
CREATE TABLE IF NOT EXISTS public.activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES public.leads(id) ON DELETE CASCADE,
  client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
  type text NOT NULL,
  description text NOT NULL,
  performed_by text NOT NULL,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activities_lead ON public.activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_activities_created_at ON public.activities(created_at DESC);

-- ==============================================================================
-- AUTOMATIC TRIGGER: Auto-create CRM Lead from Website Enquiry
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_website_enquiry()
RETURNS TRIGGER AS $$
DECLARE
  next_code text;
  lead_count int;
BEGIN
  SELECT count(*) INTO lead_count FROM public.leads;
  next_code := 'DMA-' || (1001 + lead_count);

  INSERT INTO public.leads (
    lead_code,
    full_name,
    email,
    phone,
    company,
    service,
    message,
    source,
    status,
    priority,
    submission_id,
    created_at
  ) VALUES (
    next_code,
    NEW.full_name,
    NEW.email,
    NEW.phone,
    NEW.company,
    NEW.service,
    NEW.message,
    'Website Enquiry',
    'New',
    'High',
    NEW.id,
    NEW.created_at
  );

  INSERT INTO public.activities (
    type,
    description,
    performed_by,
    created_at
  ) VALUES (
    'lead_created',
    'New website enquiry received from ' || NEW.full_name || ' (' || NEW.service || ')',
    'Website Integration',
    NEW.created_at
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to existing contact_submissions table
DROP TRIGGER IF EXISTS trg_on_contact_submission ON public.contact_submissions;
CREATE TRIGGER trg_on_contact_submission
  AFTER INSERT ON public.contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_website_enquiry();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Allow authenticated agency team members full read/write access to CRM data
CREATE POLICY "Authenticated users can manage profiles" ON public.profiles
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can view and edit services" ON public.services
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can manage leads" ON public.leads
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can manage clients" ON public.clients
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can manage follow-ups" ON public.follow_ups
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can manage activities" ON public.activities
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Allow public read access to active services for forms
CREATE POLICY "Public can view active services" ON public.services
  FOR SELECT TO anon USING (is_active = true);

-- ==============================================================================
-- SEED DATA: 12 Agency Services
-- ==============================================================================

INSERT INTO public.services (name, slug, description, is_active)
VALUES
  ('Search Engine Optimization (SEO)', 'seo', 'Data-driven organic search strategy to rank higher and generate consistent inbound leads.', true),
  ('Google Ads / PPC Advertising', 'google-ads', 'High-intent search and shopping campaigns designed for immediate ROI and customer acquisition.', true),
  ('Social Media Marketing', 'social-media', 'Engaging brand presence, community management, and organic social growth across channels.', true),
  ('Meta Ads', 'meta-ads', 'Precision-targeted Facebook and Instagram ad funnels for conversions and e-commerce scaling.', true),
  ('Website Design & Development', 'web-dev', 'High-converting, mobile-first agency websites built on modern tech stacks with fast load times.', true),
  ('Content Marketing', 'content-marketing', 'Thought leadership articles, authoritative guides, and brand storytelling that build customer trust.', true),
  ('Email Marketing', 'email-marketing', 'Automated nurture sequences, newsletter broadcasts, and retention funnels that boost LTV.', true),
  ('Online Reputation Management', 'orm', 'Review monitoring, brand sentiment enhancement, and corporate digital reputation building.', true),
  ('Local SEO', 'local-seo', 'Google Business Profile optimization, local citations, and map pack dominance for local footfall.', true),
  ('E-commerce Marketing', 'ecommerce-marketing', 'Full-funnel catalog ads, Shopify optimization, ROAS scaling, and cart abandonment recovery.', true),
  ('AI-Powered Digital Marketing', 'ai-marketing', 'Automated audience personalization, predictive lead scoring, and generative creative optimization.', true),
  ('Lead Generation', 'lead-generation', 'B2B appointment setting, landing page conversion rate optimization, and qualified sales pipeline creation.', true)
ON CONFLICT (name) DO NOTHING;
