import { useState, useMemo } from "react";
import { crmStore } from "@/lib/crm/crm-store";
import type { Lead, DateRangePreset } from "@/lib/crm/types";
import {
  Users,
  UserPlus,
  PhoneCall,
  CheckCircle2,
  Award,
  XCircle,
  Briefcase,
  TrendingUp,
  Clock,
  Calendar,
  AlertTriangle,
  ArrowUpRight,
  Filter,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const SOURCE_COLORS: Record<string, string> = {
  "Website Enquiry": "#087BEA",
  "Google Ads": "#39A9FF",
  "Meta Ads": "#8B5CF6",
  "Organic Search": "#10B981",
  LinkedIn: "#0284C7",
  Referral: "#F59E0B",
  Direct: "#64748B",
  "Cold Outreach": "#EC4899",
};

export function DashboardTab({
  onNavigateTab,
  onSelectLead,
}: {
  onNavigateTab: (tab: string) => void;
  onSelectLead: (lead: Lead) => void;
}) {
  const [dateFilter, setDateFilter] = useState<DateRangePreset>("all_time");

  const leads = crmStore.getLeads();
  const clients = crmStore.getClients();
  const followUps = crmStore.getFollowUps();

  // Filter leads based on selected date filter
  const filteredLeads = useMemo(() => {
    if (dateFilter === "all_time") return leads;
    const now = new Date();
    return leads.filter((lead) => {
      const leadDate = new Date(lead.createdAt);
      if (dateFilter === "today") {
        return leadDate.toDateString() === now.toDateString();
      }
      if (dateFilter === "last_7_days") {
        return now.getTime() - leadDate.getTime() <= 7 * 86400000;
      }
      if (dateFilter === "last_30_days") {
        return now.getTime() - leadDate.getTime() <= 30 * 86400000;
      }
      if (dateFilter === "this_month") {
        return (
          leadDate.getMonth() === now.getMonth() &&
          leadDate.getFullYear() === now.getFullYear()
        );
      }
      return true;
    });
  }, [leads, dateFilter]);

  // KPI Calculations
  const totalLeadsCount = filteredLeads.length;
  const newLeadsCount = filteredLeads.filter((l) => l.status === "New").length;
  const contactedLeadsCount = filteredLeads.filter((l) => l.status === "Contacted").length;
  const qualifiedLeadsCount = filteredLeads.filter((l) => l.status === "Qualified").length;
  const wonLeadsCount = filteredLeads.filter((l) => l.status === "Won").length;
  const lostLeadsCount = filteredLeads.filter((l) => l.status === "Lost").length;
  const totalClientsCount = clients.length;
  const conversionRate = totalLeadsCount > 0 ? ((wonLeadsCount / totalLeadsCount) * 100).toFixed(1) : "0.0";

  // Pending & Overdue Follow-ups
  const nowTime = new Date().getTime();
  const todayFollowUps = followUps.filter((f) => {
    if (f.status === "completed") return false;
    const d = new Date(f.scheduledAt);
    return d.toDateString() === new Date().toDateString();
  });
  const overdueFollowUps = followUps.filter((f) => {
    if (f.status === "completed") return false;
    return new Date(f.scheduledAt).getTime() < nowTime && new Date(f.scheduledAt).toDateString() !== new Date().toDateString();
  });

  // Chart 1: Monthly Lead Generation Trend
  const monthlyData = useMemo(() => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const map: Record<string, { month: string; leads: number; won: number }> = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${monthNames[d.getMonth()]}`;
      map[key] = { month: key, leads: 0, won: 0 };
    }
    leads.forEach((l) => {
      const d = new Date(l.createdAt);
      const key = monthNames[d.getMonth()];
      if (map[key]) {
        map[key].leads += 1;
        if (l.status === "Won") map[key].won += 1;
      }
    });
    return Object.values(map);
  }, [leads]);

  // Chart 2: Lead Status Pipeline Breakdown
  const statusFunnelData = useMemo(() => {
    const statuses: Array<{ status: string; label: string; count: number; color: string }> = [
      { status: "New", label: "New", count: 0, color: "#39A9FF" },
      { status: "Contacted", label: "Contacted", count: 0, color: "#087BEA" },
      { status: "Qualified", label: "Qualified", count: 0, color: "#6366F1" },
      { status: "Proposal Sent", label: "Proposal", count: 0, color: "#8B5CF6" },
      { status: "Negotiation", label: "Negotiation", count: 0, color: "#EC4899" },
      { status: "Won", label: "Won", count: 0, color: "#10B981" },
      { status: "Lost", label: "Lost", count: 0, color: "#EF4444" },
    ];
    filteredLeads.forEach((l) => {
      const item = statuses.find((s) => s.status === l.status);
      if (item) item.count += 1;
    });
    return statuses;
  }, [filteredLeads]);

  // Chart 3: Lead Sources Breakdown
  const sourcesData = useMemo(() => {
    const map: Record<string, number> = {};
    filteredLeads.forEach((l) => {
      map[l.source] = (map[l.source] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filteredLeads]);

  // Chart 4: Service-wise Distribution
  const serviceDistributionData = useMemo(() => {
    const map: Record<string, number> = {};
    filteredLeads.forEach((l) => {
      // Shorten service name for graph if needed
      const shortName = l.service.length > 22 ? l.service.substring(0, 20) + "..." : l.service;
      map[shortName] = (map[shortName] || 0) + 1;
    });
    return Object.entries(map)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [filteredLeads]);

  const kpis = [
    {
      title: "Total Leads",
      value: totalLeadsCount,
      icon: Users,
      color: "text-[#087BEA]",
      bg: "bg-blue-50 border-blue-200/60",
    },
    {
      title: "New Leads",
      value: newLeadsCount,
      icon: UserPlus,
      color: "text-sky-500",
      bg: "bg-sky-50 border-sky-200/60",
    },
    {
      title: "Contacted Leads",
      value: contactedLeadsCount,
      icon: PhoneCall,
      color: "text-indigo-600",
      bg: "bg-indigo-50 border-indigo-200/60",
    },
    {
      title: "Qualified Leads",
      value: qualifiedLeadsCount,
      icon: CheckCircle2,
      color: "text-violet-600",
      bg: "bg-violet-50 border-violet-200/60",
    },
    {
      title: "Converted (Won)",
      value: wonLeadsCount,
      icon: Award,
      color: "text-emerald-600",
      bg: "bg-emerald-50 border-emerald-200/60",
    },
    {
      title: "Lost Leads",
      value: lostLeadsCount,
      icon: XCircle,
      color: "text-rose-600",
      bg: "bg-rose-50 border-rose-200/60",
    },
    {
      title: "Active Clients",
      value: totalClientsCount,
      icon: Briefcase,
      color: "text-[#092B55]",
      bg: "bg-slate-100 border-slate-200/60",
    },
    {
      title: "Conversion Rate",
      value: `${conversionRate}%`,
      icon: TrendingUp,
      color: "text-amber-600",
      bg: "bg-amber-50 border-amber-200/60",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Date Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-[#092B55]">Agency Executive Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time pipeline metrics, conversion performance & sales analytics.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            {(
              [
                ["today", "Today"],
                ["last_7_days", "7 Days"],
                ["last_30_days", "30 Days"],
                ["this_month", "This Month"],
                ["all_time", "All Time"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setDateFilter(key)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  dateFilter === key
                    ? "bg-white text-[#087BEA] shadow-sm font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Urgent Alerts Banner (Follow-ups) */}
      {(todayFollowUps.length > 0 || overdueFollowUps.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {overdueFollowUps.length > 0 && (
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-red-900">
                    {overdueFollowUps.length} Overdue Follow-up{overdueFollowUps.length > 1 ? "s" : ""}
                  </p>
                  <p className="text-[11px] text-red-700">Immediate attention needed to prevent lead loss.</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onNavigateTab("followups")}
                className="h-8 text-xs bg-white text-red-700 border-red-300 hover:bg-red-50"
              >
                View Overdue
              </Button>
            </div>
          )}

          {todayFollowUps.length > 0 && (
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900">
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-[#087BEA] shrink-0" />
                <div>
                  <p className="text-xs font-bold text-blue-900">
                    {todayFollowUps.length} Follow-up{todayFollowUps.length > 1 ? "s" : ""} Scheduled for Today
                  </p>
                  <p className="text-[11px] text-blue-700">Stay on track with today's scheduled agency calls & meetings.</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onNavigateTab("followups")}
                className="h-8 text-xs bg-white text-[#087BEA] border-blue-300 hover:bg-blue-50"
              >
                View Today's
              </Button>
            </div>
          )}
        </div>
      )}

      {/* 8 KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3.5">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.title}
              className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-500">{kpi.title}</span>
                <div className={`p-2 rounded-xl border ${kpi.bg}`}>
                  <Icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
              </div>
              <div className="text-2xl font-bold text-[#092B55] tracking-tight">{kpi.value}</div>
            </div>
          );
        })}
      </div>

      {/* Analytics Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Monthly Trend Area Chart */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-[#092B55]">Lead Inflow & Conversion Trend</h2>
              <p className="text-xs text-slate-500">Monthly inbound volume vs deals won</p>
            </div>
            <Badge variant="outline" className="text-xs text-[#087BEA] border-blue-200 bg-blue-50">
              Last 6 Months
            </Badge>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#087BEA" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#087BEA" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorWon" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748B" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748B" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "0.75rem",
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                    fontSize: "12px",
                  }}
                />
                <Area type="monotone" dataKey="leads" name="Total Inbound" stroke="#087BEA" strokeWidth={2.5} fillOpacity={1} fill="url(#colorLeads)" />
                <Area type="monotone" dataKey="won" name="Won Clients" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorWon)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Sources Donut Chart */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#092B55]">Lead Acquisition Channels</h2>
            <p className="text-xs text-slate-500">Breakdown by marketing source</p>
          </div>
          <div className="h-56 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourcesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {sourcesData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={SOURCE_COLORS[entry.name] || `#${Math.floor(Math.random() * 16777215).toString(16)}`}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "0.75rem",
                    border: "1px solid #E2E8F0",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-100 text-[11px]">
            {sourcesData.map((src) => (
              <div key={src.name} className="flex items-center gap-1.5 truncate">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: SOURCE_COLORS[src.name] || "#64748B" }}
                />
                <span className="truncate text-slate-600">{src.name}</span>
                <span className="font-semibold text-slate-900 ml-auto">{src.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Pipeline Stage Funnel Bar Chart */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-[#092B55]">Sales Pipeline Funnel</h2>
              <p className="text-xs text-slate-500">Distribution of leads across sales stages</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigateTab("pipeline")}
              className="text-xs text-[#087BEA] hover:bg-blue-50"
            >
              Open Kanban <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusFunnelData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#64748B" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748B" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "0.75rem",
                    border: "1px solid #E2E8F0",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" name="Leads" radius={[6, 6, 0, 0]}>
                  {statusFunnelData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Demanded Agency Services */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-[#092B55]">Top Requested Agency Services</h2>
              <p className="text-xs text-slate-500">Enquiry volume per service category</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigateTab("services")}
              className="text-xs text-[#087BEA] hover:bg-blue-50"
            >
              Manage Services <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={serviceDistributionData}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 30, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748B" }} />
                <YAxis
                  dataKey="name"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10, fill: "#092B55", fontWeight: 500 }}
                  width={110}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "0.75rem",
                    border: "1px solid #E2E8F0",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" name="Enquiries" fill="#087BEA" radius={[0, 6, 6, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent High-Priority Leads Table Widget */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-[#092B55]">Recent Inbound Leads</h2>
            <p className="text-xs text-slate-500">Latest website enquiries and potential clients</p>
          </div>
          <Button
            size="sm"
            onClick={() => onNavigateTab("leads")}
            className="h-8 text-xs bg-[#087BEA] text-white hover:bg-[#087BEA]/90"
          >
            View All Leads ({leads.length})
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="pb-3 pl-1">Lead ID</th>
                <th className="pb-3">Contact</th>
                <th className="pb-3">Requested Service</th>
                <th className="pb-3">Source</th>
                <th className="pb-3">Budget</th>
                <th className="pb-3">Priority</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right pr-1">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400">
                    <p className="font-semibold text-slate-600 text-xs">No active enquiries yet</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      New enquiries submitted through your website contact form or added manually will appear here in real-time.
                    </p>
                  </td>
                </tr>
              ) : (
                leads.slice(0, 5).map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 pl-1 font-mono font-semibold text-[#087BEA]">{lead.leadCode}</td>
                    <td className="py-3">
                      <div className="font-semibold text-slate-900">{lead.fullName}</div>
                      <div className="text-[11px] text-slate-500">{lead.company || lead.email}</div>
                    </td>
                    <td className="py-3 max-w-[160px] truncate font-medium text-slate-700">{lead.service}</td>
                    <td className="py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700">
                        {lead.source}
                      </span>
                    </td>
                    <td className="py-3 font-semibold text-slate-900">
                      ₹{lead.estimatedBudget.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3">
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
                    <td className="py-3">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-semibold ${
                          lead.status === "Won"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : lead.status === "Lost"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-blue-50 text-[#087BEA] border-blue-200"
                        }`}
                      >
                        {lead.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-right pr-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onSelectLead(lead)}
                        className="h-7 text-xs text-[#087BEA] hover:bg-blue-50"
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
