import { describe, expect, it, vi } from "vitest";
import { saveConfirmedEnquiry, hasConfirmedEnquiry, rememberConfirmedEnquiry } from "@/lib/enquiry-confirmation";
import { enquirySchema } from "@/lib/enquiry";

const enquiry = { fullName: "Website Test", email: "test@example.com", phone: "9000000000", company: "", service: "SEO (Search Engine Optimization)", message: "Please discuss our SEO requirements." };

describe("Honest enquiry confirmation", () => {
  it("does not confirm or convert a rejected save", async () => {
    const confirm = vi.fn();
    await expect(saveConfirmedEnquiry(enquiry, async () => { throw new Error("Unavailable"); }, confirm)).rejects.toThrow();
    expect(confirm).not.toHaveBeenCalled();
  });
  it("does not confirm a response without explicit success", async () => {
    const confirm = vi.fn();
    await expect(saveConfirmedEnquiry(enquiry, async () => ({ ok: false }), confirm)).rejects.toThrow();
    expect(confirm).not.toHaveBeenCalled();
  });
  it("confirms exactly once after persistence resolves", async () => {
    const order: string[] = [];
    await saveConfirmedEnquiry(enquiry, async () => { order.push("saved"); return { ok: true }; }, () => order.push("confirmed"));
    expect(order).toEqual(["saved", "confirmed"]);
  });
  it("does not claim a saved enquiry for a fresh visitor", () => {
    sessionStorage.clear();
    expect(hasConfirmedEnquiry()).toBe(false);
    rememberConfirmedEnquiry();
    expect(hasConfirmedEnquiry()).toBe(true);
    sessionStorage.clear();
  });
  it("keeps company optional and requires name, email, phone, service and message", () => {
    expect(enquirySchema.safeParse({ ...enquiry, company: undefined }).success).toBe(true);
    for (const name of ["fullName", "email", "phone", "service", "message"]) {
      expect(enquirySchema.safeParse({ ...enquiry, [name]: "" }).success).toBe(false);
    }
  });
});