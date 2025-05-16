import * as z from "zod"

export interface Client {
  id: string;
  user_id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  hourly_rate?: number | null;
  billing_address?: string | null;
  billing_city?: string | null;
  billing_postal_code?: string | null;
  billing_country?: string | null;
  shipping_address?: string | null;
  shipping_city?: string | null;
  shipping_postal_code?: string | null;
  shipping_country?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ClientFormData {
  name: string;
  email?: string;
  phone?: string;
  hourly_rate?: string | number;
  billing_address?: string;
  billing_city?: string;
  billing_postal_code?: string;
  billing_country?: string;
  shipping_address?: string;
  shipping_city?: string;
  shipping_postal_code?: string;
  shipping_country?: string;
  notes?: string;
  sameAsShipping?: boolean;
}

export interface ClientActionResult {
  success: boolean;
  error?: string;
  data?: Client | Client[];
}

export const clientFormSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  hourly_rate: z.union([z.string(), z.number()]).optional().or(z.literal("")),
  billing_address: z.string().optional().or(z.literal("")),
  billing_city: z.string().optional().or(z.literal("")),
  billing_postal_code: z.string().optional().or(z.literal("")),
  billing_country: z.string().optional().or(z.literal("")),
  shipping_address: z.string().optional().or(z.literal("")),
  shipping_city: z.string().optional().or(z.literal("")),
  shipping_postal_code: z.string().optional().or(z.literal("")),
  shipping_country: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
  sameAsShipping: z.boolean().optional(),
})

export type ClientFormSchema = z.infer<typeof clientFormSchema> 