import { getSessionUser } from '@/shared/utils/getSessionUser'
import { TimeEntry } from '@/features/time-tracking/shared/types/timeEntry.types'
import { fetchById } from '@/shared/services/supabase/crud'

export async function getTimeEntry(entryId: string): Promise<TimeEntry> {
  const { supabase, user } = await getSessionUser()
  
  return await fetchById<TimeEntry>(
    supabase,
    'time_entries',
    entryId,
    '*, project:projects(name), task:tasks(name)',
    { user_id: user.id }
  )
}
