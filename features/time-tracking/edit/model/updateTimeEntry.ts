import { getSessionUser } from '@/shared/utils/getSessionUser'
import { TimeEntryFormData } from '@/features/time-tracking/shared/types/timeEntry.types'
import { fetchById, updateRecord } from '@/shared/services/supabase/crud'

export async function updateTimeEntry(entryId: string, formData: TimeEntryFormData): Promise<void> {
  const { supabase, organization } = await getSessionUser()
  
  if (!organization) {
    throw new Error("Aucune organisation active")
  }

  // Vérifier que l'entrée existe et appartient à l'organisation
  const entry = await fetchById(
    supabase,
    'time_entries',
    entryId,
    'organization_id',
    { organization_id: organization.id }
  )

  const updateData = {
    project_id: formData.project_id,
    task_id: formData.task_id || null,
    date: formData.date.toISOString().split('T')[0],
    hours: formData.hours,
    description: formData.description,
  }

  await updateRecord(
    supabase,
    'time_entries',
    entryId,
    updateData,
    '*',
    { organization_id: organization.id }
  )
}
