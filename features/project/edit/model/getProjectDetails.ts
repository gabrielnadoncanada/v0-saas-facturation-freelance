import { getSessionUser } from '@/shared/utils/getSessionUser'
import { Project } from '@/features/project/shared/types/project.types'
import { extractDataOrThrow } from '@/shared/utils/extractDataOrThrow'

export async function getProjectDetails(projectId: string): Promise<Project> {
  const { supabase, user } = await getSessionUser()

  const res = await supabase
    .from("projects")
    .select(`
      *,
      clients(name),
      tasks(*)
    `)
    .eq("id", projectId)
    .eq("user_id", user.id)
    .single()

  return extractDataOrThrow<Project>(res)
}
