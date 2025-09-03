import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Client } from '@/shared/lib/drizzle/types';
import { ClientFormSchema, clientFormSchema } from '@/features/client/shared/schema/client.schema';

interface UseClientFormOptions {
  client: Client | null;
  onSubmitSuccess?: () => void;
  createClientAction: (data: ClientFormSchema) => Promise<any>;
  updateClientAction: (id: string, data: ClientFormSchema) => Promise<any>;
}

export function useClientForm({
  client,
  onSubmitSuccess,
  createClientAction,
  updateClientAction,
}: UseClientFormOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ClientFormSchema>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: client?.name || '',
      email: client?.email || '',
      phone: client?.phone || '',
      hourlyRate: client?.hourlyRate || '',
      billingAddress: client?.billingAddress || '',
      billingCity: client?.billingCity || '',
      billingPostalCode: client?.billingPostalCode || '',
      billingCountry: client?.billingCountry || '',
      shippingAddress: client?.shippingAddress || '',
      shippingCity: client?.shippingCity || '',
      shippingPostalCode: client?.shippingPostalCode || '',
      shippingCountry: client?.shippingCountry || '',
      notes: client?.notes || '',
      sameAsShipping: client
        ? client.shippingAddress === client.billingAddress &&
          client.shippingCity === client.billingCity &&
          client.shippingPostalCode === client.billingPostalCode &&
          client.shippingCountry === client.billingCountry
        : true,
    },
    mode: 'onBlur',
  });

  const onSubmit = async (values: ClientFormSchema) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = client
        ? await updateClientAction(client.id, values)
        : await createClientAction(values);
      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (err: any) {
      setError(err.message || 'Une erreur inattendue est survenue');
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    setIsLoading,
    error,
    setError,
    onSubmit,
  };
}
