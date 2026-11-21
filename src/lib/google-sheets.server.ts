import { createServerFn } from "@tanstack/react-start";
import type { EnquiryInput } from "./enquiry";

// Deployment address supplied by the owner; this is not a private credential.
export const webAppUrl =
  process.env["GOOGLE_SHEETS_WEBAPP_URL"] ||
  "https://script.google.com/macros/s/AKfycbzl09vZ7P6R4nU298g2fJLAy_2kMs1LFzntZIxzsfAf5FIK1cAzmTj2QWLthZJT5eihdg/exec";

export function encodeSheetEnquiry(data: EnquiryInput) {
  return new URLSearchParams({
    fullName: data.fullName,
    businessEmail: data.email,
    contactNumber: data.phone,
    companyName: data.company ?? "",
    service: data.service,
    message: data.message,
  });
}

export function confirmsSheetSave(payload: unknown): boolean {
  if (!payload || typeof payload !== "object") return false;
  const result = payload as { success?: unknown };
  return result.success === true;
}

/** Apps Script ContentService redirects to a read-only response URL after doPost. */
export async function sendEnquiryToSheet(data: EnquiryInput, request: typeof fetch = fetch) {
  let response = await request(webAppUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body: encodeSheetEnquiry(data).toString(),
    redirect: "manual",
    signal: AbortSignal.timeout(20000),
  });
  if ([301, 302, 303].includes(response.status)) {
    const location = response.headers.get("location");
    if (!location) throw new Error("Missing Apps Script response address");
    const target = new URL(location, webAppUrl);
    if (target.protocol !== "https:" || target.hostname !== "script.googleusercontent.com") {
      throw new Error("Unexpected Apps Script redirect");
    }
    // Never POST again: the original doPost may already have written the row.
    response = await request(target.toString(), {
      method: "GET",
      redirect: "manual",
      signal: AbortSignal.timeout(20000),
    });
  }
  if (!response.ok) throw new Error(`Apps Script returned HTTP ${response.status}`);
  let result: unknown;
  try {
    result = await response.json();
  } catch {
    throw new Error("Apps Script did not return a JSON confirmation");
  }
  if (!confirmsSheetSave(result)) throw new Error("Apps Script did not confirm a saved row");
}

export interface GoogleSheetLeadRow {
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  service: string;
  message: string;
  submittedAt?: string;
}

export function parseGoogleSheetRawRows(rawRows: unknown[][]): GoogleSheetLeadRow[] {
  if (!Array.isArray(rawRows) || rawRows.length <= 1) return [];

  // Clean headers
  const header = rawRows[0].map((h) => String(h || "").toLowerCase().replace(/[^a-z0-9]/g, ""));

  let nameIdx = header.findIndex((h) => h.includes("name") || h.includes("fullname"));
  let emailIdx = header.findIndex((h) => h.includes("email"));
  let phoneIdx = header.findIndex((h) => h.includes("phone") || h.includes("contact") || h.includes("number"));
  let companyIdx = header.findIndex((h) => h.includes("company"));
  let serviceIdx = header.findIndex((h) => h.includes("service"));
  let messageIdx = header.findIndex((h) => h.includes("message") || h.includes("requirement") || h.includes("query"));
  let dateIdx = header.findIndex((h) => h.includes("timestamp") || h.includes("date") || h.includes("time"));

  // Fallbacks if header doesn't match standard names
  if (nameIdx === -1) nameIdx = 1;
  if (emailIdx === -1) emailIdx = 2;
  if (phoneIdx === -1) phoneIdx = 3;
  if (companyIdx === -1) companyIdx = 4;
  if (serviceIdx === -1) serviceIdx = 5;
  if (messageIdx === -1) messageIdx = 6;
  if (dateIdx === -1) dateIdx = 0;

  const results: GoogleSheetLeadRow[] = [];
  for (let i = 1; i < rawRows.length; i++) {
    const cols = rawRows[i];
    if (!Array.isArray(cols) || cols.length === 0) continue;

    const fullName = String(cols[nameIdx] || "").trim();
    const email = String(cols[emailIdx] || "").trim();
    const phone = String(cols[phoneIdx] || "").trim();
    const company = companyIdx !== -1 && cols[companyIdx] ? String(cols[companyIdx]).trim() : undefined;
    const service = serviceIdx !== -1 && cols[serviceIdx] ? String(cols[serviceIdx]).trim() : "Website Marketing Enquiry";
    const message = messageIdx !== -1 && cols[messageIdx] ? String(cols[messageIdx]).trim() : "Submitted via Website Contact Form";
    const submittedAt = dateIdx !== -1 && cols[dateIdx] ? String(cols[dateIdx]).trim() : undefined;

    if (fullName && (email || phone || message)) {
      results.push({
        fullName,
        email: email || "contact@website.lead",
        phone: phone || "N/A",
        company: company || undefined,
        service: service || "General Marketing",
        message: message || "Enquiry from Google Sheet",
        submittedAt,
      });
    }
  }

  return results;
}

