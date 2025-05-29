import { getSessionUser } from '@/shared/utils/getSessionUser'
import { TaskFormData } from '@/features/task/shared/types/task.types'
import { fetchById, fetchList, updateRecord } from '@/shared/services/supabase/crud'

export async function updateSubtask(subtaskId: string, formData: TaskFormData): Promise<{ projectId: string }> {
  const { supabase, user } = await getSessionUser()

  // Vérifier que la sous-tâche existe
  const task = await fetchById<{ project_id: string }>(
    supabase,
    'tasks',
    subtaskId,
    'project_id'
  )

  // Vérifier que le projet appartient à l'utilisateur
  const projects = await fetchList(
    supabase,
    'projects',
    'id',
    { id: task.project_id, user_id: user.id }
  )

  if (!projects.length) {
    throw new Error('Projet non trouvé ou non autorisé')
  }

  // Mettre à jour la sous-tâche
  await updateRecord(
    supabase,
    'tasks',
    subtaskId,
    formData
  )

  return { projectId: task.project_id }
}
