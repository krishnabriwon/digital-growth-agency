import { useState, useMemo } from "react";
import { crmStore } from "@/lib/crm/crm-store";
import { AGENCY_SERVICES, TEAM_MEMBERS } from "@/lib/crm/mock-data";
import type { Lead, LeadStatus, LeadPriority, LeadSource } from "@/lib/crm/types";
import {
  Search,
  Filter,
  Plus,
  Download,
  RefreshCw,
  LayoutGrid,
  List,
  MoreVertical,
  Calendar,
  DollarSign,
  Phone,
  Mail,
  Building,
  User,
  Clock,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Edit,
  Award,
  CheckCircle,
  AlertCircle,
  Eye,
  X,
  FileSpreadsheet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const STATUSES: LeadStatus[] = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal Sent",
  "Negotiation",
  "Won",
  "Lost",
];

const PRIORITIES: LeadPriority[] = ["Low", "Medium", "High", "Urgent"];

const SOURCES: LeadSource[] = [
  "Website Enquiry",
  "Google Ads",
  "Meta Ads",
  "Organic Search",
  "LinkedIn",
  "Referral",
  "Direct",
  "Cold Outreach",
];

export function LeadsTab({
  selectedLeadForDetails,
  onClearSelectedLead,
}: {
  selectedLeadForDetails?: Lead | null;
  onClearSelectedLead?: () => void;
}) {
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");

  // Selection & Pagination
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [viewingLead, setViewingLead] = useState<Lead | null>(selectedLeadForDetails || null);
  const [leadToConvert, setLeadToConvert] = useState<Lead | null>(null);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  // Google Sheets Sync Modal States
  const [isSheetModalOpen, setIsSheetModalOpen] = useState(false);
  const [sheetUrl, setSheetUrl] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem("dma_google_sheet_url") || "" : ""
  );
  const [sheetPasteText, setSheetPasteText] = useState("");
  const [sheetSyncing, setSheetSyncing] = useState(false);
  const [sheetSyncResult, setSheetSyncResult] = useState<{ success: boolean; message: string } | null>(null);
  const [sheetSyncTab, setSheetSyncTab] = useState<"url" | "paste">("url");

  // Form states for Add Lead
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    service: AGENCY_SERVICES[0].name,
    message: "",
    source: "Website Enquiry" as LeadSource,
    priority: "Medium" as LeadPriority,
    status: "New" as LeadStatus,
    assignedTo: TEAM_MEMBERS[0].name,
    estimatedBudget: 50000,
    notes: "",
  });

  // Client conversion form state
  const [convertData, setConvertData] = useState({
    contractValue: 75000,
    projectStartDate: new Date().toISOString().split("T")[0],
    assignedManager: TEAM_MEMBERS[0].name,
    servicesPurchased: [AGENCY_SERVICES[0].name],
    notes: "",
  });

  // Note addition inside viewing drawer
  const [newNoteText, setNewNoteText] = useState("");

  const leads = crmStore.getLeads();

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          lead.fullName.toLowerCase().includes(q) ||
          lead.email.toLowerCase().includes(q) ||
          lead.phone.toLowerCase().includes(q) ||
          (lead.company && lead.company.toLowerCase().includes(q)) ||
          lead.leadCode.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (statusFilter !== "all" && lead.status !== statusFilter) return false;
      if (priorityFilter !== "all" && lead.priority !== priorityFilter) return false;
      if (serviceFilter !== "all" && lead.service !== serviceFilter) return false;
      if (sourceFilter !== "all" && lead.source !== sourceFilter) return false;
      return true;
    });
  }, [leads, searchQuery, statusFilter, priorityFilter, serviceFilter, sourceFilter]);

  // Paginated Leads for Table View
  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLeads.slice(start, start + pageSize);
  }, [filteredLeads, currentPage]);

  const totalPages = Math.ceil(filteredLeads.length / pageSize) || 1;

  // Sync with Supabase
  const handleSyncWebsiteEnquiries = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    const res = await crmStore.syncWithSupabase();
    setIsSyncing(false);
    setSyncFeedback(res.message);
    setTimeout(() => setSyncFeedback(null), 5000);
  };

  // Sync Google Sheet by URL
  const handleFetchSheet = async () => {
    if (!sheetUrl.trim()) {
      setSheetSyncResult({ success: false, message: "Please enter your Google Sheet URL or Sheet ID." });
      return;
    }
    setSheetSyncing(true);
    setSheetSyncResult(null);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("dma_google_sheet_url", sheetUrl.trim());
      }
      const { fetchGoogleSheetLeadsFn } = await import("@/lib/google-sheets.server");
      const res = await fetchGoogleSheetLeadsFn({ data: { sheetUrl: sheetUrl.trim() } });
      if (!res.ok) {
        setSheetSyncResult({ success: false, message: res.error || "Could not fetch Google Sheet." });
      } else {
        const count = crmStore.importGoogleSheetRows(res.rows);
        setSheetSyncResult({
          success: true,
          message: `Successfully imported ${count} new lead(s) from your Google Sheet!`,
        });
      }
    } catch (err) {
      setSheetSyncResult({
        success: false,
        message: err instanceof Error ? err.message : "Error connecting to Google Sheet.",
      });
    } finally {
      setSheetSyncing(false);
    }
  };

  // Import directly pasted rows from Google Sheet
  const handleImportPastedSheet = () => {
    if (!sheetPasteText.trim()) {
      setSheetSyncResult({ success: false, message: "Please paste your copied sheet rows." });
      return;
    }
    try {
      const lines = sheetPasteText.split(/\r?\n/).filter((l) => l.trim().length > 0);
      const rows: Array<{
        fullName: string;
        email: string;
        phone: string;
        company?: string;
        service: string;
        message: string;
        submittedAt?: string;
      }> = [];

      for (const line of lines) {
        const parts = line.includes("\t") ? line.split("\t") : line.split(",");
        const cleanParts = parts.map((p) => p.trim().replace(/^"|"$/g, ""));
        if (cleanParts.length < 2) continue;

        const firstCol = cleanParts[0].toLowerCase();
        if (firstCol.includes("timestamp") || firstCol.includes("date") || firstCol.includes("name")) {
          continue;
        }

        const hasTimestamp = /^\d{1,4}[-/.]\d{1,2}[-/.]\d{1,4}/.test(cleanParts[0]) || /:\d{2}/.test(cleanParts[0]);
        const offset = hasTimestamp ? 1 : 0;

        const fullName = cleanParts[offset] || "";
        const email = cleanParts[offset + 1] || "";
        const phone = cleanParts[offset + 2] || "";
        const company = cleanParts[offset + 3] || undefined;
        const service = cleanParts[offset + 4] || "Website Marketing Enquiry";
        const message = cleanParts[offset + 5] || "Enquiry from Google Sheet";
        const submittedAt = hasTimestamp ? cleanParts[0] : undefined;

        if (fullName && (email || phone)) {
          rows.push({ fullName, email, phone, company, service, message, submittedAt });
        }
      }

      if (rows.length === 0) {
        setSheetSyncResult({
          success: false,
          message: "No valid rows detected. Make sure to copy the rows including Name and Email/Phone.",
        });
        return;
      }

      const count = crmStore.importGoogleSheetRows(rows);
      setSheetSyncResult({
        success: true,
        message: `Successfully imported ${count} new lead(s) from pasted rows!`,
      });
      setSheetPasteText("");
    } catch (err) {
      setSheetSyncResult({
        success: false,
        message: err instanceof Error ? err.message : "Error parsing pasted rows.",
      });
    }
  };

  // Add Lead Handler
  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      alert("Please fill in required fields (Name, Email, Phone).");
      return;
    }
    crmStore.addLead({
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      company: formData.company.trim() || undefined,
      service: formData.service,
      message: formData.message.trim(),
      source: formData.source,
      priority: formData.priority,
      status: formData.status,
      assignedTo: formData.assignedTo,
      estimatedBudget: Number(formData.estimatedBudget) || 50000,
      notes: formData.notes.trim() || undefined,
    });
    setIsAddModalOpen(false);
    // Reset form
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      company: "",
      service: AGENCY_SERVICES[0].name,
      message: "",
      source: "Website Enquiry",
      priority: "Medium",
      status: "New",
      assignedTo: TEAM_MEMBERS[0].name,
      estimatedBudget: 50000,
      notes: "",
    });
  };

  // Edit Lead Handler
  const handleUpdateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLead) return;
    crmStore.updateLead(editingLead.id, {
      fullName: editingLead.fullName,
      email: editingLead.email,
      phone: editingLead.phone,
      company: editingLead.company,
      service: editingLead.service,
      message: editingLead.message,
      source: editingLead.source,
      priority: editingLead.priority,
      status: editingLead.status,
      assignedTo: editingLead.assignedTo,
      estimatedBudget: Number(editingLead.estimatedBudget) || 50000,
      notes: editingLead.notes,
    });
    setEditingLead(null);
  };

  // Delete Handler
  const handleConfirmDelete = () => {
    if (!leadToDelete) return;
    crmStore.deleteLead(leadToDelete.id);
    setLeadToDelete(null);
    if (viewingLead?.id === leadToDelete.id) {
      setViewingLead(null);
    }
  };

  // Bulk Status Update
  const handleBulkStatusChange = (newStatus: LeadStatus) => {
    if (selectedIds.length === 0) return;
    crmStore.bulkUpdateLeadStatus(selectedIds, newStatus);
    setSelectedIds([]);
  };

  // Bulk Delete
  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedIds.length} selected leads?`)) {
      selectedIds.forEach((id) => crmStore.deleteLead(id));
      setSelectedIds([]);
    }
  };

  // Convert to Client
  const handleConfirmConvert = () => {
    if (!leadToConvert) return;
    crmStore.convertLeadToClient(leadToConvert.id, {
      contractValue: Number(convertData.contractValue),
      projectStartDate: convertData.projectStartDate,
      assignedManager: convertData.assignedManager,
      servicesPurchased: convertData.servicesPurchased,
      notes: convertData.notes,
    });
    setLeadToConvert(null);
  };

  // Quick move Kanban stage
  const handleMoveKanban = (lead: Lead, direction: "next" | "prev") => {
    const currentIndex = STATUSES.indexOf(lead.status);
    const newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= 0 && newIndex < STATUSES.length) {
      const nextStatus = STATUSES[newIndex];
      crmStore.updateLead(lead.id, { status: nextStatus });
    }
  };

  // Append internal note
  const handleAddNoteToViewingLead = () => {
    if (!viewingLead || !newNoteText.trim()) return;
    const updatedNotes = viewingLead.notes
      ? `${viewingLead.notes}\n\n[${new Date().toLocaleDateString("en-IN")}] ${newNoteText.trim()}`
      : `[${new Date().toLocaleDateString("en-IN")}] ${newNoteText.trim()}`;
    const updated = crmStore.updateLead(viewingLead.id, { notes: updatedNotes });
    crmStore.logActivity({
      leadId: viewingLead.id,
      type: "note_added",
      description: `Note added: "${newNoteText.trim()}"`,
      performedBy: "Admin",
    });
    if (updated) setViewingLead(updated);
    setNewNoteText("");
  };

  return (
    <div className="space-y-5">
      {/* Top Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-[#092B55]">Lead & Enquiries Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Capture, qualify, assign, and advance potential agency clients through the sales pipeline.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === "table" ? "bg-white text-[#087BEA] shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <List className="w-3.5 h-3.5" /> Table
            </button>
            <button
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === "kanban" ? "bg-white text-[#087BEA] shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Kanban
            </button>
          </div>

          {/* Sync Website Enquiries */}
          <Button
            size="sm"
            variant="outline"
            disabled={isSyncing}
            onClick={handleSyncWebsiteEnquiries}
            className="h-9 text-xs border-blue-200 text-[#087BEA] bg-blue-50/50 hover:bg-blue-100/60"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isSyncing ? "animate-spin" : ""}`} />
            Sync Website
          </Button>

          {/* Sync Google Sheet */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setIsSheetModalOpen(true);
              setSheetSyncResult(null);
            }}
            className="h-9 text-xs border-emerald-200 text-emerald-700 bg-emerald-50/60 hover:bg-emerald-100/70 font-semibold"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
            Sync Google Sheet
          </Button>

          {/* Export to CSV */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => crmStore.exportLeadsToCsv(filteredLeads)}
            className="h-9 text-xs border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export CSV
          </Button>

          {/* Add New Lead Button */}
          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="h-9 text-xs bg-[#087BEA] hover:bg-[#087BEA]/90 text-white shadow-sm shadow-[#087BEA]/20"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Sync Feedback Message */}
      {syncFeedback && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-xl animate-fade-in">
          <CheckCircle className="w-4 h-4 text-[#087BEA] shrink-0" />
          <span>{syncFeedback}</span>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Instant Search */}
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search name, email, code..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 h-9 text-xs bg-slate-50 border-slate-200 rounded-xl"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#087BEA]"
            >
              <option value="all">All Statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#087BEA]"
            >
              <option value="all">All Priorities</option>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Service Filter */}
          <div>
            <select
              value={serviceFilter}
              onChange={(e) => {
                setServiceFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#087BEA] truncate"
            >
              <option value="all">All Services</option>
              {AGENCY_SERVICES.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Source Filter */}
          <div>
            <select
              value={sourceFilter}
              onChange={(e) => {
                setSourceFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#087BEA]"
            >
              <option value="all">All Sources</option>
              {SOURCES.map((src) => (
                <option key={src} value={src}>
                  {src}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter results summary & reset */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>
            Showing <strong className="text-slate-800">{filteredLeads.length}</strong> lead{filteredLeads.length === 1 ? "" : "s"}
          </span>
          {(searchQuery || statusFilter !== "all" || priorityFilter !== "all" || serviceFilter !== "all" || sourceFilter !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setPriorityFilter("all");
                setServiceFilter("all");
                setSourceFilter("all");
                setCurrentPage(1);
              }}
              className="text-[#087BEA] hover:underline font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Bulk Actions Bar (When checkboxes selected) */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-[#092B55] shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="font-bold bg-[#087BEA] text-white px-2 py-0.5 rounded-full text-[11px]">
              {selectedIds.length}
            </span>
            <span>lead{selectedIds.length > 1 ? "s" : ""} selected</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">Bulk Update:</span>
            <select
              onChange={(e) => {
                if (e.target.value) {
                  handleBulkStatusChange(e.target.value as LeadStatus);
                  e.target.value = "";
                }
              }}
              className="h-8 px-2.5 text-xs bg-white border border-blue-300 rounded-lg text-slate-700 focus:outline-none"
            >
              <option value="">Change Status To...</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <Button
              size="sm"
              variant="outline"
              onClick={handleBulkDelete}
              className="h-8 text-xs border-red-200 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete Selected
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedIds([])}
              className="h-8 text-xs text-slate-500 hover:bg-slate-100"
            >
              Deselect All
            </Button>
          </div>
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === "table" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 pl-4 w-8">
                    <input
                      type="checkbox"
                      checked={paginatedLeads.length > 0 && selectedIds.length === paginatedLeads.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds(paginatedLeads.map((l) => l.id));
                        } else {
                          setSelectedIds([]);
                        }
                      }}
                      className="rounded border-slate-300 text-[#087BEA] focus:ring-[#087BEA]"
                    />
                  </th>
                  <th className="py-3.5 px-3">Lead Code</th>
                  <th className="py-3.5 px-3">Contact Person</th>
                  <th className="py-3.5 px-3">Phone & Email</th>
                  <th className="py-3.5 px-3">Interested Service</th>
                  <th className="py-3.5 px-3">Source</th>
                  <th className="py-3.5 px-3">Priority</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-3">Est. Budget</th>
                  <th className="py-3.5 px-3">Next Follow-up</th>
                  <th className="py-3.5 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedLeads.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-12 text-center text-slate-400">
                      <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      <p className="font-medium text-slate-600">No leads match your search criteria</p>
                      <p className="text-xs text-slate-400 mt-1">Try clearing filters or add a new lead.</p>
                    </td>
                  </tr>
                ) : (
                  paginatedLeads.map((lead) => {
                    const isChecked = selectedIds.includes(lead.id);
                    return (
                      <tr
                        key={lead.id}
                        className={`hover:bg-slate-50/80 transition-colors ${isChecked ? "bg-blue-50/40" : ""}`}
                      >
                        <td className="py-3.5 pl-4">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedIds((prev) => [...prev, lead.id]);
                              } else {
                                setSelectedIds((prev) => prev.filter((id) => id !== lead.id));
                              }
                            }}
                            className="rounded border-slate-300 text-[#087BEA] focus:ring-[#087BEA]"
                          />
                        </td>
                        <td className="py-3.5 px-3 font-mono font-bold text-[#087BEA]">
                          <button
                            onClick={() => setViewingLead(lead)}
                            className="hover:underline text-left"
                          >
                            {lead.leadCode}
                          </button>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="font-semibold text-slate-900">{lead.fullName}</div>
                          {lead.company && (
                            <div className="text-[11px] text-slate-500 flex items-center gap-1">
                              <Building className="w-3 h-3 text-slate-400" /> {lead.company}
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-3 text-[11px] text-slate-600">
                          <div>{lead.phone}</div>
                          <div className="text-slate-400 truncate max-w-[150px]">{lead.email}</div>
                        </td>
                        <td className="py-3.5 px-3 max-w-[160px] truncate font-medium text-slate-800">
                          {lead.service}
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700">
                            {lead.source}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              lead.priority === "Urgent"
                                ? "bg-red-100 text-red-700"
                                : lead.priority === "High"
                                ? "bg-orange-100 text-orange-700"
                                : lead.priority === "Medium"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {lead.priority}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <select
                            value={lead.status}
                            onChange={(e) => {
                              crmStore.updateLead(lead.id, { status: e.target.value as LeadStatus });
                            }}
                            className={`h-7 px-2 text-[11px] font-semibold rounded-lg border focus:outline-none ${
                              lead.status === "Won"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                                : lead.status === "Lost"
                                ? "bg-rose-50 text-rose-700 border-rose-300"
                                : "bg-blue-50 text-[#087BEA] border-blue-200"
                            }`}
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3.5 px-3 font-semibold text-slate-900">
                          ₹{lead.estimatedBudget.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3.5 px-3 text-[11px] text-slate-600">
                          {lead.nextFollowUpDate ? (
                            <span className="flex items-center gap-1 text-[#087BEA] font-medium">
                              <Calendar className="w-3 h-3" /> {lead.nextFollowUpDate}
                            </span>
                          ) : (
                            <span className="text-slate-400">None set</span>
                          )}
                        </td>
                        <td className="py-3.5 pr-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setViewingLead(lead)}
                              title="View Details"
                              className="h-7 w-7 p-0 text-slate-600 hover:text-[#087BEA] hover:bg-blue-50"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingLead(lead)}
                              title="Edit Lead"
                              className="h-7 w-7 p-0 text-slate-600 hover:text-[#087BEA] hover:bg-blue-50"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </Button>
                            {lead.status === "Won" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setLeadToConvert(lead);
                                  setConvertData({
                                    contractValue: lead.estimatedBudget,
                                    projectStartDate: new Date().toISOString().split("T")[0],
                                    assignedManager: lead.assignedTo || TEAM_MEMBERS[0].name,
                                    servicesPurchased: [lead.service],
                                    notes: lead.notes || "",
                                  });
                                }}
                                title="Convert to Client"
                                className="h-7 px-2 text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg"
                              >
                                <Award className="w-3 h-3 mr-1" /> Convert
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setLeadToDelete(lead)}
                              title="Delete Lead"
                              className="h-7 w-7 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-200 bg-slate-50/50 text-xs text-slate-500">
              <div>
                Showing {(currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(currentPage * pageSize, filteredLeads.length)} of {filteredLeads.length} leads
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="h-7 px-2.5 text-xs"
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${
                      currentPage === p ? "bg-[#087BEA] text-white" : "text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="h-7 px-2.5 text-xs"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* KANBAN PIPELINE VIEW */}
      {viewMode === "kanban" && (
        <div className="overflow-x-auto pb-4">
          <div className="flex items-start gap-4 min-w-[1300px]">
            {STATUSES.map((status) => {
              const columnLeads = filteredLeads.filter((l) => l.status === status);
              const columnValue = columnLeads.reduce((acc, l) => acc + (l.estimatedBudget || 0), 0);

              return (
                <div
                  key={status}
                  className="w-80 shrink-0 bg-slate-100/70 rounded-2xl border border-slate-200 p-3 flex flex-col max-h-[750px]"
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/80">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-[#092B55]">{status}</span>
                      <span className="w-5 h-5 flex items-center justify-center rounded-full bg-white border border-slate-200 text-[10px] font-bold text-slate-700">
                        {columnLeads.length}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500">
                      ₹{columnValue.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* Cards Container */}
                  <div className="overflow-y-auto space-y-2.5 flex-1 pr-1">
                    {columnLeads.length === 0 ? (
                      <div className="py-8 text-center text-[11px] text-slate-400 border border-dashed border-slate-200 rounded-xl bg-white/40">
                        No leads in {status}
                      </div>
                    ) : (
                      columnLeads.map((lead) => (
                        <div
                          key={lead.id}
                          className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-2.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[11px] font-bold text-[#087BEA]">
                              {lead.leadCode}
                            </span>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                                lead.priority === "Urgent"
                                  ? "bg-red-100 text-red-700"
                                  : lead.priority === "High"
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {lead.priority}
                            </span>
                          </div>

                          <div>
                            <h4
                              onClick={() => setViewingLead(lead)}
                              className="font-bold text-xs text-slate-900 cursor-pointer hover:text-[#087BEA]"
                            >
                              {lead.fullName}
                            </h4>
                            {lead.company && (
                              <p className="text-[11px] text-slate-500 truncate">{lead.company}</p>
                            )}
                          </div>

                          <div className="text-[11px] text-slate-600 line-clamp-1 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                            {lead.service}
                          </div>

                          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                            <span className="font-bold text-slate-900">
                              ₹{lead.estimatedBudget.toLocaleString("en-IN")}
                            </span>
                            <span className="text-slate-400 text-[10px]">{lead.assignedTo}</span>
                          </div>

                          {/* Quick Stage Transition & Convert Controls */}
                          <div className="flex items-center justify-between pt-1">
                            <button
                              disabled={STATUSES.indexOf(lead.status) === 0}
                              onClick={() => handleMoveKanban(lead, "prev")}
                              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-20"
                              title="Move back"
                            >
                              <ArrowLeft className="w-3.5 h-3.5" />
                            </button>

                            {lead.status === "Won" && (
                              <button
                                onClick={() => {
                                  setLeadToConvert(lead);
                                  setConvertData({
                                    contractValue: lead.estimatedBudget,
                                    projectStartDate: new Date().toISOString().split("T")[0],
                                    assignedManager: lead.assignedTo || TEAM_MEMBERS[0].name,
                                    servicesPurchased: [lead.service],
                                    notes: lead.notes || "",
                                  });
                                }}
                                className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold hover:bg-emerald-100"
                              >
                                Convert to Client
                              </button>
                            )}

                            <button
                              disabled={STATUSES.indexOf(lead.status) === STATUSES.length - 1}
                              onClick={() => handleMoveKanban(lead, "next")}
                              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-20"
                              title="Move forward"
                            >
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW LEAD DETAILS DRAWER / MODAL */}
      {viewingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#087BEA] font-bold flex items-center justify-center font-mono text-sm">
                  {viewingLead.leadCode.replace("DMA-", "")}
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#092B55] flex items-center gap-2">
                    {viewingLead.fullName}
                    <Badge variant="outline" className="text-[10px] bg-blue-50 text-[#087BEA] border-blue-200">
                      {viewingLead.status}
                    </Badge>
                  </h3>
                  <p className="text-xs text-slate-500">{viewingLead.company || "Individual Customer"}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setViewingLead(null);
                  if (onClearSelectedLead) onClearSelectedLead();
                }}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* Key details grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 bg-slate-50/80 p-4 rounded-xl border border-slate-200/60">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Email</span>
                  <p className="font-semibold text-slate-900 mt-0.5">{viewingLead.email}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Phone</span>
                  <p className="font-semibold text-slate-900 mt-0.5">{viewingLead.phone}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Est. Budget</span>
                  <p className="font-semibold text-[#087BEA] mt-0.5">
                    ₹{viewingLead.estimatedBudget.toLocaleString("en-IN")}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Source</span>
                  <p className="font-medium text-slate-700 mt-0.5">{viewingLead.source}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Priority</span>
                  <p className="font-bold text-slate-800 mt-0.5">{viewingLead.priority}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Assigned Specialist</span>
                  <p className="font-medium text-slate-800 mt-0.5">{viewingLead.assignedTo}</p>
                </div>
              </div>

              {/* Interested Service & Client Message */}
              <div>
                <Label className="text-xs font-bold text-slate-700">Requested Agency Service</Label>
                <div className="mt-1 p-2.5 rounded-xl bg-blue-50/60 border border-blue-200/60 text-slate-800 font-semibold">
                  {viewingLead.service}
                </div>
              </div>

              <div>
                <Label className="text-xs font-bold text-slate-700">Project Requirements / Client Message</Label>
                <div className="mt-1 p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {viewingLead.message || "No initial message provided."}
                </div>
              </div>

              {/* Internal Notes */}
              <div>
                <Label className="text-xs font-bold text-slate-700">Internal Agency Notes</Label>
                <div className="mt-1 p-3 rounded-xl bg-amber-50/50 border border-amber-200/60 text-slate-800 whitespace-pre-wrap">
                  {viewingLead.notes || "No internal notes added yet."}
                </div>

                <div className="mt-2.5 flex gap-2">
                  <Input
                    placeholder="Add an internal follow-up note..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    className="h-9 text-xs bg-white border-slate-200 rounded-xl"
                  />
                  <Button
                    size="sm"
                    onClick={handleAddNoteToViewingLead}
                    disabled={!newNoteText.trim()}
                    className="h-9 text-xs bg-[#087BEA] text-white hover:bg-[#087BEA]/90 shrink-0"
                  >
                    Add Note
                  </Button>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-slate-200 bg-slate-50/60 flex items-center justify-between">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setLeadToDelete(viewingLead);
                }}
                className="text-xs"
              >
                Delete Lead
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingLead(viewingLead);
                    setViewingLead(null);
                  }}
                  className="text-xs"
                >
                  <Edit className="w-3.5 h-3.5 mr-1" /> Edit Lead
                </Button>

                {viewingLead.status === "Won" && (
                  <Button
                    size="sm"
                    onClick={() => {
                      setLeadToConvert(viewingLead);
                      setConvertData({
                        contractValue: viewingLead.estimatedBudget,
                        projectStartDate: new Date().toISOString().split("T")[0],
                        assignedManager: viewingLead.assignedTo || TEAM_MEMBERS[0].name,
                        servicesPurchased: [viewingLead.service],
                        notes: viewingLead.notes || "",
                      });
                      setViewingLead(null);
                    }}
                    className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <Award className="w-3.5 h-3.5 mr-1" /> Convert to Client
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD NEW LEAD MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50/60">
              <h3 className="font-bold text-base text-[#092B55]">Add New Agency Lead</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Full Name *</Label>
                  <Input
                    required
                    placeholder="e.g. Vikram Singhania"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="h-9 text-xs rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Company Name</Label>
                  <Input
                    placeholder="e.g. Apex Global Tech"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="h-9 text-xs rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Email Address *</Label>
                  <Input
                    required
                    type="email"
                    placeholder="vikram@apextech.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-9 text-xs rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Contact Number *</Label>
                  <Input
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="h-9 text-xs rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Interested Service</Label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full h-9 px-3 text-xs bg-white border border-slate-200 rounded-xl text-slate-700"
                  >
                    {AGENCY_SERVICES.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Lead Source</Label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value as LeadSource })}
                    className="w-full h-9 px-3 text-xs bg-white border border-slate-200 rounded-xl text-slate-700"
                  >
                    {SOURCES.map((src) => (
                      <option key={src} value={src}>
                        {src}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Priority Level</Label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as LeadPriority })}
                    className="w-full h-9 px-3 text-xs bg-white border border-slate-200 rounded-xl text-slate-700"
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Status</Label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as LeadStatus })}
                    className="w-full h-9 px-3 text-xs bg-white border border-slate-200 rounded-xl text-slate-700"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Estimated Budget (₹)</Label>
                  <Input
                    type="number"
                    value={formData.estimatedBudget}
                    onChange={(e) => setFormData({ ...formData, estimatedBudget: Number(e.target.value) })}
                    className="h-9 text-xs rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Assign To Team Member</Label>
                <select
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  className="w-full h-9 px-3 text-xs bg-white border border-slate-200 rounded-xl text-slate-700"
                >
                  {TEAM_MEMBERS.map((tm) => (
                    <option key={tm.id} value={tm.name}>
                      {tm.name} ({tm.title})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Project Requirements / Message</Label>
                <Textarea
                  placeholder="Describe client goals, current pain points, and target deliverables..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="text-xs rounded-xl min-h-[70px]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="text-xs bg-[#087BEA] hover:bg-[#087BEA]/90 text-white"
                >
                  Save Lead
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT LEAD MODAL */}
      {editingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50/60">
              <h3 className="font-bold text-base text-[#092B55]">
                Edit Lead: {editingLead.leadCode}
              </h3>
              <button
                onClick={() => setEditingLead(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateLead} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Full Name</Label>
                  <Input
                    required
                    value={editingLead.fullName}
                    onChange={(e) => setEditingLead({ ...editingLead, fullName: e.target.value })}
                    className="h-9 text-xs rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Company Name</Label>
                  <Input
                    value={editingLead.company || ""}
                    onChange={(e) => setEditingLead({ ...editingLead, company: e.target.value })}
                    className="h-9 text-xs rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Email Address</Label>
                  <Input
                    required
                    type="email"
                    value={editingLead.email}
                    onChange={(e) => setEditingLead({ ...editingLead, email: e.target.value })}
                    className="h-9 text-xs rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Contact Number</Label>
                  <Input
                    required
                    value={editingLead.phone}
                    onChange={(e) => setEditingLead({ ...editingLead, phone: e.target.value })}
                    className="h-9 text-xs rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Status</Label>
                  <select
                    value={editingLead.status}
                    onChange={(e) => setEditingLead({ ...editingLead, status: e.target.value as LeadStatus })}
                    className="w-full h-9 px-3 text-xs bg-white border border-slate-200 rounded-xl text-slate-700"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Priority</Label>
                  <select
                    value={editingLead.priority}
                    onChange={(e) => setEditingLead({ ...editingLead, priority: e.target.value as LeadPriority })}
                    className="w-full h-9 px-3 text-xs bg-white border border-slate-200 rounded-xl text-slate-700"
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Est. Budget (₹)</Label>
                  <Input
                    type="number"
                    value={editingLead.estimatedBudget}
                    onChange={(e) => setEditingLead({ ...editingLead, estimatedBudget: Number(e.target.value) })}
                    className="h-9 text-xs rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Assigned Team Member</Label>
                <select
                  value={editingLead.assignedTo}
                  onChange={(e) => setEditingLead({ ...editingLead, assignedTo: e.target.value })}
                  className="w-full h-9 px-3 text-xs bg-white border border-slate-200 rounded-xl text-slate-700"
                >
                  {TEAM_MEMBERS.map((tm) => (
                    <option key={tm.id} value={tm.name}>
                      {tm.name} ({tm.title})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Internal Notes</Label>
                <Textarea
                  value={editingLead.notes || ""}
                  onChange={(e) => setEditingLead({ ...editingLead, notes: e.target.value })}
                  className="text-xs rounded-xl min-h-[80px]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingLead(null)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="text-xs bg-[#087BEA] hover:bg-[#087BEA]/90 text-white"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONVERT TO CLIENT MODAL */}
      {leadToConvert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-slate-200 bg-emerald-50/70 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-emerald-950">Convert Lead to Client</h3>
                  <p className="text-xs text-emerald-700">{leadToConvert.fullName} ({leadToConvert.leadCode})</p>
                </div>
              </div>
              <button
                onClick={() => setLeadToConvert(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Contract Value (₹ / Retainer) *</Label>
                <Input
                  type="number"
                  value={convertData.contractValue}
                  onChange={(e) => setConvertData({ ...convertData, contractValue: Number(e.target.value) })}
                  className="h-9 text-xs rounded-xl font-bold text-emerald-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Project Start Date</Label>
                  <Input
                    type="date"
                    value={convertData.projectStartDate}
                    onChange={(e) => setConvertData({ ...convertData, projectStartDate: e.target.value })}
                    className="h-9 text-xs rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Account Manager</Label>
                  <select
                    value={convertData.assignedManager}
                    onChange={(e) => setConvertData({ ...convertData, assignedManager: e.target.value })}
                    className="w-full h-9 px-3 text-xs bg-white border border-slate-200 rounded-xl text-slate-700"
                  >
                    {TEAM_MEMBERS.map((tm) => (
                      <option key={tm.id} value={tm.name}>
                        {tm.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Onboarding Notes & Deliverables</Label>
                <Textarea
                  placeholder="Onboarding deliverables, reporting cycle, and kickoff date..."
                  value={convertData.notes}
                  onChange={(e) => setConvertData({ ...convertData, notes: e.target.value })}
                  className="text-xs rounded-xl min-h-[70px]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLeadToConvert(null)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleConfirmConvert}
                  className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                >
                  Create Client Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {leadToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-sm p-6 text-center animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Delete Lead?</h3>
            <p className="text-xs text-slate-500 mt-1.5">
              Are you sure you want to permanently remove{" "}
              <strong className="text-slate-800">{leadToDelete.fullName}</strong> ({leadToDelete.leadCode})?
              All linked follow-ups will also be removed.
            </p>
            <div className="flex items-center justify-center gap-2 mt-5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLeadToDelete(null)}
                className="text-xs w-24"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleConfirmDelete}
                className="text-xs w-24"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* GOOGLE SHEETS SYNC / IMPORT MODAL */}
      {isSheetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Sync from Google Sheets</h3>
                  <p className="text-[11px] text-slate-500">Import enquiries recorded in your Google Sheet</p>
                </div>
              </div>
              <button
                onClick={() => setIsSheetModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sync Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <button
                onClick={() => setSheetSyncTab("url")}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                  sheetSyncTab === "url"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                1-Click Sheet Link Sync
              </button>
              <button
                onClick={() => setSheetSyncTab("paste")}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                  sheetSyncTab === "paste"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Copy & Paste Rows
              </button>
            </div>

            {sheetSyncResult && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  sheetSyncResult.success
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {sheetSyncResult.success ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                )}
                <span>{sheetSyncResult.message}</span>
              </div>
            )}

            {sheetSyncTab === "url" ? (
              <div className="space-y-3 text-xs">
                <div>
                  <Label className="text-xs font-semibold text-slate-700">Google Sheet URL or Sheet ID</Label>
                  <p className="text-[11px] text-slate-500 mb-1.5">
                    Copy the URL of your <strong>WEBSITE LEADS</strong> sheet from your browser tab and paste it below:
                  </p>
                  <Input
                    type="url"
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                    value={sheetUrl}
                    onChange={(e) => setSheetUrl(e.target.value)}
                    className="h-9 text-xs rounded-xl"
                  />
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                  <p className="font-semibold text-slate-800">Quick Setup Tip:</p>
                  <p>In your Google Sheet, click <strong>Share</strong> (top right) → Change to <strong>"Anyone with the link can view"</strong> so the CRM can automatically pull the leads.</p>
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsSheetModalOpen(false)}
                    className="text-xs"
                  >
                    Close
                  </Button>
                  <Button
                    size="sm"
                    disabled={sheetSyncing}
                    onClick={handleFetchSheet}
                    className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                  >
                    {sheetSyncing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Syncing...
                      </>
                    ) : (
                      "Fetch & Import Leads"
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <Label className="text-xs font-semibold text-slate-700">Paste Rows from Google Sheet</Label>
                  <p className="text-[11px] text-slate-500 mb-1.5">
                    Select & copy rows from your <strong>WEBSITE LEADS</strong> sheet (Ctrl+C) and paste them here (Ctrl+V):
                  </p>
                  <Textarea
                    placeholder="21/11/2026&#9;Aarav Sharma&#9;aarav@example.com&#9;9876543210&#9;Acme Corp&#9;SEO&#9;Looking for lead generation"
                    value={sheetPasteText}
                    onChange={(e) => setSheetPasteText(e.target.value)}
                    className="text-xs rounded-xl min-h-[110px] font-mono"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsSheetModalOpen(false)}
                    className="text-xs"
                  >
                    Close
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleImportPastedSheet}
                    className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                  >
                    Import Pasted Rows
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
