import { z } from "zod"

export const productFormSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string(),
  price: z
    .number({ invalid_type_error: "Le prix doit être un nombre" })
    .min(0, "Le prix doit être positif"),
  tax_rate: z
    .number({ invalid_type_error: "Le taux de TVA doit être un nombre" })
    .min(0, "Le taux de TVA doit être positif"),
  is_service: z.boolean(),
  category_id: z.string().nullable(),
})

export type ProductFormSchema = z.infer<typeof productFormSchema>