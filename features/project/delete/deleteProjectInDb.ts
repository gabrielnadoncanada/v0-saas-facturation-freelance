import { getSessionUser } from '@/shared/utils/getSessionUser'

export async function deleteProjectInDb(projectId: string): Promise<void> {
  const { supabase, user } = await getSessionUser()

  // Vérifier que le projet existe et appartient à l'utilisateur
  const { data: project, error: fetchError } = await supabase
    .from("projects")
    .select("id")
    .eq("id", projectId)
    .eq("user_id", user.id)
    .single()

  if (fetchError || !project) {
    throw new Error(fetchError?.message || "Projet non trouvé ou non autorisé")
  }

  // Supprimer le projet
  const { error: deleteError } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId)
    .eq("user_id", user.id)

  if (deleteError) {
    throw new Error(deleteError.message)
  }
}
