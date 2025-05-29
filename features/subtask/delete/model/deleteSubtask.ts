import { getSessionUser } from '@/shared/utils/getSessionUser'
import { fetchById, fetchList, deleteRecord } from '@/shared/services/supabase/crud'

export async function deleteSubtask(subtaskId: string): Promise<{ projectId: string }> {
  const { supabase, user } = await getSessionUser()

  // Récupérer la sous-tâche
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

  // Supprimer la sous-tâche
  await deleteRecord(
    supabase,
    'tasks',
    subtaskId
  )

  return { projectId: task.project_id }
}
