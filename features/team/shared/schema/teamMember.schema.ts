import { z } from "zod"

export const teamMemberFormSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  role: z.string().optional(),
})

export type TeamMemberFormSchema = z.infer<typeof teamMemberFormSchema>
