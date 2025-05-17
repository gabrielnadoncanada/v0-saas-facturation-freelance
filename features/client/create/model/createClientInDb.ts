import { ClientFormData } from '@/shared/types/clients/client';
import { getSessionUser } from '@/shared/utils/getSessionUser'

export async function createClientInDb(data: ClientFormData) {
  const { supabase, user } = await getSessionUser()

  const finalData = { ...data } as any;

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

  finalData.user_id = user.id;

  return await supabase.from("clients").insert(finalData);
} 