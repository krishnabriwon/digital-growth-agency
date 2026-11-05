import { createServerFn } from "@tanstack/react-start";
import { enquirySchema } from "./enquiry";

/** Validates and persists an enquiry. Resolves only after the row is saved. */
export const submitEnquiry = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => enquirySchema.parse(data))
  .handler(async ({ data }) => {
    const { supabase } = await import("@/integrations/supabase/client");
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
      throw new Error("We couldn't save your enquiry. Please try again.");
    }
    return { ok: true as const };
  });
