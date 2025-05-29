import { getSessionUser } from '@/shared/utils/getSessionUser'
import { Project } from '@/features/project/shared/types/project.types'
import { fetchList } from '@/shared/services/supabase/crud'

export async function getProjects(): Promise<Project[]> {
  const { supabase, user } = await getSessionUser()

  return await fetchList<Project>(
    supabase, 
    'projects', 
    '*, clients(name)', 
    { user_id: user.id }, 
    { column: 'created_at', ascending: false }
  )
}
