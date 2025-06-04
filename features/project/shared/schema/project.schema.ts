import { z } from 'zod';

export const projectFormSchema = z.object({
  name: z.string().min(1, 'Le nom du projet est requis'),
  client_id: z.string().min(1, 'Le client est requis'),
  description: z.string().optional(),
  status: z.enum(['active', 'completed', 'on_hold', 'cancelled']),
  start_date: z.string().optional(), // ISO date string
  end_date: z.string().optional(), // ISO date string
  budget: z.union([z.number(), z.string()]).optional(),
});

export type ProjectFormSchema = z.infer<typeof projectFormSchema>;
