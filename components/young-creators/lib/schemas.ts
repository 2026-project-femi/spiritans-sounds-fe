import { z } from "zod";

const cats = z.enum(["writing", "music", "visual-art", "photography", "dance", "digital", "technology"]);
const phone = z.string().trim().max(30).regex(/^[+0-9 ()-]*$/, "Use digits, spaces and + only").optional().or(z.literal(""));

export const mentorSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone,
  organisation: z.string().trim().max(120).optional(),
  expertise: z.array(cats).min(1, "Choose at least one area"),
  experience: z.string().trim().min(30, "Tell us a little more (30+ characters)").max(1500),
  availability: z.enum(["monthly", "fortnightly", "weekly", "project"]),
  format: z.enum(["in-person", "online", "either"]),
  safeguardingConsent: z.boolean().refine((v) => v === true, { message: "Required to mentor young people" }),
});

export const opportunitySchema = z.object({
  contactName: z.string().trim().min(2, "Please enter your name").max(100),
  organisation: z.string().trim().min(2, "Organisation is required").max(120),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone,
  type: z.enum(["internship", "commission", "performance", "exhibition", "scholarship", "workshop", "other"]),
  categories: z.array(cats).min(1, "Choose at least one talent area"),
  title: z.string().trim().min(4, "Give the opportunity a title").max(120),
  description: z.string().trim().min(40, "Describe the opportunity (40+ characters)").max(2000),
  location: z.string().trim().min(2, "Location or 'Online'").max(120),
  deadline: z.string().optional(),
  safeguardingConsent: z.boolean().refine((v) => v === true, { message: "Please confirm" }),
});

export const supportSchema = z.object({
  amount: z.number({ error: "Enter an amount" }).positive("Enter an amount").max(10_000_000),
  currency: z.enum(["NGN", "GBP", "USD"]),
  frequency: z.enum(["one-off", "monthly"]),
  designation: z.enum(["general", "mentorship", "equipment", "showcase"]),
  donorName: z.string().trim().min(2, "Enter your name").max(100),
  donorEmail: z.string().trim().email("Enter a valid email").max(255),
  giftAid: z.boolean().optional(),
});

type FieldKey = "form" | "fullName" | "email" | "phone" | "expertise" | "experience" | "safeguardingConsent" | "contactName" | "organisation" | "categories" | "title" | "description" | "location" | "amount" | "donorName" | "donorEmail";
export type FieldErrors = Partial<Record<FieldKey, string>>;
export function toFieldErrors(err: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const i of err.issues) { const k = i.path.join(".") as FieldKey; out[k] ??= i.message; }
  return out;
}
