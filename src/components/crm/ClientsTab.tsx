import { useState, useMemo } from "react";
import { crmStore } from "@/lib/crm/crm-store";
import { AGENCY_SERVICES, TEAM_MEMBERS } from "@/lib/crm/mock-data";
import type { Client, ClientStatus, Lead } from "@/lib/crm/types";
import {
  Briefcase,
  Search,
  Filter,
  Plus,
  Download,
  Building,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  DollarSign,
  User,
  Clock,
  MoreVertical,
  Trash2,
  Edit,
  Eye,
  X,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const CLIENT_STATUSES: ClientStatus[] = ["Active", "Inactive", "Completed", "On Hold"];

export function ClientsTab({ onSelectLead }: { onSelectLead: (lead: Lead) => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewingClient, setViewingClient] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  // New Client Form State
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    contractValue: 80000,
    status: "Active" as ClientStatus,
    assignedManager: TEAM_MEMBERS[0].name,
    projectStartDate: new Date().toISOString().split("T")[0],
    servicesPurchased: [AGENCY_SERVICES[0].name],
    notes: "",
  });

  const clients = crmStore.getClients();
  const leads = crmStore.getLeads();

  // Filtered Clients
  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          client.name.toLowerCase().includes(q) ||
          client.email.toLowerCase().includes(q) ||
          client.clientCode.toLowerCase().includes(q) ||
          (client.company && client.company.toLowerCase().includes(q));
        if (!match) return false;
      }
      if (statusFilter !== "all" && client.status !== statusFilter) return false;
      return true;
    });
  }, [clients, searchQuery, statusFilter]);

  // Client KPI Metrics
  const totalClients = clients.length;
  const activeClients = clients.filter((c) => c.status === "Active").length;
  const totalContractValue = clients.reduce((acc, c) => acc + (c.contractValue || 0), 0);
  const avgContractValue = totalClients > 0 ? Math.round(totalContractValue / totalClients) : 0;

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      alert("Please fill required fields (Name, Email, Phone).");
      return;
    }

    crmStore.addClientDirectly({
      name: formData.name.trim(),
      company: formData.company.trim() || undefined,
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      contractValue: Number(formData.contractValue) || 50000,
      status: formData.status,
      assignedManager: formData.assignedManager,
      projectStartDate: formData.projectStartDate,
      servicesPurchased: formData.servicesPurchased,
      notes: formData.notes.trim() || undefined,
    });

    setIsAddModalOpen(false);
    setFormData({
      name: "",
      company: "",
      email: "",
      phone: "",
      contractValue: 80000,
      status: "Active",
      assignedManager: TEAM_MEMBERS[0].name,
      projectStartDate: new Date().toISOString().split("T")[0],
      servicesPurchased: [AGENCY_SERVICES[0].name],
      notes: "",
    });
  };

  const handleUpdateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;
    crmStore.updateClient(editingClient.id, {
      name: editingClient.name,
      company: editingClient.company,
      email: editingClient.email,
      phone: editingClient.phone,
      contractValue: Number(editingClient.contractValue),
      status: editingClient.status,
      assignedManager: editingClient.assignedManager,
      projectStartDate: editingClient.projectStartDate,
      servicesPurchased: editingClient.servicesPurchased,
      notes: editingClient.notes,
    });
    setEditingClient(null);
  };

  const handleDeleteClient = () => {
    if (!clientToDelete) return;
    crmStore.deleteClient(clientToDelete.id);
    setClientToDelete(null);
    if (viewingClient?.id === clientToDelete.id) {
      setViewingClient(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-[#092B55]">Clients & Account Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Active agency retainers, contract values, project delivery status, and client relationships.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={() => crmStore.exportClientsToCsv()}
            className="h-9 text-xs border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export Clients CSV
          </Button>

          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="h-9 text-xs bg-[#087BEA] hover:bg-[#087BEA]/90 text-white shadow-sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Client
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Total Clients</span>
          <div className="text-2xl font-bold text-[#092B55] mt-1">{totalClients}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Active Retainers</span>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{activeClients}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Total Contract Value</span>
          <div className="text-2xl font-bold text-[#087BEA] mt-1">
            ₹{totalContractValue.toLocaleString("en-IN")}
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Avg. Contract Value</span>
          <div className="text-2xl font-bold text-slate-700 mt-1">
            ₹{avgContractValue.toLocaleString("en-IN")}
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search client name, company, code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-slate-50 border-slate-200 rounded-xl"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
          >
            <option value="all">All Statuses</option>
            {CLIENT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 pl-5 px-3">Client Code</th>
                <th className="py-3.5 px-3">Client Name & Company</th>
                <th className="py-3.5 px-3">Contact</th>
                <th className="py-3.5 px-3">Retainer Services</th>
                <th className="py-3.5 px-3">Contract Value</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3">Account Manager</th>
                <th className="py-3.5 px-3">Start Date</th>
                <th className="py-3.5 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <Briefcase className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-600">No client accounts found</p>
                    <p className="text-xs text-slate-400 mt-1">Convert a won lead or add a client manually.</p>
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => {
                  return (
                    <tr key={client.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 pl-5 px-3 font-mono font-bold text-[#087BEA]">
                        <button onClick={() => setViewingClient(client)} className="hover:underline">
                          {client.clientCode}
                        </button>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-slate-900">{client.name}</div>
                        {client.company && (
                          <div className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Building className="w-3 h-3 text-slate-400" /> {client.company}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-[11px] text-slate-600">
                        <div>{client.phone}</div>
                        <div className="text-slate-400">{client.email}</div>
                      </td>
                      <td className="py-3.5 px-3 max-w-[180px]">
                        <div className="flex flex-wrap gap-1">
                          {client.servicesPurchased.slice(0, 2).map((srv) => (
                            <span
                              key={srv}
                              className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-blue-50 text-[#087BEA] border border-blue-100 truncate"
                            >
                              {srv}
                            </span>
                          ))}
                          {client.servicesPurchased.length > 2 && (
                            <span className="text-[10px] text-slate-400 font-medium">
                              +{client.servicesPurchased.length - 2} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 font-bold text-slate-900">
                        ₹{client.contractValue.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3.5 px-3">
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-bold ${
                            client.status === "Active"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : client.status === "On Hold"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          {client.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-3 text-[11px] text-slate-700 font-medium">
                        {client.assignedManager}
                      </td>
                      <td className="py-3.5 px-3 text-[11px] text-slate-500">
                        {client.projectStartDate}
                      </td>
                      <td className="py-3.5 pr-5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setViewingClient(client)}
                            className="h-7 w-7 p-0 text-slate-500 hover:text-[#087BEA] hover:bg-blue-50"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingClient(client)}
                            className="h-7 w-7 p-0 text-slate-500 hover:text-[#087BEA] hover:bg-blue-50"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setClientToDelete(client)}
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
      </div>

      {/* VIEW CLIENT DETAILS MODAL */}
      {viewingClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center font-mono text-sm">
                  CLI
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#092B55]">{viewingClient.name}</h3>
                  <p className="text-xs text-slate-500">
                    {viewingClient.company || "Direct Client"} • {viewingClient.clientCode}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingClient(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs overflow-y-auto">
              <div className="grid grid-cols-2 gap-3.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Email</span>
                  <p className="font-semibold text-slate-900 mt-0.5">{viewingClient.email}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Phone</span>
                  <p className="font-semibold text-slate-900 mt-0.5">{viewingClient.phone}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Contract Value</span>
                  <p className="font-bold text-emerald-700 mt-0.5">
                    ₹{viewingClient.contractValue.toLocaleString("en-IN")}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Account Manager</span>
                  <p className="font-semibold text-slate-900 mt-0.5">{viewingClient.assignedManager}</p>
                </div>
              </div>

              <div>
                <Label className="text-xs font-bold text-slate-700">Services Retained</Label>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {viewingClient.servicesPurchased.map((srv) => (
                    <span
                      key={srv}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-[#087BEA] border border-blue-200"
                    >
                      {srv}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-xs font-bold text-slate-700">Client Onboarding & Project Notes</Label>
                <div className="mt-1 p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {viewingClient.notes || "No onboarding notes provided."}
                </div>
              </div>

              {/* Linked original lead if converted */}
              {viewingClient.leadId && (
                <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#087BEA]" />
                    <span className="text-xs text-blue-950 font-medium">
                      Converted from original inbound lead
                    </span>
                  </div>
                  {(() => {
                    const l = leads.find((item) => item.id === viewingClient.leadId);
                    if (!l) return null;
                    return (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setViewingClient(null);
                          onSelectLead(l);
                        }}
                        className="h-7 text-xs bg-white text-[#087BEA] border-blue-200"
                      >
                        View Original Lead
                      </Button>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ADD CLIENT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50/60">
              <h3 className="font-bold text-base text-[#092B55]">Add Agency Client</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="p-6 space-y-4 text-xs overflow-y-auto">
              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Client Name *</Label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-9 text-xs rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Company Name</Label>
                  <Input
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="h-9 text-xs rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Email *</Label>
                  <Input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-9 text-xs rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Phone *</Label>
                  <Input
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="h-9 text-xs rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3.5">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Contract Value (₹)</Label>
                  <Input
                    type="number"
                    value={formData.contractValue}
                    onChange={(e) => setFormData({ ...formData, contractValue: Number(e.target.value) })}
                    className="h-9 text-xs rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Status</Label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as ClientStatus })}
                    className="w-full h-9 px-3 text-xs bg-white border border-slate-200 rounded-xl text-slate-700"
                  >
                    {CLIENT_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Account Manager</Label>
                  <select
                    value={formData.assignedManager}
                    onChange={(e) => setFormData({ ...formData, assignedManager: e.target.value })}
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
                <Label className="text-xs font-semibold text-slate-700">Onboarding Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
                  className="text-xs bg-[#087BEA] hover:bg-[#087BEA]/90 text-white font-semibold"
                >
                  Save Client
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {clientToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-sm p-6 text-center animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Delete Client Account?</h3>
            <p className="text-xs text-slate-500 mt-1.5">
              Are you sure you want to remove <strong className="text-slate-800">{clientToDelete.name}</strong> ({clientToDelete.clientCode})?
            </p>
            <div className="flex items-center justify-center gap-2 mt-5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setClientToDelete(null)}
                className="text-xs w-24"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteClient}
                className="text-xs w-24"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
