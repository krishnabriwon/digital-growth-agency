// Server helper tests use mocked HTTP only; no personal details are sent to Google.
import { describe, expect, it, vi } from "vitest";
import { encodeSheetEnquiry, sendEnquiryToSheet } from "@/lib/google-sheets.server";

const enquiry = { fullName: "Test & Name", email: "test@example.com", phone: "+919000000000", company: "", service: "SEO (Search Engine Optimization)", message: "A test message with & and + characters." };

describe("Google Sheets contact delivery", () => {
  it("sends the six exact e.parameter names with safely encoded values", () => {
    const params = new URLSearchParams(encodeSheetEnquiry(enquiry).toString());
    expect([...params.keys()]).toEqual(["fullName", "businessEmail", "contactNumber", "companyName", "service", "message"]);
    expect(params.get("businessEmail")).toBe("test@example.com");
    expect(params.get("contactNumber")).toBe("+919000000000");
    expect(params.get("fullName")).toBe("Test & Name");
    expect(params.get("companyName")).toBe("");
  });
  it("confirms only an explicit Apps Script saved response", async () => {
    const request = vi.fn<typeof fetch>().mockResolvedValue(new Response('{"success":true}', { status: 200 }));
    await expect(sendEnquiryToSheet(enquiry, request)).resolves.toBeUndefined();
    expect(request.mock.calls[0]?.[1]?.method).toBe("POST");
    expect(request.mock.calls[0]?.[1]?.headers).toEqual({ "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" });
  });
  it("reads the Apps Script redirect without repeating the POST", async () => {
    const request = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(new Response(null, { status: 302, headers: { location: "https://script.googleusercontent.com/macros/echo?test=1" } }))
      .mockResolvedValueOnce(new Response('{"success":true}'));
    await sendEnquiryToSheet(enquiry, request);
    expect(request.mock.calls.map((call) => call[1]?.method)).toEqual(["POST", "GET"]);
  });
  it.each(['{"success":false}', '{}', '<html>Sign in</html>'])("rejects unconfirmed response %s", async (body) => {
    const request = vi.fn<typeof fetch>().mockResolvedValue(new Response(body));
    await expect(sendEnquiryToSheet(enquiry, request)).rejects.toThrow();
    expect(request).toHaveBeenCalledTimes(1);
  });
  it("does not forward data to a login or unexpected redirect", async () => {
    const request = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 302, headers: { location: "https://accounts.google.com/login" } }));
    await expect(sendEnquiryToSheet(enquiry, request)).rejects.toThrow("Unexpected");
    expect(request).toHaveBeenCalledTimes(1);
  });
  it("rejects a failed HTTP status", async () => {
    const request = vi.fn<typeof fetch>().mockResolvedValue(new Response("Unavailable", { status: 503 }));
    await expect(sendEnquiryToSheet(enquiry, request)).rejects.toThrow("503");
  });
});