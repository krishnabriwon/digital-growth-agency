import { describe, expect, it, beforeEach } from "vitest";
import { crmStore } from "@/lib/crm/crm-store";
import type { LeadStatus } from "@/lib/crm/types";

describe("DMA Agency CRM Store", () => {
  beforeEach(() => {
    // Reset/re-init if needed
  });

  it("initializes with agency services and team members", () => {
    const services = crmStore.getServices();
    const team = crmStore.getTeamMembers();

    expect(services.length).toBeGreaterThanOrEqual(12);
    expect(services.some((s) => s.name.includes("SEO"))).toBe(true);
    expect(services.some((s) => s.name.includes("Google Ads"))).toBe(true);

    expect(team.length).toBeGreaterThanOrEqual(4);
    expect(team.some((m) => m.role === "admin")).toBe(true);
  });

  it("can add a new lead and generate unique code", () => {
    const initialCount = crmStore.getLeads().length;

    const newLead = crmStore.addLead({
      fullName: "Test Lead User",
      email: "test.lead@example.com",
      phone: "+91 99999 88888",
      company: "Test Ventures",
      service: "Search Engine Optimization (SEO)",
      message: "Testing lead creation",
      source: "Website Enquiry",
      status: "New",
      priority: "High",
      assignedTo: "Rajesh Verma",
      estimatedBudget: 75000,
    });

    expect(newLead.id).toBeDefined();
    expect(newLead.leadCode).toMatch(/^DMA-\d+$/);
    expect(crmStore.getLeads().length).toBe(initialCount + 1);

    // Verify activity was logged
    const activities = crmStore.getActivities();
    expect(activities.some((a) => a.leadId === newLead.id && a.type === "lead_created")).toBe(true);
  });

  it("can update lead status and records status_changed activity", () => {
    const leads = crmStore.getLeads();
    const lead = leads[0];
    const prevStatus = lead.status;
    const nextStatus: LeadStatus = prevStatus === "Qualified" ? "Proposal Sent" : "Qualified";

    const updated = crmStore.updateLead(lead.id, { status: nextStatus }, "Krishna");

    expect(updated?.status).toBe(nextStatus);

    const activities = crmStore.getActivities();
    expect(
      activities.some(
        (a) => a.leadId === lead.id && a.type === "status_changed" && a.description.includes(nextStatus)
      )
    ).toBe(true);
  });

  it("converts a won lead into a client without losing lead history", () => {
    const leads = crmStore.getLeads();
    const lead = leads[0];
    const initialClientsCount = crmStore.getClients().length;

    const client = crmStore.convertLeadToClient(
      lead.id,
      {
        contractValue: 90000,
        projectStartDate: "2026-11-20",
        assignedManager: "Krishna",
        servicesPurchased: [lead.service],
        notes: "Onboarding completed successfully.",
      },
      "Krishna"
    );

    expect(client).not.toBeNull();
    expect(client?.leadId).toBe(lead.id);
    expect(client?.clientCode).toMatch(/^DMA-CLI-\d+$/);
    expect(client?.contractValue).toBe(90000);
    expect(crmStore.getClients().length).toBe(initialClientsCount + 1);

    // Verify lead status is Won
    const updatedLead = crmStore.getLeadById(lead.id);
    expect(updatedLead?.status).toBe("Won");
  });

  it("schedules and completes follow-ups", () => {
    const leads = crmStore.getLeads();
    const lead = leads[0];

    const followUp = crmStore.addFollowUp({
      leadId: lead.id,
      leadName: lead.fullName,
      leadCompany: lead.company,
      leadPhone: lead.phone,
      title: "Quarterly Strategy Review",
      type: "Meeting",
      scheduledAt: new Date(Date.now() + 86400000).toISOString(),
      notes: "Discuss performance and new campaigns",
      createdBy: "Rajesh Verma",
    });

    expect(followUp.status).toBe("pending");
    expect(crmStore.getFollowUps().some((f) => f.id === followUp.id)).toBe(true);

    // Complete follow up
    const completed = crmStore.completeFollowUp(followUp.id, "Rajesh Verma");
    expect(completed?.status).toBe("completed");
    expect(completed?.completedAt).toBeDefined();
  });
});
