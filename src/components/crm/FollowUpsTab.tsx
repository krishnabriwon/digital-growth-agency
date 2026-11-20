import { useState, useMemo } from "react";
import { crmStore } from "@/lib/crm/crm-store";
import type { FollowUp, FollowUpType, FollowUpStatus, Lead } from "@/lib/crm/types";
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Phone,
  Mail,
  Video,
  MessageSquare,
  Presentation,
  Trash2,
  User,
  Building,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const TYPE_ICONS: Record<FollowUpType, React.ElementType> = {
  Call: Phone,
  Email: Mail,
  Meeting: Video,
  WhatsApp: MessageSquare,
  Demo: Presentation,
};

export function FollowUpsTab({ onSelectLead }: { onSelectLead: (lead: Lead) => void }) {
  const [activeTab, setActiveTab] = useState<"today" | "upcoming" | "overdue" | "completed">("today");
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  const followUps = crmStore.getFollowUps();
  const leads = crmStore.getLeads();

  // Form state
  const [scheduleData, setScheduleData] = useState({
    leadId: leads[0]?.id || "",
    title: "",
    type: "Call" as FollowUpType,
    scheduledAt: new Date(Date.now() + 86400000).toISOString().slice(0, 16), // tomorrow local string
    notes: "",
  });

  const now = new Date();
  const todayStr = now.toDateString();

  const categorized = useMemo(() => {
    const today: FollowUp[] = [];
    const upcoming: FollowUp[] = [];
    const overdue: FollowUp[] = [];
    const completed: FollowUp[] = [];

    followUps.forEach((f) => {
      if (f.status === "completed") {
        completed.push(f);
        return;
      }
      const d = new Date(f.scheduledAt);
      if (d.toDateString() === todayStr) {
        today.push(f);
      } else if (d.getTime() < now.getTime()) {
        overdue.push(f);
      } else {
        upcoming.push(f);
      }
    });

    return { today, upcoming, overdue, completed };
  }, [followUps, todayStr]);

  const currentList = categorized[activeTab];

  const handleCreateFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    const targetLead = leads.find((l) => l.id === scheduleData.leadId);
    if (!targetLead || !scheduleData.title.trim()) {
      alert("Please select a lead and enter a title.");
      return;
    }

    crmStore.addFollowUp({
      leadId: targetLead.id,
      leadName: targetLead.fullName,
      leadCompany: targetLead.company,
      leadPhone: targetLead.phone,
      title: scheduleData.title.trim(),
      type: scheduleData.type,
      scheduledAt: new Date(scheduleData.scheduledAt).toISOString(),
      notes: scheduleData.notes.trim() || undefined,
      createdBy: "Sarah Sharma",
    });

    setIsScheduleModalOpen(false);
    setScheduleData({
      leadId: leads[0]?.id || "",
      title: "",
      type: "Call",
      scheduledAt: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
      notes: "",
    });
  };

  const handleComplete = (id: string) => {
    crmStore.completeFollowUp(id);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this follow-up?")) {
      crmStore.deleteFollowUp(id);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-[#092B55]">Follow-up Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track and execute discovery calls, proposal reviews, client check-ins, and closing meetings.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsScheduleModalOpen(true)}
          className="h-9 text-xs bg-[#087BEA] hover:bg-[#087BEA]/90 text-white shadow-sm"
        >
          <Plus className="w-4 h-4 mr-1" />
          Schedule Follow-up
        </Button>
      </div>

      {/* Subtab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("today")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === "today"
              ? "bg-[#087BEA] text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          Today's Tasks
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              activeTab === "today" ? "bg-white/20 text-white" : "bg-blue-100 text-[#087BEA]"
            }`}
          >
            {categorized.today.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("upcoming")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === "upcoming"
              ? "bg-[#087BEA] text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          Upcoming
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              activeTab === "upcoming" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            {categorized.upcoming.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("overdue")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === "overdue"
              ? "bg-red-600 text-white shadow-sm"
              : "bg-white text-red-600 hover:bg-red-50 border border-red-200"
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          Overdue
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              activeTab === "overdue" ? "bg-white/20 text-white" : "bg-red-100 text-red-700"
            }`}
          >
            {categorized.overdue.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("completed")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === "completed"
              ? "bg-emerald-600 text-white shadow-sm"
              : "bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-200"
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Completed
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              activeTab === "completed" ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {categorized.completed.length}
          </span>
        </button>
      </div>

      {/* Cards List */}
      <div className="space-y-3">
        {currentList.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-sm text-slate-400">
            <Calendar className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="font-semibold text-slate-700 text-sm">No follow-ups in this section</p>
            <p className="text-xs text-slate-400 mt-1">Great job! All scheduled activities are up to date.</p>
          </div>
        ) : (
          currentList.map((item) => {
            const Icon = TYPE_ICONS[item.type] || Clock;
            const targetLead = leads.find((l) => l.id === item.leadId);
            const isOverdue =
              item.status !== "completed" && new Date(item.scheduledAt).getTime() < now.getTime();

            return (
              <div
                key={item.id}
                className={`bg-white p-4 sm:p-5 rounded-2xl border shadow-sm transition-shadow hover:shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
                  isOverdue ? "border-red-200 bg-red-50/20" : "border-slate-200/80"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`p-3 rounded-xl border shrink-0 ${
                      item.status === "completed"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                        : isOverdue
                        ? "bg-red-50 border-red-200 text-red-600"
                        : "bg-blue-50 border-blue-200 text-[#087BEA]"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-sm text-[#092B55]">{item.title}</h3>
                      <Badge variant="outline" className="text-[10px]">
                        {item.type}
                      </Badge>
                      {isOverdue && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                          Overdue
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-600 flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-900">{item.leadName}</span>
                      {item.leadCompany && <span>• {item.leadCompany}</span>}
                      {item.leadPhone && <span>• {item.leadPhone}</span>}
                    </div>

                    {item.notes && (
                      <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 max-w-xl">
                        {item.notes}
                      </p>
                    )}

                    <div className="text-[11px] text-slate-400 flex items-center gap-3 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(item.scheduledAt).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                      <span>Assigned to: {item.createdBy}</span>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  {targetLead && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onSelectLead(targetLead)}
                      className="h-8 text-xs text-[#087BEA] hover:bg-blue-50"
                    >
                      View Lead
                    </Button>
                  )}

                  {item.status !== "completed" && (
                    <Button
                      size="sm"
                      onClick={() => handleComplete(item.id)}
                      className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                    >
                      <Check className="w-3.5 h-3.5 mr-1" />
                      Mark Complete
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(item.id)}
                    className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* SCHEDULE FOLLOW-UP MODAL */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50/60">
              <h3 className="font-bold text-base text-[#092B55]">Schedule Follow-up Task</h3>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFollowUp} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Select Lead *</Label>
                <select
                  value={scheduleData.leadId}
                  onChange={(e) => setScheduleData({ ...scheduleData, leadId: e.target.value })}
                  className="w-full h-9 px-3 text-xs bg-white border border-slate-200 rounded-xl text-slate-700"
                >
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.leadCode} – {l.fullName} ({l.company || l.service})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Follow-up Title *</Label>
                <Input
                  required
                  placeholder="e.g. Discovery Call / Strategy Review / Zoom Demo"
                  value={scheduleData.title}
                  onChange={(e) => setScheduleData({ ...scheduleData, title: e.target.value })}
                  className="h-9 text-xs rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Activity Type</Label>
                  <select
                    value={scheduleData.type}
                    onChange={(e) => setScheduleData({ ...scheduleData, type: e.target.value as FollowUpType })}
                    className="w-full h-9 px-3 text-xs bg-white border border-slate-200 rounded-xl text-slate-700"
                  >
                    <option value="Call">Phone Call</option>
                    <option value="Meeting">Video Meeting</option>
                    <option value="Email">Email Follow-up</option>
                    <option value="WhatsApp">WhatsApp Chat</option>
                    <option value="Demo">Client Demo</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Scheduled Date & Time *</Label>
                  <Input
                    required
                    type="datetime-local"
                    value={scheduleData.scheduledAt}
                    onChange={(e) => setScheduleData({ ...scheduleData, scheduledAt: e.target.value })}
                    className="h-9 text-xs rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Preparation Notes / Objective</Label>
                <Textarea
                  placeholder="Review client proposal deck, discuss milestone deliverables..."
                  value={scheduleData.notes}
                  onChange={(e) => setScheduleData({ ...scheduleData, notes: e.target.value })}
                  className="text-xs rounded-xl min-h-[70px]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="text-xs bg-[#087BEA] hover:bg-[#087BEA]/90 text-white font-semibold"
                >
                  Confirm Schedule
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
