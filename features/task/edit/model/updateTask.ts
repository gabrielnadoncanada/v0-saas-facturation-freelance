import { getSessionUser } from '@/shared/utils/getSessionUser'
import { TaskFormData } from '@/features/task/shared/types/task.types'
import { fetchById, fetchList, updateRecord } from '@/shared/services/supabase/crud'

export async function updateTask(taskId: string, formData: TaskFormData): Promise<{ projectId: string }> {
  const { supabase, organization } = await getSessionUser()
  
  if (!organization) {
    throw new Error("Aucune organisation active")
  }

  // Vérifier que la tâche existe
  const task = await fetchById<{ project_id: string }>(
    supabase,
    'tasks',
    taskId,
    'project_id'
  )

  // Vérifier que le projet appartient à l'organisation
  const projects = await fetchList(
    supabase,
    'projects',
    'id',
    { id: task.project_id, organization_id: organization.id }
  )

  if (!projects.length) {
    throw new Error("Projet non trouvé ou non autorisé")
  }

  // Mettre à jour la tâche
  await updateRecord(
    supabase,
    'tasks',
    taskId,
    formData,
    '*',
    { project_id: task.project_id }
  )

  return { projectId: task.project_id }
}
