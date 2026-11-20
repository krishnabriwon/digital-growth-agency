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