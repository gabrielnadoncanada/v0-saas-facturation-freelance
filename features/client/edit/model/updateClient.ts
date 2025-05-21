import { getSessionUser } from '@/shared/utils/getSessionUser';
import { ClientFormData } from '@/features/client/shared/types/client.types';
import { extractDataOrThrow } from '@/shared/utils/extractDataOrThrow';
import { Client } from '@/features/client/shared/types/client.types';

export async function updateClient(clientId: string, data: ClientFormData): Promise<Client> {
  const { supabase, user } = await getSessionUser()

  const finalData = { ...data };

  delete finalData.sameAsShipping;

  if (data.sameAsShipping) {
    finalData.shipping_address = data.billing_address;
    finalData.shipping_city = data.billing_city;
    finalData.shipping_postal_code = data.billing_postal_code;
    finalData.shipping_country = data.billing_country;
  }

  const res = await supabase.from("clients").update(finalData).eq("id", clientId).eq("user_id", user.id).select("*").single()

  if (res.error) throw new Error(res.error.message)

  return extractDataOrThrow<Client>(res)
} 