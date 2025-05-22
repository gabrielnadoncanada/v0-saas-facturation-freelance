import { z } from 'zod'

export const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Le nom doit contenir au moins 2 caractères.',
  }),
  email: z.string().email({
    message: 'Veuillez entrer une adresse email valide.',
  }),
  company_name: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  default_currency: z.string(),
  tax_rate: z.coerce.number().min(0).max(100).optional(),
  tax_id: z.string().optional(),
  website: z.string().url({ message: 'Veuillez entrer une URL valide' }).optional().or(z.literal('')),
})

export type ProfileFormSchema = z.infer<typeof profileFormSchema>
