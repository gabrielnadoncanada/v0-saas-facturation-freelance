import { Project } from '@/features/project/shared/types/project.types'
import { extractDataOrThrow } from '@/shared/utils/extractDataOrThrow'
import { getSessionUser } from '@/shared/utils/getSessionUser'

export async function getRecentProjects() {
  const { supabase, user } = await getSessionUser()

  const res = await supabase
    .from("projects")
    .select("*, clients(name), tasks(status)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  return extractDataOrThrow<Project[]>(res)
}
