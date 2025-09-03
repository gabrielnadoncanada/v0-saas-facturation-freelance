import { z } from 'zod';

export const organizationSettingsSchema = z.object({
  defaultCurrency: z.string().min(3, 'La devise doit contenir au moins 3 caractères'),
  defaultTaxRate: z
    .number()
    .min(0, 'Le taux de TVA doit être positif')
    .max(100, 'Le taux de TVA ne peut pas dépasser 100%'),
  invoicePrefix: z
    .string()
    .min(1, 'Le préfixe de facture est requis')
    .max(10, 'Le préfixe ne peut pas dépasser 10 caractères'),
  invoiceNumberFormat: z.string().min(1, 'Le format de numérotation est requis'),
  nextInvoiceNumber: z.number().min(1, 'Le prochain numéro de facture doit être supérieur à 0'),
  defaultPaymentTerms: z
    .number()
    .min(0, 'Les conditions de paiement doivent être positives')
    .max(365, 'Les conditions de paiement ne peuvent pas dépasser 365 jours'),
  lateFeePercentage: z
    .number()
    .min(0, 'Les frais de retard doivent être positifs')
    .max(100, 'Les frais de retard ne peuvent pas dépasser 100%'),
  companyAddress: z.string().optional(),
  companyCity: z.string().optional(),
  companyPostalCode: z.string().optional(),
  companyCountry: z.string().optional(),
  companyPhone: z.string().optional(),
  companyEmail: z.string().email('Email invalide').optional().or(z.literal('')),
  companyWebsite: z.string().url('URL invalide').optional().or(z.literal('')),
  companyTaxNumber: z.string().optional(),
});

export type OrganizationSettingsSchema = z.infer<typeof organizationSettingsSchema>;
