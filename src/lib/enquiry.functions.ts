import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { enquirySchema } from "./enquiry";

/** Validates and persists an enquiry. Resolves only after the row is saved. */
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
      throw new Error(error.message || "We couldn't save your enquiry. Please try again.");
    }
    return { ok: true as const };
  });
