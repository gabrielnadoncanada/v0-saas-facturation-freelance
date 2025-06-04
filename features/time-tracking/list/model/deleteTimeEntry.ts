import { getSessionUser } from '@/shared/utils/getSessionUser'
import { deleteRecord } from '@/shared/services/supabase/crud'

export async function deleteTimeEntry(entryId: string): Promise<void> {
  const { supabase, organization } = await getSessionUser()
  
  if (!organization) {
    throw new Error("Aucune organisation active")
  }
  
  await deleteRecord(
    supabase,
    'time_entries',
    entryId,
    '*',
    { organization_id: organization.id }
  )
}
