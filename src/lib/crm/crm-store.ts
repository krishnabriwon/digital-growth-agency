import { supabase } from "@/integrations/supabase/client";
import type { Lead, Client, FollowUp, Activity, ServiceItem, TeamMember, LeadStatus } from "./types";
import {
  INITIAL_LEADS,
  INITIAL_CLIENTS,
  INITIAL_FOLLOW_UPS,
  INITIAL_ACTIVITIES,
  AGENCY_SERVICES,
  TEAM_MEMBERS,
} from "./mock-data";

const STORAGE_KEYS = {
  LEADS: "dma_crm_leads_v2",
  CLIENTS: "dma_crm_clients_v2",
  FOLLOW_UPS: "dma_crm_follow_ups_v2",
  ACTIVITIES: "dma_crm_activities_v2",
  SERVICES: "dma_crm_services_v2",
  TEAM: "dma_crm_team_v2",
};

function safeGetItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.warn(`Failed to parse ${key} from localStorage:`, e);
    return defaultValue;
  }
}

function safeSetItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Failed to save ${key} to localStorage:`, e);
  }
}

export class CrmStore {
  private static instance: CrmStore;

  private leads: Lead[] = [];
  private clients: Client[] = [];
  private followUps: FollowUp[] = [];
  private activities: Activity[] = [];
  private services: ServiceItem[] = [];
  private teamMembers: TeamMember[] = [];
  private listeners: Set<() => void> = new Set();
  public isCloudConnected = false;
  public lastSyncTime: Date | null = null;
  public syncMessage = "";

  private constructor() {
    this.initStore();
  }

  public static getInstance(): CrmStore {
    if (!CrmStore.instance) {
      CrmStore.instance = new CrmStore();
    }
    return CrmStore.instance;
  }

  private initStore() {
    if (typeof window !== "undefined") {
      // Clear legacy sample/dummy data keys from previous sessions
      localStorage.removeItem("dma_crm_leads_v1");
      localStorage.removeItem("dma_crm_clients_v1");
      localStorage.removeItem("dma_crm_follow_ups_v1");
      localStorage.removeItem("dma_crm_activities_v1");
    }

    const rawLeads = safeGetItem<Lead[]>(STORAGE_KEYS.LEADS, INITIAL_LEADS);
    // Keep only real leads (website submissions or user-created leads, not hardcoded dummy leads)
    this.leads = rawLeads.filter((l) => !/^lead-[1-7]$/.test(l.id));

    const rawClients = safeGetItem<Client[]>(STORAGE_KEYS.CLIENTS, INITIAL_CLIENTS);
    this.clients = rawClients.filter((c) => !/^cli-[1-2]$/.test(c.id));

    const rawFollowUps = safeGetItem<FollowUp[]>(STORAGE_KEYS.FOLLOW_UPS, INITIAL_FOLLOW_UPS);
    this.followUps = rawFollowUps.filter((f) => !/^fu-[1-4]$/.test(f.id));

    const rawActivities = safeGetItem<Activity[]>(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
    this.activities = rawActivities.filter((a) => !/^act-[1-4]$/.test(a.id));

    this.services = safeGetItem<ServiceItem[]>(STORAGE_KEYS.SERVICES, AGENCY_SERVICES);
    this.teamMembers = safeGetItem<TeamMember[]>(STORAGE_KEYS.TEAM, TEAM_MEMBERS);
  }

  public subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notify() {
    this.listeners.forEach((cb) => cb());
  }

  // --- Website Enquiry / Supabase Sync ---
  public async syncWithSupabase(): Promise<{ newEnquiries: number; message: string }> {
    let addedCount = 0;

    // 1. Fetch from server-captured website enquiries
    try {
      const { fetchServerEnquiries } = await import("@/lib/enquiry.functions");
      const serverEnquiries = await fetchServerEnquiries();
      if (Array.isArray(serverEnquiries) && serverEnquiries.length > 0) {
        for (const sub of serverEnquiries) {
          const exists = this.leads.some(
            (l) =>
              l.submissionId === sub.id ||
              (l.email === sub.email && l.fullName === sub.fullName) ||
              (l.email === sub.email && l.createdAt === sub.createdAt)
          );

          if (!exists) {
            const nextIndex = this.leads.length + 1;
            const newLead: Lead = {
              id: `lead-web-${sub.id || Date.now()}`,
              leadCode: `DMA-${1000 + nextIndex}`,
              fullName: sub.fullName,
              email: sub.email,
              phone: sub.phone,
              company: sub.company || undefined,
              service: sub.service,
              message: sub.message,
              source: "Website Enquiry",
              status: "New",
              priority: "High",
              assignedTo: "Rajesh Verma",
              estimatedBudget: 60000,
              createdAt: sub.createdAt || new Date().toISOString(),
              submissionId: sub.id,
              notes: "Imported automatically from website contact form.",
            };

            this.leads.unshift(newLead);
            addedCount++;

            this.logActivity({
              leadId: newLead.id,
              type: "lead_created",
              description: `Website enquiry received from ${newLead.fullName} for ${newLead.service}`,
              performedBy: "Website Integration",
            });
          }
        }
      }
    } catch (serverErr) {
      console.warn("Server enquiries sync note:", serverErr);
    }

    // 2. Fetch from Supabase contact_submissions (if database SELECT permission is available)
    try {
      const { data: submissions, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && submissions && submissions.length > 0) {
        for (const sub of submissions) {
          const exists = this.leads.some(
            (l) => l.submissionId === sub.id || (l.email === sub.email && l.createdAt === sub.created_at)
          );

          if (!exists) {
            const nextIndex = this.leads.length + 1;
            const newLead: Lead = {
              id: `lead-sb-${sub.id || Date.now()}`,
              leadCode: `DMA-${1000 + nextIndex}`,
              fullName: sub.full_name,
              email: sub.email,
              phone: sub.phone,
              company: sub.company || undefined,
              service: sub.service,
              message: sub.message,
              source: "Website Enquiry",
              status: "New",
              priority: "High",
              assignedTo: "Rajesh Verma",
              estimatedBudget: 60000,
              createdAt: sub.created_at || new Date().toISOString(),
              submissionId: sub.id,
              notes: "Imported automatically from website contact form.",
            };

            this.leads.unshift(newLead);
            addedCount++;

            this.logActivity({
              leadId: newLead.id,
              type: "lead_created",
              description: `Website enquiry received from ${newLead.fullName} for ${newLead.service}`,
              performedBy: "Website Integration",
            });
          }
        }
      }
    } catch (supabaseErr) {
      console.warn("Supabase query note:", supabaseErr);
    }

    this.isCloudConnected = true;
    this.lastSyncTime = new Date();

    // Also auto-sync with Google Sheets
    try {
      const sheetRes = await this.autoSyncGoogleSheets();
      if (sheetRes.newCount > 0) {
        addedCount += sheetRes.newCount;
      }
    } catch (sheetSyncErr) {
      console.warn("Google Sheet auto-sync within syncWithSupabase note:", sheetSyncErr);
    }

    if (addedCount > 0) {
      safeSetItem(STORAGE_KEYS.LEADS, this.leads);
      this.syncMessage = `Synced ${addedCount} new lead(s) across Website & Google Sheet!`;
    } else {
      this.syncMessage = "All website & Google Sheet enquiries are up to date.";
    }

    this.notify();
    return { newEnquiries: addedCount, message: this.syncMessage };
  }

  // --- Google Sheets Auto-Sync Engine ---
  public getGoogleSheetUrl(): string {
    if (typeof window === "undefined")
      return "https://docs.google.com/spreadsheets/d/14rDDrtP_WAYgIX4Gxol3DmPn07M4HO7TpFtU3slKS40/edit?usp=sharing";
    return (
      localStorage.getItem("dma_google_sheet_url") ||
      "https://docs.google.com/spreadsheets/d/14rDDrtP_WAYgIX4Gxol3DmPn07M4HO7TpFtU3slKS40/edit?usp=sharing"
    );
  }

  public setGoogleSheetUrl(url: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem("dma_google_sheet_url", url.trim());
    this.notify();
  }

  public async autoSyncGoogleSheets(sheetUrlOverride?: string): Promise<{
    newCount: number;
    totalCount: number;
    message: string;
    success: boolean;
  }> {
    try {
      const storedUrl =
        sheetUrlOverride !== undefined
          ? sheetUrlOverride
          : typeof window !== "undefined"
          ? localStorage.getItem("dma_google_sheet_url") ||
            "https://docs.google.com/spreadsheets/d/14rDDrtP_WAYgIX4Gxol3DmPn07M4HO7TpFtU3slKS40/edit?usp=sharing"
          : "https://docs.google.com/spreadsheets/d/14rDDrtP_WAYgIX4Gxol3DmPn07M4HO7TpFtU3slKS40/edit?usp=sharing";

      const { syncAllGoogleSheetLeadsFn } = await import("@/lib/google-sheets.server");
      const res = await syncAllGoogleSheetLeadsFn({ data: { sheetUrl: storedUrl } });

      if (res.ok && Array.isArray(res.rows) && res.rows.length > 0) {
        const addedCount = this.importGoogleSheetRows(res.rows);
        this.isCloudConnected = true;
        this.lastSyncTime = new Date();
        this.syncMessage =
          addedCount > 0
            ? `Google Sheet auto-synced: ${addedCount} new lead(s) added! (Total: ${this.leads.length})`
            : `Google Sheet up to date (${this.leads.length} leads).`;
        this.notify();
        return {
          newCount: addedCount,
          totalCount: this.leads.length,
          message: this.syncMessage,
          success: true,
        };
      }

      return {
        newCount: 0,
        totalCount: this.leads.length,
        message: res.error || "Google Sheet sync checked.",
        success: res.ok,
      };
    } catch (err) {
      console.warn("autoSyncGoogleSheets error:", err);
      return {
        newCount: 0,
        totalCount: this.leads.length,
        message: "Could not auto-sync with Google Sheet.",
        success: false,
      };
    }
  }

  // --- Google Sheets Importer ---
  public importGoogleSheetRows(
    rows: Array<{
      fullName: string;
      email: string;
      phone: string;
      company?: string;
      service: string;
      message: string;
      submittedAt?: string;
    }>
  ): number {
    let importedCount = 0;
    for (const r of rows) {
      if (!r.fullName || (!r.email && !r.phone)) continue;

      const exists = this.leads.some((l) => {
        // 1. Exact submission timestamp match
        if (
          r.submittedAt &&
          l.createdAt &&
          (l.createdAt === r.submittedAt ||
            new Date(l.createdAt).getTime() === new Date(r.submittedAt).getTime())
        ) {
          return true;
        }

        // 2. Exact person match: Name AND (Email OR Phone)
        const nameMatches =
          l.fullName.trim().toLowerCase() === r.fullName.trim().toLowerCase();
        const emailMatches =
          l.email &&
          r.email &&
          l.email.trim().toLowerCase() === r.email.trim().toLowerCase();
        const phoneMatches =
          l.phone &&
          r.phone &&
          l.phone.replace(/\D/g, "") === r.phone.replace(/\D/g, "") &&
          l.phone.replace(/\D/g, "").length >= 7;

        if (nameMatches && (emailMatches || phoneMatches)) {
          return true;
        }
        return false;
      });

      if (!exists) {
        const nextIndex = this.leads.length + 1;
        const newLead: Lead = {
          id: `lead-gsheet-${Date.now()}-${importedCount}-${Math.random().toString(36).slice(2, 6)}`,
          leadCode: `DMA-${1000 + nextIndex}`,
          fullName: r.fullName,
          email: r.email || "no-email@sheet.local",
          phone: r.phone || "N/A",
          company: r.company,
          service: r.service || "Website Marketing Enquiry",
          message: r.message || "Imported from Google Sheet",
          source: "Website Enquiry",
          status: "New",
          priority: "High",
          assignedTo: "Rajesh Verma",
          estimatedBudget: 60000,
          createdAt: r.submittedAt || new Date().toISOString(),
          notes: "Imported from Google Sheet (WEBSITE LEADS).",
        };
        this.leads.unshift(newLead);
        importedCount++;
        this.logActivity({
          leadId: newLead.id,
          type: "lead_created",
          description: `Google Sheet lead imported: ${newLead.fullName} (${newLead.service})`,
          performedBy: "Google Sheets Sync",
        });
      }
    }

    if (importedCount > 0) {
      safeSetItem(STORAGE_KEYS.LEADS, this.leads);
      this.syncMessage = `Imported ${importedCount} leads from Google Sheets!`;
      this.notify();
    }
    return importedCount;
  }

  // --- Leads CRUD ---
  public getLeads(): Lead[] {
    return [...this.leads];
  }

  public getLeadById(id: string): Lead | undefined {
    return this.leads.find((l) => l.id === id);
  }

  public addLead(
    leadData: Omit<Lead, "id" | "leadCode" | "createdAt">,
    performedBy = "Admin"
  ): Lead {
    const nextCode = `DMA-${1000 + this.leads.length + 1}`;
    const newLead: Lead = {
      ...leadData,
      id: `lead-${Date.now()}`,
      leadCode: nextCode,
      createdAt: new Date().toISOString(),
    };

    this.leads.unshift(newLead);
    safeSetItem(STORAGE_KEYS.LEADS, this.leads);

    this.logActivity({
      leadId: newLead.id,
      type: "lead_created",
      description: `New lead created: ${newLead.fullName} (${newLead.company || "Individual"})`,
      performedBy,
    });

    this.notify();
    return newLead;
  }

  public updateLead(
    id: string,
    updates: Partial<Omit<Lead, "id" | "leadCode" | "createdAt">>,
    performedBy = "Admin"
  ): Lead | null {
    const index = this.leads.findIndex((l) => l.id === id);
    if (index === -1) return null;

    const old = this.leads[index];
    const updated: Lead = { ...old, ...updates };

    if (updates.status && updates.status !== old.status) {
      this.logActivity({
        leadId: id,
        type: "status_changed",
        description: `Status changed from "${old.status}" to "${updates.status}"`,
        performedBy,
      });
    }

    this.leads[index] = updated;
    safeSetItem(STORAGE_KEYS.LEADS, this.leads);
    this.notify();
    return updated;
  }

  public deleteLead(id: string, performedBy = "Admin"): boolean {
    const lead = this.leads.find((l) => l.id === id);
    if (!lead) return false;

    this.leads = this.leads.filter((l) => l.id !== id);
    // Also remove linked follow-ups
    this.followUps = this.followUps.filter((f) => f.leadId !== id);

    safeSetItem(STORAGE_KEYS.LEADS, this.leads);
    safeSetItem(STORAGE_KEYS.FOLLOW_UPS, this.followUps);

    this.logActivity({
      type: "lead_updated",
      description: `Lead ${lead.leadCode} (${lead.fullName}) was deleted`,
      performedBy,
    });

    this.notify();
    return true;
  }

  public bulkUpdateLeadStatus(
    ids: string[],
    newStatus: LeadStatus,
    performedBy = "Admin"
  ): void {
    let count = 0;
    this.leads = this.leads.map((lead) => {
      if (ids.includes(lead.id)) {
        count++;
        return { ...lead, status: newStatus };
      }
      return lead;
    });

    safeSetItem(STORAGE_KEYS.LEADS, this.leads);

    this.logActivity({
      type: "status_changed",
      description: `Bulk updated status of ${count} leads to "${newStatus}"`,
      performedBy,
    });

    this.notify();
  }

  // --- Clients CRUD ---
  public getClients(): Client[] {
    return [...this.clients];
  }

  public convertLeadToClient(
    leadId: string,
    clientData: {
      servicesPurchased: string[];
      contractValue: number;
      projectStartDate: string;
      assignedManager: string;
      notes?: string;
    },
    performedBy = "Admin"
  ): Client | null {
    const lead = this.leads.find((l) => l.id === leadId);
    if (!lead) return null;

    // Update lead status to Won if not already
    this.updateLead(leadId, { status: "Won" }, performedBy);

    const clientCode = `DMA-CLI-${100 + this.clients.length + 1}`;
    const newClient: Client = {
      id: `cli-${Date.now()}`,
      clientCode,
      leadId: lead.id,
      name: lead.fullName,
      company: lead.company,
      email: lead.email,
      phone: lead.phone,
      servicesPurchased: clientData.servicesPurchased.length > 0 ? clientData.servicesPurchased : [lead.service],
      projectStartDate: clientData.projectStartDate || new Date().toISOString().split("T")[0],
      contractValue: clientData.contractValue || lead.estimatedBudget || 75000,
      status: "Active",
      assignedManager: clientData.assignedManager || lead.assignedTo || "Krishna",
      notes: clientData.notes || `Converted from lead ${lead.leadCode}. Initial requirements: ${lead.message}`,
      createdAt: new Date().toISOString(),
    };

    this.clients.unshift(newClient);
    safeSetItem(STORAGE_KEYS.CLIENTS, this.clients);

    this.logActivity({
      leadId: lead.id,
      clientId: newClient.id,
      type: "converted_to_client",
      description: `Converted lead ${lead.leadCode} (${lead.fullName}) to client ${newClient.clientCode} (Value: ₹${newClient.contractValue.toLocaleString("en-IN")})`,
      performedBy,
    });

    this.notify();
    return newClient;
  }

  public updateClient(
    id: string,
    updates: Partial<Omit<Client, "id" | "clientCode" | "createdAt">>
  ): Client | null {
    const index = this.clients.findIndex((c) => c.id === id);
    if (index === -1) return null;

    this.clients[index] = { ...this.clients[index], ...updates };
    safeSetItem(STORAGE_KEYS.CLIENTS, this.clients);
    this.notify();
    return this.clients[index];
  }

  public deleteClient(id: string): boolean {
    this.clients = this.clients.filter((c) => c.id !== id);
    safeSetItem(STORAGE_KEYS.CLIENTS, this.clients);
    this.notify();
    return true;
  }

  public addClientDirectly(
    clientData: Omit<Client, "id" | "clientCode" | "createdAt">,
    performedBy = "Admin"
  ): Client {
    const nextCode = `DMA-CLI-${100 + this.clients.length + 1}`;
    const newClient: Client = {
      ...clientData,
      id: `cli-${Date.now()}`,
      clientCode: nextCode,
      createdAt: new Date().toISOString(),
    };

    this.clients.unshift(newClient);
    safeSetItem(STORAGE_KEYS.CLIENTS, this.clients);

    this.logActivity({
      clientId: newClient.id,
      type: "lead_created",
      description: `New client added directly: ${newClient.name} (${newClient.company || "Individual"})`,
      performedBy,
    });

    this.notify();
    return newClient;
  }

  // --- Follow-ups CRUD ---
  public getFollowUps(): FollowUp[] {
    return [...this.followUps];
  }

  public addFollowUp(
    data: Omit<FollowUp, "id" | "createdAt" | "status" | "completedAt">,
    performedBy = "Admin"
  ): FollowUp {
    const newFollowUp: FollowUp = {
      ...data,
      id: `fu-${Date.now()}`,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    this.followUps.unshift(newFollowUp);
    safeSetItem(STORAGE_KEYS.FOLLOW_UPS, this.followUps);

    // Update lead's next follow up date
    const dateOnly = new Date(data.scheduledAt).toISOString().split("T")[0];
    this.updateLead(data.leadId, { nextFollowUpDate: dateOnly }, performedBy);

    this.logActivity({
      leadId: data.leadId,
      type: "followup_scheduled",
      description: `Scheduled ${data.type} follow-up: "${data.title}" for ${new Date(data.scheduledAt).toLocaleString("en-IN")}`,
      performedBy,
    });

    this.notify();
    return newFollowUp;
  }

  public completeFollowUp(id: string, performedBy = "Admin"): FollowUp | null {
    const index = this.followUps.findIndex((f) => f.id === id);
    if (index === -1) return null;

    const fu = this.followUps[index];
    const updated: FollowUp = {
      ...fu,
      status: "completed",
      completedAt: new Date().toISOString(),
    };

    this.followUps[index] = updated;
    safeSetItem(STORAGE_KEYS.FOLLOW_UPS, this.followUps);

    // Update lead lastContactedAt
    this.updateLead(fu.leadId, { lastContactedAt: new Date().toISOString() }, performedBy);

    this.logActivity({
      leadId: fu.leadId,
      type: "followup_completed",
      description: `Completed ${fu.type} follow-up: "${fu.title}"`,
      performedBy,
    });

    this.notify();
    return updated;
  }

  public deleteFollowUp(id: string): boolean {
    this.followUps = this.followUps.filter((f) => f.id !== id);
    safeSetItem(STORAGE_KEYS.FOLLOW_UPS, this.followUps);
    this.notify();
    return true;
  }

  // --- Activities ---
  public getActivities(): Activity[] {
    return [...this.activities];
  }

  public logActivity(activity: Omit<Activity, "id" | "createdAt">): Activity {
    const newActivity: Activity = {
      ...activity,
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
    };
    this.activities.unshift(newActivity);
    if (this.activities.length > 200) {
      this.activities = this.activities.slice(0, 200);
    }
    safeSetItem(STORAGE_KEYS.ACTIVITIES, this.activities);
    this.notify();
    return newActivity;
  }

  // --- Services ---
  public getServices(): ServiceItem[] {
    // dynamically attach lead counts
    return this.services.map((srv) => ({
      ...srv,
      leadCount: this.leads.filter((l) => l.service.toLowerCase().includes(srv.name.toLowerCase()) || srv.name.toLowerCase().includes(l.service.toLowerCase())).length,
    }));
  }

  public addService(name: string, description: string): ServiceItem {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const newService: ServiceItem = {
      id: `srv-${Date.now()}`,
      name,
      slug,
      description,
      isActive: true,
      leadCount: 0,
    };
    this.services.push(newService);
    safeSetItem(STORAGE_KEYS.SERVICES, this.services);
    this.notify();
    return newService;
  }

  public toggleService(id: string): void {
    this.services = this.services.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s));
    safeSetItem(STORAGE_KEYS.SERVICES, this.services);
    this.notify();
  }

  // --- Team Members ---
  public getTeamMembers(): TeamMember[] {
    return this.teamMembers.map((tm) => ({
      ...tm,
      activeLeadsCount: this.leads.filter((l) => l.assignedTo === tm.name && l.status !== "Won" && l.status !== "Lost").length,
      wonLeadsCount: this.leads.filter((l) => l.assignedTo === tm.name && l.status === "Won").length,
    }));
  }

  public addTeamMember(memberData: Omit<TeamMember, "id">): TeamMember {
    const newMember: TeamMember = {
      ...memberData,
      id: `user-${Date.now()}`,
    };
    this.teamMembers.push(newMember);
    safeSetItem(STORAGE_KEYS.TEAM, this.teamMembers);
    this.notify();
    return newMember;
  }

  // --- CSV Export Utilities ---
  public exportLeadsToCsv(leadsToExport: Lead[] = this.leads): void {
    if (typeof window === "undefined") return;

    const headers = [
      "Lead Code",
      "Full Name",
      "Email",
      "Phone",
      "Company",
      "Service",
      "Status",
      "Priority",
      "Source",
      "Estimated Budget (INR)",
      "Assigned To",
      "Created Date",
      "Next Follow-up",
      "Message",
    ];

    const rows = leadsToExport.map((l) => [
      l.leadCode,
      `"${l.fullName.replace(/"/g, '""')}"`,
      l.email,
      `"${l.phone}"`,
      `"${(l.company || "").replace(/"/g, '""')}"`,
      `"${l.service.replace(/"/g, '""')}"`,
      l.status,
      l.priority,
      l.source,
      l.estimatedBudget,
      `"${l.assignedTo}"`,
      new Date(l.createdAt).toLocaleDateString("en-IN"),
      l.nextFollowUpDate || "None",
      `"${(l.message || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `DMA_Leads_Export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  public exportClientsToCsv(): void {
    if (typeof window === "undefined") return;

    const headers = [
      "Client Code",
      "Client Name",
      "Company",
      "Email",
      "Phone",
      "Services Purchased",
      "Contract Value (INR)",
      "Status",
      "Assigned Manager",
      "Start Date",
      "Notes",
    ];

    const rows = this.clients.map((c) => [
      c.clientCode,
      `"${c.name.replace(/"/g, '""')}"`,
      `"${(c.company || "").replace(/"/g, '""')}"`,
      c.email,
      `"${c.phone}"`,
      `"${c.servicesPurchased.join("; ")}"`,
      c.contractValue,
      c.status,
      `"${c.assignedManager}"`,
      c.projectStartDate,
      `"${(c.notes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `DMA_Clients_Export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export const crmStore = CrmStore.getInstance();
