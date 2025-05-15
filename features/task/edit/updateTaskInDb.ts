import { getSessionUser } from '@/shared/utils/getSessionUser'
import { TaskFormData } from '@/shared/types/tasks/task'

export async function updateTaskInDb(taskId: string, formData: TaskFormData): Promise<{ projectId: string }> {
  const { supabase, user } = await getSessionUser()

  // Vérifier que la tâche existe
  const { data: task, error: taskError } = await supabase
    .from("tasks")
    .select("project_id")
    .eq("id", taskId)
    .single()

  if (taskError || !task) {
    throw new Error("Tâche non trouvée")
  }

  // Vérifier que le projet appartient à l'utilisateur
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id")
    .eq("id", task.project_id)
    .eq("user_id", user.id)
    .single()

  if (projectError || !project) {
    throw new Error("Projet non trouvé ou non autorisé")
  }

  // Mettre à jour la tâche
  const { error: updateError } = await supabase
    .from("tasks")
    .update(formData)
    .eq("id", taskId)

  if (updateError) {
    throw new Error(updateError.message)
  }

  return { projectId: task.project_id }
}
