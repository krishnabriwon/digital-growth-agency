import { useState, useMemo } from "react";
import { crmStore } from "@/lib/crm/crm-store";
import type { DateRangePreset } from "@/lib/crm/types";
import {
  BarChart3,
  TrendingUp,
  Download,
  Filter,
  Users,
  Award,
  Clock,
  Target,
  DollarSign,
  PieChart as PieChartIcon,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";

export function ReportsTab() {
  const [dateFilter, setDateFilter] = useState<DateRangePreset>("all_time");

  const leads = crmStore.getLeads();
  const clients = crmStore.getClients();
  const followUps = crmStore.getFollowUps();
  const teamMembers = crmStore.getTeamMembers();

  // Filter leads based on selected preset
  const filteredLeads = useMemo(() => {
    if (dateFilter === "all_time") return leads;
    const now = new Date();
    return leads.filter((lead) => {
      const leadDate = new Date(lead.createdAt);
      if (dateFilter === "today") return leadDate.toDateString() === now.toDateString();
      if (dateFilter === "last_7_days") return now.getTime() - leadDate.getTime() <= 7 * 86400000;
      if (dateFilter === "last_30_days") return now.getTime() - leadDate.getTime() <= 30 * 86400000;
      if (dateFilter === "this_month") {
        return (
          leadDate.getMonth() === now.getMonth() && leadDate.getFullYear() === now.getFullYear()
        );
      }
      return true;
    });
  }, [leads, dateFilter]);

  // Aggregate metrics
  const totalLeads = filteredLeads.length;
  const wonLeads = filteredLeads.filter((l) => l.status === "Won").length;
  const lostLeads = filteredLeads.filter((l) => l.status === "Lost").length;
  const totalPipelineBudget = filteredLeads.reduce((acc, l) => acc + (l.estimatedBudget || 0), 0);
  const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : "0.0";
  const completedFollowUps = followUps.filter((f) => f.status === "completed").length;
  const followUpCompletionRate =
    followUps.length > 0 ? ((completedFollowUps / followUps.length) * 100).toFixed(1) : "0.0";

  // Chart 1: Source Performance & Win Rate
  const sourcePerformanceData = useMemo(() => {
    const map: Record<string, { source: string; total: number; won: number }> = {};
    filteredLeads.forEach((l) => {
      if (!map[l.source]) map[l.source] = { source: l.source, total: 0, won: 0 };
      map[l.source].total += 1;
      if (l.status === "Won") map[l.source].won += 1;
    });
    return Object.values(map);
  }, [filteredLeads]);

  // Chart 2: Won vs Lost Analysis
  const wonLostData = [
    { name: "Won Deals", value: wonLeads, color: "#10B981" },
    { name: "Lost Deals", value: lostLeads, color: "#EF4444" },
    { name: "In Progress", value: Math.max(0, totalLeads - wonLeads - lostLeads), color: "#087BEA" },
  ];

  // Chart 3: Team Performance Leaderboard
  const teamPerformanceData = useMemo(() => {
    return teamMembers.map((tm) => {
      const assigned = filteredLeads.filter((l) => l.assignedTo === tm.name);
      const won = assigned.filter((l) => l.status === "Won").length;
      const rate = assigned.length > 0 ? Math.round((won / assigned.length) * 100) : 0;
      return {
        name: tm.name.split(" ")[0],
        fullName: tm.name,
        assigned: assigned.length,
        won,
        rate,
      };
    });
  }, [teamMembers, filteredLeads]);

  const handleExportReportCsv = () => {
    if (typeof window === "undefined") return;
    const headers = ["Metric", "Value"];
    const rows = [
      ["Date Filter", dateFilter],
      ["Total Enquiries/Leads", totalLeads],
      ["Won Leads", wonLeads],
      ["Lost Leads", lostLeads],
      ["Conversion Rate (%)", `${conversionRate}%`],
      ["Total Pipeline Potential (INR)", totalPipelineBudget],
      ["Active Agency Retainers", clients.length],
      ["Follow-up Completion Rate (%)", `${followUpCompletionRate}%`],
    ];
    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encoded = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encoded;
    link.download = `DMA_CRM_Executive_Report_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-[#092B55]">Reports & Sales Analytics</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit conversion velocity, channel ROI, service demand, and team performance metrics.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Filter preset selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            {(
              [
                ["today", "Today"],
                ["last_7_days", "7D"],
                ["last_30_days", "30D"],
                ["this_month", "Month"],
                ["all_time", "All"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setDateFilter(key)}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  dateFilter === key
                    ? "bg-white text-[#087BEA] shadow-sm font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={handleExportReportCsv}
            className="h-9 text-xs border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export Report CSV
          </Button>
        </div>
      </div>

      {/* 4 Summary Scorecards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Total Enquiries</span>
          <div className="text-2xl font-bold text-[#092B55] mt-1">{totalLeads}</div>
          <span className="text-[11px] text-slate-400">Captured in period</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Conversion Rate</span>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{conversionRate}%</div>
          <span className="text-[11px] text-slate-400">Won vs Total Inflow</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Pipeline Potential</span>
          <div className="text-2xl font-bold text-[#087BEA] mt-1">
            ₹{totalPipelineBudget.toLocaleString("en-IN")}
          </div>
          <span className="text-[11px] text-slate-400">Estimated value</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Follow-up Efficiency</span>
          <div className="text-2xl font-bold text-amber-600 mt-1">{followUpCompletionRate}%</div>
          <span className="text-[11px] text-slate-400">{completedFollowUps} tasks completed</span>
        </div>
      </div>

      {/* Deep-dive Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Source Channel Performance */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-[#092B55]">Lead Inflow & Won Deals by Channel</h3>
              <p className="text-xs text-slate-500">Comparing lead volume and conversion outcome per source</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourcePerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="source" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#64748B" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748B" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "0.75rem",
                    border: "1px solid #E2E8F0",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                <Bar dataKey="total" name="Total Inbound" fill="#087BEA" radius={[4, 4, 0, 0]} />
                <Bar dataKey="won" name="Won Deals" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Won vs Lost Deals Pie Chart */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-[#092B55]">Deal Outcome Ratio</h3>
            <p className="text-xs text-slate-500">Won, Lost, and In-Progress distribution</p>
          </div>
          <div className="h-52 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={wonLostData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                  {wonLostData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
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
          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
            {wonLostData.map((d) => (
              <div key={d.name} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  {d.name}
                </span>
                <span className="font-bold text-slate-900">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Member Workload & Conversion Leaderboard */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-sm text-[#092B55]">Team Member Performance Leaderboard</h3>
            <p className="text-xs text-slate-500">Leads assigned, deals closed, and win-rate percentage</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 pl-4">Specialist</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Leads Handled</th>
                <th className="py-3 px-3">Deals Won</th>
                <th className="py-3 px-3">Win Rate</th>
                <th className="py-3 pr-4 text-right">Performance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {teamPerformanceData.map((member) => (
                <tr key={member.fullName} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 pl-4 font-semibold text-slate-900">{member.fullName}</td>
                  <td className="py-3.5 px-3 text-slate-500">
                    {teamMembers.find((t) => t.name === member.fullName)?.title}
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-slate-900">{member.assigned}</td>
                  <td className="py-3.5 px-3 font-bold text-emerald-600">{member.won}</td>
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-[#087BEA] h-full rounded-full"
                          style={{ width: `${Math.min(100, member.rate)}%` }}
                        />
                      </div>
                      <span className="font-bold text-slate-800">{member.rate}%</span>
                    </div>
                  </td>
                  <td className="py-3.5 pr-4 text-right">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#087BEA] border border-blue-200">
                      High Impact
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
