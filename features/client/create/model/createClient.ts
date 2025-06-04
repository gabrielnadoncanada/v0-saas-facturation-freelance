import { ClientFormSchema } from '@/features/client/shared/schema/client.schema';
import { Client } from '@/features/client/shared/types/client.types';
import { getSessionUser } from '@/shared/utils/getSessionUser'
import { insertRecord } from '@/shared/services/supabase/crud'

export async function createClient(formData: ClientFormSchema): Promise<Client> {
  const { supabase, organization } = await getSessionUser() 

  if (!organization) {
    throw new Error("Aucune organisation active")
  }

  const finalData = { ...formData } as any;

  delete finalData.sameAsShipping;

  if (formData.sameAsShipping) {
    finalData.shipping_address = formData.billing_address;
    finalData.shipping_city = formData.billing_city;
    finalData.shipping_postal_code = formData.billing_postal_code;
    finalData.shipping_country = formData.billing_country;
  }

  finalData.organization_id = organization.id;

  return await insertRecord<Client>(supabase, 'clients', finalData)
}
