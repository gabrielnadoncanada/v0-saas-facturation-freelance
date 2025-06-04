import { getSessionUser } from '@/shared/utils/getSessionUser';
import { ClientFormData } from '@/features/client/shared/types/client.types';
import { Client } from '@/features/client/shared/types/client.types';
import { updateRecord } from '@/shared/services/supabase/crud';

export async function updateClient(clientId: string, data: ClientFormData): Promise<Client> {
  const { supabase, organization } = await getSessionUser();

  if (!organization) {
    throw new Error('Aucune organisation active');
  }

  const finalData = { ...data } as any;

  delete finalData.sameAsShipping;

  if (data.sameAsShipping) {
    finalData.shipping_address = data.billing_address;
    finalData.shipping_city = data.billing_city;
    finalData.shipping_postal_code = data.billing_postal_code;
    finalData.shipping_country = data.billing_country;
  }

  // Convert hourly_rate to number if it's a string
  if (typeof finalData.hourly_rate === 'string') {
    finalData.hourly_rate = parseFloat(finalData.hourly_rate) || null;
  }

  return await updateRecord<Client>(supabase, 'clients', clientId, finalData, '*', {
    organization_id: organization.id,
  });
}