export function parseGoogleSheetCsv(csvText: string): GoogleSheetLeadRow[] {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length <= 1) return [];

  // Parse CSV line handling quotes and commas
  const parseCsvLine = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const rawRows: string[][] = [];
  for (const line of lines) {
    rawRows.push(parseCsvLine(line));
  }

  return parseGoogleSheetRawRows(rawRows);
}

/** Unified server function to auto-sync all leads from Google Sheet via Apps Script or Direct Sheet URL */
export const syncAllGoogleSheetLeadsFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    const sheetUrl =
      typeof data === "object" && data !== null && "sheetUrl" in data
        ? String((data as { sheetUrl?: string }).sheetUrl || "")
        : "";
    return { sheetUrl };
  })
  .handler(async ({ data }) => {
    // 1. Try Apps Script Web App GET first (if doGet is deployed)
    try {
      const response = await fetch(webAppUrl, {
        method: "GET",
        headers: { Accept: "application/json" },
        redirect: "follow",
        signal: AbortSignal.timeout(12000),
      });

      if (response.ok) {
        const text = await response.text();
        if (text.startsWith("{") || text.startsWith("[")) {
          const json = JSON.parse(text);
          const rawRows = Array.isArray(json.rows) ? json.rows : Array.isArray(json) ? json : null;
          if (rawRows && rawRows.length > 0) {
            const rows = parseGoogleSheetRawRows(rawRows);
            return {
              ok: true,
              source: "apps_script" as const,
              rows,
              message: `Fetched ${rows.length} leads automatically from Google Apps Script.`,
            };
          }
        }
      }
    } catch (e) {
      console.warn("Apps Script Web App GET query note:", e);
    }

    // 2. Try Google Sheet Direct URL (from argument, siteConfig, or env)
    const rawUrl =
      data.sheetUrl.trim() ||
      process.env["GOOGLE_SHEET_URL"] ||
      process.env["VITE_GOOGLE_SHEET_URL"] ||
      "";

    if (rawUrl) {
      let sheetId = "";
      const match = rawUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
      if (match) {
        sheetId = match[1];
      } else if (/^[a-zA-Z0-9-_]{20,}$/.test(rawUrl)) {
        sheetId = rawUrl;
      }

      if (sheetId) {
        // Try CSV export first
        try {
          const exportUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;
          const res = await fetch(exportUrl, {
            headers: { "User-Agent": "Mozilla/5.0" },
            signal: AbortSignal.timeout(12000),
          });
          if (res.ok) {
            const csvText = await res.text();
            const rows = parseGoogleSheetCsv(csvText);
            if (rows.length > 0) {
              return {
                ok: true,
                source: "sheet_csv" as const,
                rows,
                message: `Fetched ${rows.length} leads from Google Sheet CSV.`,
              };
            }
          }
        } catch (csvErr) {
          console.warn("CSV export note:", csvErr);
        }

        // Try GViz export
        try {
          const gvizUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=Leads`;
          const res = await fetch(gvizUrl, {
            headers: { "User-Agent": "Mozilla/5.0" },
            signal: AbortSignal.timeout(12000),
          });
          if (res.ok) {
            const csvText = await res.text();
            const rows = parseGoogleSheetCsv(csvText);
            if (rows.length > 0) {
              return {
                ok: true,
                source: "sheet_gviz" as const,
                rows,
                message: `Fetched ${rows.length} leads from Google Sheet (Leads tab).`,
              };
            }
          }
        } catch (gvizErr) {
          console.warn("GViz query note:", gvizErr);
        }
      }
    }

    return {
      ok: false,
      source: "none" as const,
      rows: [],
      error: "Google Apps Script needs doGet or Google Sheet URL needs to be configured.",
    };
  });

/** Legacy server function maintained for backward compatibility */
export const fetchGoogleSheetLeadsFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    if (typeof data !== "object" || data === null || !("sheetUrl" in data)) {
      throw new Error("Missing sheetUrl parameter");
    }
    return data as { sheetUrl: string };
  })
  .handler(async ({ data }) => {
    return syncAllGoogleSheetLeadsFn({ data });
  });
