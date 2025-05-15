import { getSessionUser } from '@/shared/utils/getSessionUser'
import { Project } from '@/shared/types/projects/project'
import { extractDataOrThrow } from '@/shared/utils/extractDataOrThrow'

export async function fetchAllProjects(): Promise<Project[]> {
  const { supabase, user } = await getSessionUser()

  const res = await supabase
    .from('projects')
    .select('*, clients(name)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })


  return extractDataOrThrow<Project[]>(res)
}
