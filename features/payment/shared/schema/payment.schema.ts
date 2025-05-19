import { z } from "zod"

export const paymentFormSchema = z.object({
  invoice_id: z.string().min(1, "La facture est requise"),
  amount: z.number().min(0.01, "Le montant doit être positif"),
  payment_date: z.date({ required_error: "La date est requise" }),
  payment_method: z.string().min(1, "La méthode est requise"),
  notes: z.string(),
})

export type PaymentFormSchema = z.infer<typeof paymentFormSchema>