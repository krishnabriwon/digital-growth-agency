import { z } from "zod";
import { services } from "./services";

export const serviceOptions = [...services.map((s) => s.name), "Not sure yet – need guidance"];

export const enquirySchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(100, "Name is too long"),
  email: z.string().trim().email("Please enter a valid business email").max(255, "Email is too long"),
  phone: z
    .string()
    .trim()
    .regex(/^[+]?[0-9\s-]{7,20}$/, "Please enter a valid contact number"),
  company: z.string().trim().max(120, "Company name is too long").optional().or(z.literal("")),
  service: z.string().refine((v) => serviceOptions.includes(v), "Please select a service"),
  message: z
    .string()
    .trim()
    .min(10, "Please share a few details (at least 10 characters)")
    .max(2000, "Message is too long (max 2000 characters)"),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;
