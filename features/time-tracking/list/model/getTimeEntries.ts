import { getSessionUser } from '@/shared/utils/getSessionUser'
import { TimeEntry } from '@/features/time-tracking/shared/types/timeEntry.types'
import { fetchList } from '@/shared/services/supabase/crud'

export async function getTimeEntries(): Promise<TimeEntry[]> {
  const { supabase, user } = await getSessionUser()

  return await fetchList<TimeEntry>(
    supabase,
    'time_entries',
    '*, project:projects(name), task:tasks(name)',
    { user_id: user.id },
    { column: 'date', ascending: false }
  )
}
