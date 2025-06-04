import { getSessionUser } from '@/shared/utils/getSessionUser'
import { Task, TaskFormData } from '@/features/task/shared/types/task.types'
import { fetchById, fetchList, insertRecord } from '@/shared/services/supabase/crud'

export async function createSubtask(taskId: string, formData: TaskFormData): Promise<{ subtask: Task; projectId: string }> {
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
    throw new Error('Projet non trouvé ou non autorisé')
  }

  // Créer la sous-tâche
  const subtask = await insertRecord<Task>(
    supabase,
    'tasks',
    { ...formData, project_id: task.project_id, parent_task_id: taskId }
  )

  return { subtask, projectId: task.project_id }
}
