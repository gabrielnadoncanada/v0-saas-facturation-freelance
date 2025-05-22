import { getSessionUser } from '@/shared/utils/getSessionUser'
import { TaskFormData } from '@/features/task/shared/types/task.types'

export async function updateSubtask(subtaskId: string, formData: TaskFormData): Promise<{ projectId: string }> {
  const { supabase, user } = await getSessionUser()

  const { data: task, error: taskError } = await supabase
    .from('tasks')
    .select('project_id')
    .eq('id', subtaskId)
    .single()

  if (taskError || !task) {
    throw new Error('Sous-tâche non trouvée')
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

  const { error: updateError } = await supabase
    .from('tasks')
    .update(formData)
    .eq('id', subtaskId)

  if (updateError) {
    throw new Error(updateError.message)
  }

  return { projectId: task.project_id }
}
