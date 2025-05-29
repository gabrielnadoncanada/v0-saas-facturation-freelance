import { Client } from "@/features/client/shared/types/client.types"
import { getSessionUser } from "@/shared/utils/getSessionUser"
import { fetchList } from "@/shared/services/supabase/crud"

export async function getClientsList(): Promise<Client[]> {
  const { supabase, user } = await getSessionUser()

  return await fetchList<Client>(
    supabase,
    'clients',
    '*',
    { user_id: user.id },
    { column: 'name', ascending: true }
  )
}
  