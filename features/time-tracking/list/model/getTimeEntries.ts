import { getSessionUser } from '@/shared/utils/getSessionUser'
import { TimeEntry } from '@/features/time-tracking/shared/types/timeEntry.types'
import { fetchList } from '@/shared/services/supabase/crud'

export async function getTimeEntries(): Promise<TimeEntry[]> {
  const { supabase, organization } = await getSessionUser()
  
  if (!organization) {
    return []
  }

  return await fetchList<TimeEntry>(
    supabase,
    'time_entries',
    '*, project:projects(name), task:tasks(name)',
    { organization_id: organization.id },
    { column: 'date', ascending: false }
  )
}
