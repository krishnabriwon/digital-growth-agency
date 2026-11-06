import type { EnquiryInput } from "./enquiry";

/** Never acknowledge a lead until the save explicitly succeeds. */
export async function saveConfirmedEnquiry(
  data: EnquiryInput,
  save: (data: EnquiryInput) => Promise<{ ok: boolean }>,
  onConfirmed: () => void,
) {
  const result = await save(data);
  if (result.ok !== true) throw new Error("Enquiry save was not confirmed");
  onConfirmed();
}

const receiptKey = "dma-confirmed-enquiry";
export function rememberConfirmedEnquiry() {
  try { sessionStorage.setItem(receiptKey, "saved"); } catch { /* Storage can be blocked. */ }
}
export function hasConfirmedEnquiry() {
  try { return sessionStorage.getItem(receiptKey) === "saved"; } catch { return false; }
}