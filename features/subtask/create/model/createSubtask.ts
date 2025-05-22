import { getSessionUser } from '@/shared/utils/getSessionUser'
import { Task, TaskFormData } from '@/features/task/shared/types/task.types'
import { extractDataOrThrow } from '@/shared/utils/extractDataOrThrow'

export async function createSubtask(taskId: string, formData: TaskFormData): Promise<{ subtask: Task; projectId: string }> {
  const { supabase, user } = await getSessionUser()

  // Vérifier que la tâche appartient à l'utilisateur via le projet
  const { data: task, error: taskError } = await supabase
    .from('tasks')
    .select('project_id')
    .eq('id', taskId)
    .single()

  if (taskError || !task) {
    throw new Error('Tâche non trouvée')
  }

  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('id')
    .eq('id', task.project_id)
    .eq('user_id', user.id)
    .single()

  if (projectError || !project) {
    throw new Error('Projet non trouvé ou non autorisé')
  }

  const { data, error: insertError } = await supabase
    .from('tasks')
    .insert({ ...formData, project_id: project.id, parent_task_id: taskId })
    .select()

  if (insertError) {
    throw new Error(insertError.message)
  }

  const subtask = extractDataOrThrow<Task>(data?.[0])

  return { subtask, projectId: project.id }
}
