import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { enquirySchema } from "./enquiry";

/** Confirms only after both the existing stored copy and Google Sheets succeed. */
export const submitEnquiry = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => enquirySchema.parse(data))
  .handler(async ({ data }) => {
    const key =
      process.env["SUPABASE_PUBLISHABLE_KEY"] ||
      process.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
    const url =
      process.env["SUPABASE_URL"] ||
      process.env["VITE_SUPABASE_URL"];
    if (!key || !url) throw new Error("Enquiry submission is not configured on the server");
    // Isolated public client: no visitor session and no browser storage on the server.
    const supabase = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      global: { fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      } },
    });
    const { error } = await supabase.from("contact_submissions").insert({
      full_name: data.fullName,
      email: data.email,
      phone: data.phone,
      company: data.company ? data.company : null,
      service: data.service,
      message: data.message,
    });
    if (error) {
      console.error("Enquiry insert failed", error.message);
      return { ok: false as const, message: "We couldn't save your enquiry. Please try again in a moment." };
    }
    try {
      const { sendEnquiryToSheet } = await import("./google-sheets.server");
      await sendEnquiryToSheet(data);
    } catch (error) {
      console.error("Google Sheets enquiry confirmation failed", error instanceof Error ? error.message : "Unknown error");
      return {
        ok: false as const,
        message: "Your enquiry was saved in our records, but Google Sheets delivery could not be confirmed. Please don't resubmit immediately, as it may already have reached the sheet.",
      };
    }
    return { ok: true as const };
  });
