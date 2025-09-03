import * as z from 'zod';

export const clientFormSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  hourlyRate: z.string().optional().or(z.literal('')),
  billingAddress: z.string().optional().or(z.literal('')),
  billingCity: z.string().optional().or(z.literal('')),
  billingPostalCode: z.string().optional().or(z.literal('')),
  billingCountry: z.string().optional().or(z.literal('')),
  shippingAddress: z.string().optional().or(z.literal('')),
  shippingCity: z.string().optional().or(z.literal('')),
  shippingPostalCode: z.string().optional().or(z.literal('')),
  shippingCountry: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
  sameAsShipping: z.boolean().optional(),
});

export type ClientFormSchema = z.infer<typeof clientFormSchema>;
