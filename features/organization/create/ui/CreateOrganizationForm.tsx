'use client';

import { createOrganizationAction } from '../actions/createOrganization.action';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { z } from 'zod';

const organizationSchema = z.object({
  name: z.string().min(3, 'Le nom doit contenir au moins 3 caractères').max(50),
  slug: z
    .string()
    .min(3, 'Le nom court doit contenir au moins 3 caractères')
    .max(20)
    .regex(/^[a-z0-9-]+$/, 'Uniquement des lettres minuscules, chiffres et tirets')
    .transform((val) => val.toLowerCase()),
});

type OrganizationFormValues = z.infer<typeof organizationSchema>;

interface CreateOrganizationFormProps {
  onCancel?: () => void;
  onError?: (message: string) => void;
  onSuccess?: () => void;
}

export function CreateOrganizationForm({ onCancel, onError, onSuccess }: CreateOrganizationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: '',
      slug: '',
    },
  });

  const onSubmit = async (data: OrganizationFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await createOrganizationAction(data);

      if (result.success) {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/dashboard');
          router.refresh();
        }
      } else {
        const errorMessage = result.error || 'Une erreur est survenue';
        setError(errorMessage);
        if (onError) {
          onError(errorMessage);
        }
      }
    } catch (err) {
      const errorMessage = 'Une erreur est survenue';
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue('name', name);
    
    // Only auto-generate slug if user hasn't manually edited it
    if (!form.getValues('slug') || form.getValues('slug') === form.getValues('name').toLowerCase().replace(/[^a-z0-9-]/g, '-')) {
      const slug = name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
      form.setValue('slug', slug);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && <p className="text-sm font-medium text-destructive">{error}</p>}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de l&apos;organisation</FormLabel>
              <FormControl>
                <Input
                  placeholder="Mon entreprise"
                  {...field}
                  onChange={handleNameChange}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>Le nom affiché de votre organisation</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom court</FormLabel>
              <FormControl>
                <Input
                  placeholder="mon-entreprise"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                Utilisé dans les URLs et identifiants (lettres, chiffres et tirets uniquement)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-2">
          {onCancel && (
            <Button variant="outline" onClick={onCancel} disabled={isLoading}>
              Annuler
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Création...' : 'Créer l\'organisation'}
          </Button>
        </div>
      </form>
    </Form>
  );
} 