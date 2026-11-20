import { useState } from "react";
import { crmStore } from "@/lib/crm/crm-store";
import type { ServiceItem } from "@/lib/crm/types";
import {
  Layers,
  Plus,
  CheckCircle,
  XCircle,
  TrendingUp,
  FileText,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export function ServicesTab() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceDesc, setNewServiceDesc] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const services = crmStore.getServices();

  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleActive = (id: string) => {
    crmStore.toggleService(id);
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;
    crmStore.addService(newServiceName.trim(), newServiceDesc.trim());
    setIsAddModalOpen(false);
    setNewServiceName("");
    setNewServiceDesc("");
  };

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-[#092B55]">Agency Services Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage the agency's 12 core digital marketing offerings, service catalogue, and lead alignment.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          className="h-9 text-xs bg-[#087BEA] hover:bg-[#087BEA]/90 text-white shadow-sm"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Custom Service
        </Button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search service name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-slate-50 border-slate-200 rounded-xl"
          />
        </div>
        <span className="text-xs text-slate-500">
          Showing <strong>{filteredServices.length}</strong> services
        </span>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((service, idx) => {
          return (
            <div
              key={service.id}
              className={`p-5 rounded-2xl border transition-all bg-white flex flex-col justify-between ${
                service.isActive
                  ? "border-slate-200/80 shadow-sm hover:shadow"
                  : "border-slate-200 bg-slate-50/50 opacity-70"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 text-[#087BEA] text-xs font-bold flex items-center justify-center font-mono">
                    {idx + 1}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                      {service.leadCount || 0} Leads
                    </span>
                    <button
                      onClick={() => handleToggleActive(service.id)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors ${
                        service.isActive
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                          : "bg-slate-200 text-slate-600 border-slate-300 hover:bg-slate-300"
                      }`}
                    >
                      {service.isActive ? "Active" : "Disabled"}
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-sm text-[#092B55] mb-1.5">{service.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{service.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Slug: /{service.slug}</span>
                <span className="text-[#087BEA] font-medium">Core Agency Service</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD CUSTOM SERVICE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50/60">
              <h3 className="font-bold text-base text-[#092B55]">Add Agency Service</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddService} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Service Name *</Label>
                <Input
                  required
                  placeholder="e.g. Programmatic Audio & OTT Ads"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  className="h-9 text-xs rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Description</Label>
                <Textarea
                  placeholder="Describe target deliverable, value proposition, and client scope..."
                  value={newServiceDesc}
                  onChange={(e) => setNewServiceDesc(e.target.value)}
                  className="text-xs rounded-xl min-h-[80px]"
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
                  Create Service
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
