import { getSessionUser } from '@/shared/utils/getSessionUser'
import { extractDataOrThrow } from '@/shared/utils/extractDataOrThrow'
import { TimeEntry } from '@/features/time-tracking/shared/types/timeEntry.types'

export async function getTimeEntries(): Promise<TimeEntry[]> {
  const { supabase, user } = await getSessionUser()

  const res = await supabase
    .from('time_entries')
    .select('*, project:projects(name), task:tasks(name)')
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  return extractDataOrThrow<TimeEntry[]>(res)
}
