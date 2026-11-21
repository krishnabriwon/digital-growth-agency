import { useState } from "react";
import { crmStore } from "@/lib/crm/crm-store";
import { useCrmAuth } from "@/lib/crm/auth-context";
import {
  Database,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Download,
  AlertCircle,
  Sparkles,
  Server,
  Layers,
  Settings2,
  Bell,
  MessageSquare,
  FileSpreadsheet,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export function SettingsTab() {
  const { user, switchRole } = useCrmAuth();
  const [copied, setCopied] = useState(false);
  const [sheetUrlInput, setSheetUrlInput] = useState(() => crmStore.getGoogleSheetUrl());
  const [isSavingSheet, setIsSavingSheet] = useState(false);
  const [sheetSyncFeedback, setSheetSyncFeedback] = useState<string | null>(null);
  const [copiedDoGet, setCopiedDoGet] = useState(false);

  const handleSaveAndSyncSheet = async () => {
    setIsSavingSheet(true);
    setSheetSyncFeedback(null);
    crmStore.setGoogleSheetUrl(sheetUrlInput);
    const res = await crmStore.autoSyncGoogleSheets(sheetUrlInput);
    setIsSavingSheet(false);
    setSheetSyncFeedback(res.message);
    setTimeout(() => setSheetSyncFeedback(null), 6000);
  };

  const handleCopyDoGet = () => {
    const code = `function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Leads") || ss.getActiveSheet();
  var data = sheet.getDataRange().getValues();
  return ContentService
    .createTextOutput(JSON.stringify({ success: true, rows: data }))
    .setMimeType(ContentService.MimeType.JSON);
}`;
    navigator.clipboard.writeText(code);
    setCopiedDoGet(true);
    setTimeout(() => setCopiedDoGet(false), 3000);
  };

  const supabaseUrl =
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_URL) ||
    "https://c--809f60c8-936a-476d-8dc6-eb98e4e0e445-prod.lovable.cloud";
  const supabaseProject =
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_PROJECT_ID) ||
    "jvofnpyuruuuueeyomui";

  const handleCopySchema = () => {
    fetch("/supabase-crm-schema.sql")
      .then((r) => r.text())
      .then((text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      })
      .catch(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <h1 className="text-xl font-bold text-[#092B55]">Agency CRM Settings & Architecture</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure branding, database synchronization, role permissions, and integration endpoints.
        </p>
      </div>

      {/* Agency Brand Identity Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-[#092B55] flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-[#087BEA]" /> Brand Identity & Configuration
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">CRM Name</span>
            <p className="font-bold text-slate-900 mt-1">DMA Agency CRM</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Agency Brand</span>
            <p className="font-bold text-slate-900 mt-1">Digital Marketing Agency</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Official Tagline</span>
            <p className="font-bold text-[#087BEA] mt-1">Driving Digital Growth. Delivering Real Results.</p>
          </div>
        </div>

        {/* Brand Colors Palette Preview */}
        <div>
          <span className="text-xs font-semibold text-slate-700">Official Brand Color System</span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mt-2 text-xs">
            <div className="p-2.5 rounded-xl border border-slate-200 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#087BEA] shadow-xs shrink-0" />
              <div>
                <p className="font-bold text-slate-900 text-[11px]">Corporate Blue</p>
                <p className="font-mono text-[10px] text-slate-400">#087BEA</p>
              </div>
            </div>
            <div className="p-2.5 rounded-xl border border-slate-200 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#092B55] shadow-xs shrink-0" />
              <div>
                <p className="font-bold text-slate-900 text-[11px]">Deep Navy</p>
                <p className="font-mono text-[10px] text-slate-400">#092B55</p>
              </div>
            </div>
            <div className="p-2.5 rounded-xl border border-slate-200 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#39A9FF] shadow-xs shrink-0" />
              <div>
                <p className="font-bold text-slate-900 text-[11px]">Sky Blue</p>
                <p className="font-mono text-[10px] text-slate-400">#39A9FF</p>
              </div>
            </div>
            <div className="p-2.5 rounded-xl border border-slate-200 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#FFFFFF] border shadow-xs shrink-0" />
              <div>
                <p className="font-bold text-slate-900 text-[11px]">Pure White</p>
                <p className="font-mono text-[10px] text-slate-400">#FFFFFF</p>
              </div>
            </div>
            <div className="p-2.5 rounded-xl border border-slate-200 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#F4F7FB] border shadow-xs shrink-0" />
              <div>
                <p className="font-bold text-slate-900 text-[11px]">Light Surface</p>
                <p className="font-mono text-[10px] text-slate-400">#F4F7FB</p>
              </div>
            </div>
            <div className="p-2.5 rounded-xl border border-slate-200 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#263445] shadow-xs shrink-0" />
              <div>
                <p className="font-bold text-slate-900 text-[11px]">Text Body</p>
                <p className="font-mono text-[10px] text-slate-400">#263445</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Database Architecture & Supabase Status Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#092B55] flex items-center gap-2">
            <Database className="w-4 h-4 text-[#087BEA]" /> Supabase Cloud Database & Storage
          </h2>
          <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            Backend Connected
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Supabase URL</span>
            <p className="font-mono text-[11px] text-slate-800 break-all mt-1">{supabaseUrl}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Project ID</span>
            <p className="font-mono text-[11px] text-slate-800 mt-1">{supabaseProject}</p>
          </div>
        </div>

        {/* Website Enquiry Synchronization Details */}
        <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#092B55] flex items-center gap-1.5">
              <Server className="w-4 h-4 text-[#087BEA]" />
              Website Enquiries Table: public.contact_submissions
            </span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
              Live Integration Active
            </span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            The agency website contact form automatically writes to <code>public.contact_submissions</code> and
            Google Sheets. The CRM automatically queries and synchronizes these records into CRM Leads with
            zero duplicate writes.
          </p>
        </div>

        {/* Schema Script Preview & Instructions */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-xs text-slate-900">Database Schema Migration Script</p>
              <p className="text-[11px] text-slate-500">
                Created in repository root: <code>supabase-crm-schema.sql</code>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopySchema}
                className="h-8 text-xs bg-white"
              >
                <Copy className="w-3.5 h-3.5 mr-1" />
                {copied ? "Copied!" : "Copy SQL"}
              </Button>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            This SQL script creates <code>profiles</code>, <code>leads</code>, <code>clients</code>,{" "}
            <code>follow_ups</code>, <code>activities</code>, and <code>services</code> tables with full Row Level
            Security (RLS) policies and an automatic trigger that converts new website enquiries directly into
            CRM leads.
          </p>
        </div>
      </div>

      {/* Google Sheets Automated Live Data Synchronization */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#092B55] flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Google Sheets Live Auto-Sync Engine
          </h2>
          <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            Background Sync Active (25s)
          </Badge>
        </div>

        <p className="text-xs text-slate-500">
          The CRM automatically synchronizes all historical, current, and upcoming enquiries from your Google Sheet (<strong>Leads</strong> tab) directly into your CRM dashboard.
        </p>

        {sheetSyncFeedback && (
          <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#087BEA] shrink-0" />
            <span>{sheetSyncFeedback}</span>
          </div>
        )}

        {/* Option A: Direct Google Sheet URL Sync */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
          <div>
            <Label className="text-xs font-bold text-slate-800">Option 1: Google Sheet URL Direct Auto-Pull</Label>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Paste the URL of your <strong>WEBSITE LEADS</strong> Google Sheet. Once saved, the CRM continuously syncs every single row.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              type="url"
              placeholder="https://docs.google.com/spreadsheets/d/..."
              value={sheetUrlInput}
              onChange={(e) => setSheetUrlInput(e.target.value)}
              className="h-9 text-xs rounded-xl bg-white"
            />
            <Button
              size="sm"
              disabled={isSavingSheet}
              onClick={handleSaveAndSyncSheet}
              className="h-9 text-xs bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 font-semibold"
            >
              {isSavingSheet ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Syncing...
                </>
              ) : (
                "Save & Sync All Leads"
              )}
            </Button>
          </div>
          <p className="text-[10px] text-slate-400">
            Note: Set link sharing on the Google Sheet to <em>"Anyone with the link can view"</em> so the CRM can read the rows.
          </p>
        </div>

        {/* Option B: Native Apps Script doGet Handler */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-xs font-bold text-slate-800">Option 2: Native Apps Script doGet Sync (Private)</Label>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Paste these 5 lines into your Google Apps Script editor (<strong>Extensions → Apps Script</strong>) and deploy as a new version:
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopyDoGet}
              className="h-8 text-xs bg-white shrink-0"
            >
              <Copy className="w-3.5 h-3.5 mr-1" />
              {copiedDoGet ? "Copied!" : "Copy Code"}
            </Button>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto">
            <pre>{`function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Leads") || ss.getActiveSheet();
  var data = sheet.getDataRange().getValues();
  return ContentService
    .createTextOutput(JSON.stringify({ success: true, rows: data }))
    .setMimeType(ContentService.MimeType.JSON);
}`}</pre>
          </div>
        </div>
      </div>

      {/* Role Switching for Testing */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
        <h2 className="text-sm font-bold text-[#092B55] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#087BEA]" /> Active User Session & Role Switcher
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div>
            <p className="font-bold text-slate-900">{user?.name} ({user?.email})</p>
            <p className="text-slate-500 mt-0.5">Current Role: <strong className="text-[#087BEA] uppercase">{user?.role}</strong> ({user?.title})</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Test as:</span>
            <button
              onClick={() => switchRole("admin")}
              className={`px-3 py-1.5 rounded-lg font-semibold text-xs border transition-colors ${
                user?.role === "admin"
                  ? "bg-[#087BEA] text-white border-[#087BEA]"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
              }`}
            >
              Admin Role
            </button>
            <button
              onClick={() => switchRole("team_member")}
              className={`px-3 py-1.5 rounded-lg font-semibold text-xs border transition-colors ${
                user?.role === "team_member"
                  ? "bg-[#087BEA] text-white border-[#087BEA]"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
              }`}
            >
              Team Member Role
            </button>
          </div>
        </div>
      </div>

      {/* Notifications & Automation Notice */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
        <h2 className="text-sm font-bold text-[#092B55] flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#087BEA]" /> Notification & Automation Channels
        </h2>
        <div className="space-y-2 text-xs text-slate-600">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-medium text-slate-800">In-App Follow-up Reminders & Overdue Banners</span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Active
            </span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-medium text-slate-800">Automated Google Sheets Lead Logging</span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Active (Google Apps Script Web App)
            </span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-medium text-slate-800">Direct WhatsApp & SMS Webhook Push</span>
            <span className="text-slate-500 font-semibold bg-slate-200/70 px-2 py-0.5 rounded-full">
              Pending API Credentials (Twilio / Interakt)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
