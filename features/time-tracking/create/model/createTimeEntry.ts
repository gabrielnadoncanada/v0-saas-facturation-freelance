import { getSessionUser } from '@/shared/utils/getSessionUser'
import { TimeEntry, TimeEntryFormData } from '@/features/time-tracking/shared/types/timeEntry.types'
import { insertRecord } from '@/shared/services/supabase/crud'

export async function createTimeEntry(formData: TimeEntryFormData): Promise<TimeEntry> {
  const { supabase, user } = await getSessionUser()

  const entryData = {
    user_id: user.id,
    project_id: formData.project_id,
    task_id: formData.task_id || null,
    date: formData.date.toISOString().split('T')[0],
    hours: formData.hours,
    description: formData.description,
  }

  return await insertRecord<TimeEntry>(
    supabase,
    'time_entries',
    entryData
  )
}
