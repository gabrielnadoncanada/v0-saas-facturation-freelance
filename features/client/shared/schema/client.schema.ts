import * as z from "zod"

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