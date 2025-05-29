import { getSessionUser } from '@/shared/utils/getSessionUser'
import { deleteRecord } from '@/shared/services/supabase/crud'

export async function deleteTimeEntry(entryId: string): Promise<void> {
  const { supabase, user } = await getSessionUser()
  
  await deleteRecord(
    supabase,
    'time_entries',
    entryId,
    '*',
    { user_id: user.id }
  )
}
