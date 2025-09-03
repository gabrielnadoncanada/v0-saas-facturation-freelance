import { useState } from 'react';
import { createClientInlineAction } from '@/features/client/create/actions/createClientInline.action';
import { Client } from '@/shared/lib/drizzle/types';
import { ClientFormSchema } from '@/features/client/shared/schema/client.schema';

export function useCreateClientInlineForm(onCreated: (client: Client) => void) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultValues: Partial<ClientFormSchema> = {
    name: '',
    sameAsShipping: true,
  };

  async function onSubmit(data: ClientFormSchema) {
    setIsLoading(true);
    setError(null);

    try {
      const result = await createClientInlineAction(data);
      if (result.success) {
        onCreated(result.data);
      } else {
        setError(result.error || 'Une erreur est survenue');
      }
    } catch (err) {
      setError('Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  }

  return { isLoading, error, defaultValues, onSubmit };
}
