import { getSessionUser } from '@/shared/utils/getSessionUser'
import { Project } from '@/features/project/shared/types/project.types'
import { extractDataOrThrow } from '@/shared/utils/extractDataOrThrow'

export async function getProjects(): Promise<Project[]> {
  const { supabase, user } = await getSessionUser()

  const res = await supabase
    .from('projects')
    .select('*, clients(name)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return extractDataOrThrow<Project[]>(res)
}
