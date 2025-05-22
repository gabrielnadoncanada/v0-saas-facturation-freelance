import { getSessionUser } from '@/shared/utils/getSessionUser'
import { TimeEntryFormData } from '@/features/time-tracking/shared/types/timeEntry.types'

export async function updateTimeEntry(entryId: string, formData: TimeEntryFormData): Promise<void> {
  const { supabase, user } = await getSessionUser()

  const { data: entry, error: fetchError } = await supabase
    .from('time_entries')
    .select('user_id')
    .eq('id', entryId)
    .single()

  if (fetchError || !entry || entry.user_id !== user.id) {
    throw new Error('Entrée non trouvée')
  }

  const { error } = await supabase
    .from('time_entries')
    .update({
      project_id: formData.project_id,
      task_id: formData.task_id || null,
      date: formData.date.toISOString().split('T')[0],
      hours: formData.hours,
      description: formData.description,
    })
    .eq('id', entryId)

  if (error) {
    throw new Error(error.message)
  }
}
