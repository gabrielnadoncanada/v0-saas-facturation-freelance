import { getSessionUser } from '@/shared/utils/getSessionUser'

export async function deleteSubtask(subtaskId: string): Promise<{ projectId: string }> {
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

  const { error: deleteError } = await supabase
    .from('tasks')
    .delete()
    .eq('id', subtaskId)

  if (deleteError) {
    throw new Error(deleteError.message)
  }

  return { projectId: task.project_id }
}
