import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, AlertCircle } from "lucide-react";
import { enquirySchema, serviceOptions } from "@/lib/enquiry";
import { submitEnquiry } from "@/lib/enquiry.functions";
import { trackLead } from "@/lib/tracking";
import { Button } from "@/components/ui/button";
import { rememberConfirmedEnquiry, saveConfirmedEnquiry } from "@/lib/enquiry-confirmation";

type Errors = Partial<Record<string, string>>;
const field = "mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/25";

export function EnquiryForm({ defaultService = "" }: { defaultService?: string }) {
  const navigate = useNavigate();
  const saveEnquiry = useServerFn(submitEnquiry);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;
    const values = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const parsed = enquirySchema.safeParse(values);
    if (!parsed.success) {
      const errs: Errors = {};
      parsed.error.issues.forEach((i) => (errs[String(i.path[0])] ??= i.message));
      setErrors(errs);
      const firstField = String(parsed.error.issues[0]?.path[0] ?? "fullName");
      const input = e.currentTarget.elements.namedItem(firstField);
      if (input instanceof HTMLElement) input.focus();
      return;
    }
    setErrors({});
    setStatus("loading");
    try {
      await saveConfirmedEnquiry(parsed.data, (data) => saveEnquiry({ data }), () => {
        rememberConfirmedEnquiry();
        trackLead(parsed.data.service);
      });
      await navigate({ to: "/thank-you" });
    } catch {
      setStatus("error");
      setErrorMsg("We couldn't confirm that your enquiry was saved. Please try again in a moment. If the connection was interrupted, it may already have reached us.");
    }
  }

  const err = (k: string) => errors[k] && <p id={`${k}-err`} className="mt-1 text-xs text-destructive">{errors[k]}</p>;
  const aria = (k: string) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `${k}-err` : undefined });

  return (
    <form onSubmit={onSubmit} noValidate aria-busy={status === "loading"} className="min-w-0 space-y-5 rounded-2xl border bg-card p-6 shadow-card md:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block text-sm font-medium text-navy">Full Name *<input name="fullName" autoComplete="name" required maxLength={100} className={field} {...aria("fullName")} />{err("fullName")}</label>
        <label className="block text-sm font-medium text-navy">Business Email *<input name="email" type="email" autoComplete="email" required maxLength={255} className={field} {...aria("email")} />{err("email")}</label>
        <label className="block text-sm font-medium text-navy">Contact Number *<input name="phone" type="tel" autoComplete="tel" required maxLength={20} className={field} {...aria("phone")} />{err("phone")}</label>
        <label className="block text-sm font-medium text-navy">Company Name <span className="font-normal text-muted-foreground">(optional)</span><input name="company" autoComplete="organization" maxLength={120} className={field} {...aria("company")} />{err("company")}</label>
      </div>
      <label className="block text-sm font-medium text-navy">Service Interested In *
        <select name="service" required defaultValue={defaultService} className={field} {...aria("service")}>
          <option value="" disabled>Select a service</option>
          {serviceOptions.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>{err("service")}
      </label>
      <label className="block text-sm font-medium text-navy">Message / Project Requirements *<textarea name="message" rows={5} required maxLength={2000} className={field} {...aria("message")} />{err("message")}</label>
      {status === "error" && (
        <div role="alert" className="flex gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"><AlertCircle className="h-5 w-5 shrink-0" />{errorMsg}</div>
      )}
      <Button type="submit" disabled={status === "loading"} className="h-auto w-full rounded-lg bg-gradient-primary px-6 py-3.5 font-semibold text-primary-foreground shadow-elegant md:w-auto">
        {status === "loading" ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : "Send Enquiry"}
      </Button>
      <p className="text-xs text-muted-foreground">By submitting, you agree to our handling of your details as described in our <Link to="/privacy-policy" className="font-medium text-primary underline underline-offset-2">Privacy Policy</Link>.</p>
    </form>
  );
}
