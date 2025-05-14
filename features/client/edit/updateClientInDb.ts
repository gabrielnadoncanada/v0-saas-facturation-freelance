import { getSessionUser } from '@/shared/getSessionUser';
import { ClientFormData } from '@/types/clients/client';

export async function updateClientInDb(clientId: string, data: ClientFormData) {
  const { supabase, user } = await getSessionUser()

  const finalData = { ...data };

  delete finalData.sameAsShipping;

  if (data.sameAsShipping) {
    finalData.shipping_address = data.billing_address;
    finalData.shipping_city = data.billing_city;
    finalData.shipping_postal_code = data.billing_postal_code;
    finalData.shipping_country = data.billing_country;
  }

  if (finalData.hourly_rate) {
    finalData.hourly_rate = Number.parseFloat(finalData.hourly_rate as string);
  }

  return await supabase.from("clients").update(finalData).eq("id", clientId).eq("user_id", user.id);
} 