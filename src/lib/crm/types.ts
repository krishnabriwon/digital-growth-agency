export type LeadStatus =
  | "New"
  | "Contacted"
  | "Qualified"
  | "Proposal Sent"
  | "Negotiation"
  | "Won"
  | "Lost";

export type LeadPriority = "Low" | "Medium" | "High" | "Urgent";

export type LeadSource =
  | "Website Enquiry"
  | "Google Ads"
  | "Meta Ads"
  | "Referral"
  | "Direct"
  | "Organic Search"
  | "LinkedIn"
  | "Cold Outreach";

export type UserRole = "admin" | "team_member";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  avatar?: string;
  activeLeadsCount?: number;
  wonLeadsCount?: number;
}

export interface Lead {
  id: string;
  leadCode: string;
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  service: string;
  message: string;
  source: LeadSource;
  status: LeadStatus;
  priority: LeadPriority;
  assignedTo: string;
  estimatedBudget: number; // in INR
  createdAt: string; // ISO
  lastContactedAt?: string;
  nextFollowUpDate?: string;
  notes?: string;
  submissionId?: string; // Links to contact_submissions table id
}

export type ClientStatus = "Active" | "Inactive" | "Completed" | "On Hold";

export interface Client {
  id: string;
  clientCode: string;
  leadId?: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  servicesPurchased: string[];
  projectStartDate: string;
  contractValue: number; // in INR
  status: ClientStatus;
  assignedManager: string;
  notes?: string;
  createdAt: string;
}

export type FollowUpType = "Call" | "Email" | "Meeting" | "WhatsApp" | "Demo";
export type FollowUpStatus = "pending" | "completed" | "cancelled";

export interface FollowUp {
  id: string;
  leadId: string;
  leadName: string;
  leadCompany?: string;
  leadPhone?: string;
  title: string;
  type: FollowUpType;
  scheduledAt: string; // ISO timestamp
  notes?: string;
  status: FollowUpStatus;
  completedAt?: string;
  createdBy: string;
  createdAt: string;
}

export type ActivityType =
  | "lead_created"
  | "status_changed"
  | "contact_made"
  | "followup_scheduled"
  | "followup_completed"
  | "note_added"
  | "converted_to_client"
  | "lead_updated";

export interface Activity {
  id: string;
  leadId?: string;
  clientId?: string;
  type: ActivityType;
  description: string;
  performedBy: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface ServiceItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  leadCount?: number;
}

export type DateRangePreset = "today" | "last_7_days" | "last_30_days" | "this_month" | "all_time" | "custom";

// ==================== CMS TYPES ====================
export interface CmsArticleSection {
  heading: string;
  body: string[];
}

export interface CmsArticle {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  published: boolean;
  featured?: boolean;
  updatedAt: string;
  createdAt: string;
  author?: string;
  sections: CmsArticleSection[];
}

export interface CmsFaq {
  id: string;
  q: string;
  a: string;
  category: "General" | "Services" | "Pricing" | "Process" | "Guarantees";
  order: number;
  published: boolean;
}

export interface CmsAnnouncement {
  enabled: boolean;
  badgeText: string;
  message: string;
  linkText: string;
  linkUrl: string;
  theme: "primary" | "navy" | "emerald" | "amber";
}

export interface CmsHeroSettings {
  eyebrow: string;
  title: string;
  highlightText: string;
  subtitle: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
}

export interface CmsProcessStep {
  id: string;
  stepNumber: number;
  title: string;
  text: string;
}

