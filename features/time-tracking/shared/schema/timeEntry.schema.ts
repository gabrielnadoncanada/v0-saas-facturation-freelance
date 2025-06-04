import { z } from 'zod';

export const timeEntryFormSchema = z.object({
  project_id: z.string().min(1, 'Le projet est requis'),
  task_id: z.string().optional(),
  date: z.date({ required_error: 'La date est requise' }),
  hours: z.number().min(0.01, 'Les heures doivent être positives'),
  description: z.string().optional(),
});

export type TimeEntryFormSchema = z.infer<typeof timeEntryFormSchema>;
