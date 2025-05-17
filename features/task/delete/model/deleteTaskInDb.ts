import { getSessionUser } from '@/shared/utils/getSessionUser'

export async function deleteTaskInDb(taskId: string): Promise<{ projectId: string }> {
  const { supabase, user } = await getSessionUser()

  // Récupérer la tâche
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

  // Supprimer la tâche
  const { error: deleteError } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId)

  if (deleteError) {
    throw new Error(deleteError.message)
  }

  return { projectId: task.project_id }
}
