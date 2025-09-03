import { z } from 'zod';

export const createOrganizationSchema = z.object({
  name: z.string().min(3, 'Le nom doit contenir au moins 3 caractères').max(50),
  slug: z
    .string()
    .min(3, 'Le nom court doit contenir au moins 3 caractères')
    .max(20)
    .regex(/^[a-z0-9-]+$/, 'Uniquement des lettres minuscules, chiffres et tirets')
    .transform((val) => val.toLowerCase()),
});

export const switchOrganizationSchema = z.object({
  organizationId: z.string().uuid('ID d\'organisation invalide'),
});

export const inviteToOrganizationSchema = z.object({
  email: z.string().email('Email invalide'),
  role: z.enum(['owner', 'admin', 'member'], {
    errorMap: () => ({ message: 'Rôle invalide' })
  }),
});

export type CreateOrganizationSchema = z.infer<typeof createOrganizationSchema>;
export type SwitchOrganizationSchema = z.infer<typeof switchOrganizationSchema>;
export type InviteToOrganizationSchema = z.infer<typeof inviteToOrganizationSchema>;
