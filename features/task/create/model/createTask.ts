import { getSessionUser } from '@/shared/utils/getSessionUser'
import { TaskFormData } from '@/features/task/shared/types/task.types'

export async function createTask(projectId: string, formData: TaskFormData) {
  const { supabase, user } = await getSessionUser()

  // Vérifier que le projet appartient à l'utilisateur
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id")
    .eq("id", projectId)
    .eq("user_id", user.id)
    .single()

  if (projectError || !project) {
    throw new Error("Projet non trouvé ou non autorisé")
  }

  // Créer la tâche
  const { data, error: insertError } = await supabase
    .from("tasks")
    .insert({ ...formData, project_id: projectId })
    .select()

  if (insertError) {
    throw new Error(insertError.message)
  }

  return data?.[0]
}
