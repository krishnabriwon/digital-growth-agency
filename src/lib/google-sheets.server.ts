import { createServerFn } from "@tanstack/react-start";
import type { EnquiryInput } from "./enquiry";

// Deployment address supplied by the owner; this is not a private credential.
const webAppUrl = "https://script.google.com/macros/s/AKfycbzl09vZ7P6R4nU298g2fJLAy_2kMs1LFzntZIxzsfAf5FIK1cAzmTj2QWLthZJT5eihdg/exec";

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
      method: "GET", redirect: "manual", signal: AbortSignal.timeout(20000),
    });
  }
  if (!response.ok) throw new Error(`Apps Script returned HTTP ${response.status}`);
  let result: unknown;
  try { result = await response.json(); } catch { throw new Error("Apps Script did not return a JSON confirmation"); }
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

  const header = parseCsvLine(lines[0]).map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ""));

  let nameIdx = header.findIndex((h) => h.includes("name") || h.includes("fullname"));
  let emailIdx = header.findIndex((h) => h.includes("email"));
  let phoneIdx = header.findIndex((h) => h.includes("phone") || h.includes("contact") || h.includes("number"));
  let companyIdx = header.findIndex((h) => h.includes("company"));
  let serviceIdx = header.findIndex((h) => h.includes("service"));
  let messageIdx = header.findIndex((h) => h.includes("message") || h.includes("requirement"));
  let dateIdx = header.findIndex((h) => h.includes("timestamp") || h.includes("date") || h.includes("time"));

  if (nameIdx === -1) nameIdx = 1;
  if (emailIdx === -1) emailIdx = 2;
  if (phoneIdx === -1) phoneIdx = 3;
  if (serviceIdx === -1) serviceIdx = 5;
  if (messageIdx === -1) messageIdx = 6;

  const results: GoogleSheetLeadRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    if (cols.length < 2) continue;

    const fullName = cols[nameIdx] || cols[1] || "";
    const email = cols[emailIdx] || cols[2] || "";
    const phone = cols[phoneIdx] || cols[3] || "";
    const company = companyIdx !== -1 && cols[companyIdx] ? cols[companyIdx] : undefined;
    const service = serviceIdx !== -1 && cols[serviceIdx] ? cols[serviceIdx] : "Website Marketing Enquiry";
    const message = messageIdx !== -1 && cols[messageIdx] ? cols[messageIdx] : "Submitted via Website Contact Form";
    const submittedAt = dateIdx !== -1 && cols[dateIdx] ? cols[dateIdx] : undefined;

    if (fullName.trim() && (email.trim() || phone.trim())) {
      results.push({
        fullName: fullName.trim(),
        email: email.trim() || "no-email@sheet.local",
        phone: phone.trim() || "N/A",
        company: company ? company.trim() : undefined,
        service: service.trim(),
        message: message.trim(),
        submittedAt: submittedAt ? submittedAt.trim() : undefined,
      });
    }
  }

  return results;
}

export const fetchGoogleSheetLeadsFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    if (typeof data !== "object" || data === null || !("sheetUrl" in data)) {
      throw new Error("Missing sheetUrl parameter");
    }
    return data as { sheetUrl: string };
  })
  .handler(async ({ data }) => {
    const rawUrl = data.sheetUrl.trim();
    let sheetId = "";
    const match = rawUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (match) {
      sheetId = match[1];
    } else if (/^[a-zA-Z0-9-_]{20,}$/.test(rawUrl)) {
      sheetId = rawUrl;
    } else {
      return { ok: false, error: "Please provide a valid Google Sheet URL or ID.", rows: [] };
    }

    const exportUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
    try {
      const res = await fetch(exportUrl, {
        headers: { "User-Agent": "Mozilla/5.0" },
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) {
        return {
          ok: false,
          error: `Google Sheets returned HTTP ${res.status}. Please make sure sheet sharing is set to 'Anyone with the link can view'.`,
          rows: [],
        };
      }
      const csvText = await res.text();
      const rows = parseGoogleSheetCsv(csvText);
      return { ok: true, rows };
    } catch (e) {
      return {
        ok: false,
        error: e instanceof Error ? e.message : "Failed to fetch Google Sheet rows",
        rows: [],
      };
    }
  });
