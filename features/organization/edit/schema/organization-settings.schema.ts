import { z } from 'zod';

export const organizationSettingsSchema = z.object({
  default_currency: z.string().min(3, 'La devise doit contenir au moins 3 caractères'),
  default_tax_rate: z.number().min(0, 'Le taux de TVA doit être positif').max(100, 'Le taux de TVA ne peut pas dépasser 100%'),
  invoice_prefix: z.string().min(1, 'Le préfixe de facture est requis').max(10, 'Le préfixe ne peut pas dépasser 10 caractères'),
  invoice_number_format: z.string().min(1, 'Le format de numérotation est requis'),
  next_invoice_number: z.number().min(1, 'Le prochain numéro de facture doit être supérieur à 0'),
  default_payment_terms: z.number().min(0, 'Les conditions de paiement doivent être positives').max(365, 'Les conditions de paiement ne peuvent pas dépasser 365 jours'),
  late_fee_percentage: z.number().min(0, 'Les frais de retard doivent être positifs').max(100, 'Les frais de retard ne peuvent pas dépasser 100%'),
  company_address: z.string().optional(),
  company_city: z.string().optional(),
  company_postal_code: z.string().optional(),
  company_country: z.string().optional(),
  company_phone: z.string().optional(),
  company_email: z.string().email('Email invalide').optional().or(z.literal('')),
  company_website: z.string().url('URL invalide').optional().or(z.literal('')),
  company_tax_number: z.string().optional(),
});

export type OrganizationSettingsSchema = z.infer<typeof organizationSettingsSchema>; 