import { useState, useEffect } from "react";
import { useCrmAuth } from "@/lib/crm/auth-context";
import { crmStore } from "@/lib/crm/crm-store";
import type { Lead } from "@/lib/crm/types";
import {
  LayoutDashboard,
  Users,
  GitPullRequest,
  CalendarClock,
  Briefcase,
  Layers,
  BarChart3,
  UserCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
  Menu,
  X,
  ExternalLink,
  Building2,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Search,
  Sparkles,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { DashboardTab } from "./DashboardTab";
import { LeadsTab } from "./LeadsTab";
import { FollowUpsTab } from "./FollowUpsTab";
import { ClientsTab } from "./ClientsTab";
import { CmsTab } from "./CmsTab";
import { ServicesTab } from "./ServicesTab";
import { ReportsTab } from "./ReportsTab";
import { TeamTab } from "./TeamTab";
import { SettingsTab } from "./SettingsTab";

export function CrmLayout() {
  const { user, signOut, switchRole } = useCrmAuth();
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [selectedLeadForDetails, setSelectedLeadForDetails] = useState<Lead | null>(null);
  const [, setRerenderTrigger] = useState(0);

  // Subscribe to store updates and start auto-sync
  useEffect(() => {
    const unsub = crmStore.subscribe(() => {
      setRerenderTrigger((n) => n + 1);
    });
    // Initial sync with both server store & Google Sheet
    crmStore.syncWithSupabase();
    crmStore.autoSyncGoogleSheets();

    // Automated background polling every 25 seconds
    const timer = setInterval(() => {
      crmStore.autoSyncGoogleSheets();
    }, 25000);

    return () => {
      unsub();
      clearInterval(timer);
    };
  }, []);

  const leads = crmStore.getLeads();
  const followUps = crmStore.getFollowUps();
  const clients = crmStore.getClients();
  const activities = crmStore.getActivities();

  const activeLeadsCount = leads.filter((l) => l.status !== "Won" && l.status !== "Lost").length;
  const todayFollowUpsCount = followUps.filter((f) => {
    if (f.status === "completed") return false;
    return new Date(f.scheduledAt).toDateString() === new Date().toDateString();
  }).length;

  const handleSelectLead = (lead: Lead) => {
    setSelectedLeadForDetails(lead);
    setActiveTab("leads");
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "leads", label: "Leads", icon: Users, badge: activeLeadsCount },
    { id: "pipeline", label: "Sales Pipeline", icon: GitPullRequest },
    { id: "followups", label: "Follow-ups", icon: CalendarClock, badge: todayFollowUpsCount || undefined },
    { id: "clients", label: "Clients", icon: Briefcase, badge: clients.length },
    { id: "cms", label: "CMS & Content", icon: FileText, badge: "Live" },
    { id: "services", label: "Services", icon: Layers },
    { id: "reports", label: "Reports & Analytics", icon: BarChart3 },
    { id: "team", label: "Team Members", icon: UserCheck },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-[#263445] flex font-sans antialiased selection:bg-[#087BEA]/10 selection:text-[#087BEA]">
      {/* SIDEBAR (Desktop) */}
      <aside
        className={`hidden md:flex flex-col bg-[#092B55] text-white border-r border-[#092B55]/50 transition-all duration-300 relative z-30 shrink-0 ${
          isSidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-[#087BEA] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#087BEA]/30">
              <Building2 className="w-5 h-5" />
            </div>
            {!isSidebarCollapsed && (
              <div className="truncate">
                <span className="font-bold text-sm tracking-tight text-white block">DMA Agency CRM</span>
                <span className="text-[10px] text-sky-200 block truncate">Digital Marketing Agency</span>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (item.id !== "leads") setSelectedLeadForDetails(null);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#087BEA] text-white shadow-md shadow-[#087BEA]/25"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                } ${isSidebarCollapsed ? "justify-center px-0" : ""}`}
                title={isSidebarCollapsed ? item.label : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-sky-300"}`} />
                {!isSidebarCollapsed && (
                  <>
                    <span className="truncate text-left flex-1">{item.label}</span>
                    {item.badge !== undefined && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          isActive ? "bg-white/20 text-white" : "bg-[#39A9FF]/20 text-sky-300"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer info & Return to Website link */}
        <div className="p-3 border-t border-white/10 space-y-2">
          <a
            href="/"
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors ${
              isSidebarCollapsed ? "justify-center px-0" : ""
            }`}
            title="Return to Public Website"
          >
            <ExternalLink className="w-4 h-4 shrink-0 text-sky-400" />
            {!isSidebarCollapsed && <span>Agency Website</span>}
          </a>

          {!isSidebarCollapsed && (
            <div className="px-3 py-2 rounded-xl bg-white/5 text-[10px] text-slate-400">
              <p className="font-semibold text-slate-300 truncate">{user?.name}</p>
              <p className="truncate text-sky-300 uppercase font-bold text-[9px] mt-0.5">
                {user?.role === "admin" ? "Managing Director (Admin)" : "Growth Specialist"}
              </p>
            </div>
          )}
        </div>
      </aside>

      {/* MOBILE DRAWER */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-72 bg-[#092B55] text-white flex flex-col z-10 p-4 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#087BEA] text-white flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-sm block">DMA Agency CRM</span>
                  <span className="text-[10px] text-sky-200">Digital Marketing Agency</span>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                      if (item.id !== "leads") setSelectedLeadForDetails(null);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold ${
                      isActive ? "bg-[#087BEA] text-white" : "text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-sky-300" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-bold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-white/10">
              <a
                href="/"
                className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white"
              >
                <ExternalLink className="w-4 h-4 text-sky-400" /> Back to Website
              </a>
            </div>
          </div>
        </div>
      )}

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between shrink-0 sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb / Title */}
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="font-semibold text-slate-800">DMA CRM</span>
              <span>/</span>
              <span className="capitalize font-bold text-[#087BEA]">
                {navItems.find((n) => n.id === activeTab)?.label || activeTab}
              </span>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Supabase Status Pill */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-semibold text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Supabase Cloud Ready</span>
            </div>

            {/* Notifications Popover Toggle */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {todayFollowUpsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
                )}
              </button>

              {/* Notifications Dropdown Drawer */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl p-4 z-50 text-xs animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
                    <span className="font-bold text-slate-900">Recent CRM Activities</span>
                    <button
                      onClick={() => setIsNotificationsOpen(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="max-h-64 overflow-y-auto space-y-2.5">
                    {activities.slice(0, 5).map((act) => (
                      <div key={act.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                        <p className="font-semibold text-slate-800 text-[11px]">{act.description}</p>
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span>By: {act.performedBy}</span>
                          <span>{new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {todayFollowUpsCount > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100">
                      <Button
                        size="sm"
                        onClick={() => {
                          setIsNotificationsOpen(false);
                          setActiveTab("followups");
                        }}
                        className="w-full text-xs h-8 bg-blue-50 text-[#087BEA] border border-blue-200 hover:bg-blue-100"
                      >
                        View {todayFollowUpsCount} Today's Follow-up Tasks
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User Profile & Role Switcher */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-bold text-slate-900 leading-tight">{user?.name}</p>
                <div className="flex items-center justify-end gap-1 mt-0.5">
                  <span
                    className={`inline-block px-1.5 py-0.2 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      user?.role === "admin"
                        ? "bg-blue-100 text-[#087BEA]"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {user?.role}
                  </span>
                </div>
              </div>

              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#087BEA] to-[#092B55] text-white font-bold flex items-center justify-center text-xs shadow-sm">
                {user?.name.substring(0, 2).toUpperCase()}
              </div>

              {/* Logout Button */}
              <button
                onClick={() => signOut()}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === "dashboard" && (
            <DashboardTab
              onNavigateTab={(tab) => {
                setActiveTab(tab);
                if (tab !== "leads") setSelectedLeadForDetails(null);
              }}
              onSelectLead={handleSelectLead}
            />
          )}

          {activeTab === "leads" && (
            <LeadsTab
              selectedLeadForDetails={selectedLeadForDetails}
              onClearSelectedLead={() => setSelectedLeadForDetails(null)}
            />
          )}

          {activeTab === "pipeline" && (
            <LeadsTab />
          )}

          {activeTab === "followups" && (
            <FollowUpsTab onSelectLead={handleSelectLead} />
          )}

          {activeTab === "clients" && (
            <ClientsTab onSelectLead={handleSelectLead} />
          )}

          {activeTab === "cms" && <CmsTab />}

          {activeTab === "services" && <ServicesTab />}

          {activeTab === "reports" && <ReportsTab />}

          {activeTab === "team" && <TeamTab />}

          {activeTab === "settings" && <SettingsTab />}
        </main>
      </div>
    </div>
  );
}
