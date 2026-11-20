import { useState } from "react";
import { crmStore } from "@/lib/crm/crm-store";
import type { TeamMember, UserRole } from "@/lib/crm/types";
import {
  Users,
  Shield,
  UserCheck,
  Mail,
  Award,
  CheckCircle2,
  TrendingUp,
  Plus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export function TeamTab() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    title: "",
    role: "team_member" as UserRole,
  });

  const teamMembers = crmStore.getTeamMembers();

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name.trim() || !newMember.email.trim()) return;

    const initials = newMember.name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .toUpperCase();

    crmStore.addTeamMember({
      name: newMember.name.trim(),
      email: newMember.email.trim(),
      title: newMember.title.trim() || "Growth Specialist",
      role: newMember.role,
      avatar: initials,
    });

    setIsAddModalOpen(false);
    setNewMember({ name: "", email: "", title: "", role: "team_member" });
  };

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-[#092B55]">Agency Team & Role Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Internal team members, access roles (Admin / Team Member), lead assignments, and closing track records.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          className="h-9 text-xs bg-[#087BEA] hover:bg-[#087BEA]/90 text-white shadow-sm"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Team Member
        </Button>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {teamMembers.map((member) => {
          const isAdmin = member.role === "admin";
          return (
            <div
              key={member.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#087BEA] to-[#092B55] text-white font-bold flex items-center justify-center text-sm shadow-md shadow-[#087BEA]/20">
                    {member.avatar || member.name.substring(0, 2).toUpperCase()}
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-bold ${
                      isAdmin
                        ? "bg-blue-50 text-[#087BEA] border-blue-200"
                        : "bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    {isAdmin ? "Admin" : "Team Member"}
                  </Badge>
                </div>

                <h3 className="font-bold text-sm text-[#092B55]">{member.name}</h3>
                <p className="text-xs text-slate-500 font-medium">{member.title}</p>

                <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{member.email}</span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-slate-50">
                  <span className="text-[10px] text-slate-400 font-medium uppercase">Active Leads</span>
                  <p className="font-bold text-[#087BEA] text-sm mt-0.5">
                    {member.activeLeadsCount || 0}
                  </p>
                </div>
                <div className="p-2 rounded-xl bg-emerald-50">
                  <span className="text-[10px] text-emerald-600 font-medium uppercase">Won Deals</span>
                  <p className="font-bold text-emerald-700 text-sm mt-0.5">
                    {member.wonLeadsCount || 0}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Permissions Breakdown Table */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <h3 className="font-bold text-sm text-[#092B55] mb-2">Role Permissions Matrix</h3>
        <p className="text-xs text-slate-500 mb-4">
          Role-based access permissions enforcing data isolation and administrative actions.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 pl-4">Permission Capability</th>
                <th className="py-3 px-3 text-center">Team Member Role</th>
                <th className="py-3 pr-4 text-center">Admin Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                ["View Dashboard, Leads, and Kanban", true, true],
                ["Create and Edit Assigned Leads", true, true],
                ["Schedule and Complete Follow-ups", true, true],
                ["Convert Won Leads to Clients", false, true],
                ["Manage Agency Services Catalogue", false, true],
                ["Manage Team Members and Roles", false, true],
                ["Bulk Delete Records", false, true],
                ["Access Supabase Database Settings", false, true],
              ].map(([perm, tm, adm]) => (
                <tr key={perm as string}>
                  <td className="py-3 pl-4 font-medium text-slate-800">{perm as string}</td>
                  <td className="py-3 px-3 text-center">
                    {tm ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <span className="text-slate-300 font-bold">—</span>
                    )}
                  </td>
                  <td className="py-3 pr-4 text-center">
                    {adm ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <span className="text-slate-300 font-bold">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD MEMBER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50/60">
              <h3 className="font-bold text-base text-[#092B55]">Add Team Member</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMember} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Full Name *</Label>
                <Input
                  required
                  placeholder="e.g. Arjun Kapoor"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="h-9 text-xs rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Email Address *</Label>
                <Input
                  required
                  type="email"
                  placeholder="arjun@dma.agency"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  className="h-9 text-xs rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Job Title</Label>
                <Input
                  placeholder="e.g. Senior SEO Strategist"
                  value={newMember.title}
                  onChange={(e) => setNewMember({ ...newMember, title: e.target.value })}
                  className="h-9 text-xs rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Role</Label>
                <select
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value as UserRole })}
                  className="w-full h-9 px-3 text-xs bg-white border border-slate-200 rounded-xl text-slate-700"
                >
                  <option value="team_member">Team Member</option>
                  <option value="admin">Admin</option>
                </select>
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
                  Create Member
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
