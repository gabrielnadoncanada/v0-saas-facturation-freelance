import { Project } from '@/features/project/shared/types/project.types'
import { extractDataOrThrow } from '@/shared/utils/extractDataOrThrow'
import { getSessionUser } from '@/shared/utils/getSessionUser'

export async function deleteProject(projectId: string): Promise<Project> {
  const { supabase, user } = await getSessionUser()

  // Vérifier que le projet existe et appartient à l'utilisateur
  const res = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .eq("user_id", user.id)
    .single()

  if (res.error || !res.data) {
    throw new Error(res.error?.message || "Projet non trouvé ou non autorisé")
  }

  // Supprimer le projet
  const { error: deleteError } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId)
    .eq("user_id", user.id)
    .select("*")
    .single()

  return extractDataOrThrow<Project>(res)
}
