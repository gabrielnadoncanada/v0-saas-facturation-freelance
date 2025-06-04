import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Client } from '@/features/client/shared/types/client.types';
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
      billing_address: client?.billing_address || '',
      billing_city: client?.billing_city || '',
      billing_postal_code: client?.billing_postal_code || '',
      billing_country: client?.billing_country || '',
      shipping_address: client?.shipping_address || '',
      shipping_city: client?.shipping_city || '',
      shipping_postal_code: client?.shipping_postal_code || '',
      shipping_country: client?.shipping_country || '',
      notes: client?.notes || '',
      sameAsShipping: client
        ? client.shipping_address === client.billing_address &&
          client.shipping_city === client.billing_city &&
          client.shipping_postal_code === client.billing_postal_code &&
          client.shipping_country === client.billing_country
        : true,
    },
    mode: 'onBlur',
  });

  const onSubmit = async (values: ClientFormSchema) => {
    setIsLoading(true);
    setError(null);
    try {
      let submitData = { ...values };
      if (values.sameAsShipping) {
        submitData.shipping_address = values.billing_address;
        submitData.shipping_city = values.billing_city;
        submitData.shipping_postal_code = values.billing_postal_code;
        submitData.shipping_country = values.billing_country;
      }

      const result = client
        ? await updateClientAction(client.id, submitData)
        : await createClientAction(submitData);
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
