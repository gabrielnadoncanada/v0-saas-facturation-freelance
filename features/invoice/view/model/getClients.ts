import { Client } from "@/features/client/shared/types/client.types"
import { getSessionUser } from "@/shared/utils/getSessionUser"
import { fetchList } from "@/shared/services/supabase/crud"

export async function getClientsList(): Promise<Client[]> {
  const { supabase, organization } = await getSessionUser()
  
  if (!organization) {
    return []
  }

  return await fetchList<Client>(
    supabase,
    'clients',
    '*',
    { organization_id: organization.id },
    { column: 'name', ascending: true }
  )
}
  