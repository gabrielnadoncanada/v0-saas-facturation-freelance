import { ClientFormSchema } from '@/features/client/shared/schema/client.schema';
import { Client } from '@/features/client/shared/types/client.types';
import { getSessionUser } from '@/shared/utils/getSessionUser'
import { extractDataOrThrow } from '@/shared/utils/extractDataOrThrow'

export async function createClient(formData: ClientFormSchema): Promise<Client> {
  const { supabase, user } = await getSessionUser() 

  const finalData = { ...formData } as any;

  delete finalData.sameAsShipping;

  if (formData.sameAsShipping) {
    finalData.shipping_address = formData.billing_address;
    finalData.shipping_city = formData.billing_city;
    finalData.shipping_postal_code = formData.billing_postal_code;
    finalData.shipping_country = formData.billing_country;
  }

  finalData.user_id = user.id;

  const res = await supabase.from("clients").insert(finalData).select("*").single()

  if (res.error) throw new Error(res.error.message)

  return extractDataOrThrow<Client>(res)
}
