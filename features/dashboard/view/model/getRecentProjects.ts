import { Project } from '@/features/project/shared/types/project.types'
import { getSessionUser } from '@/shared/utils/getSessionUser'
import { fetchList } from '@/shared/services/supabase/crud'

export async function getRecentProjects(): Promise<Project[]> {
  const { supabase, user } = await getSessionUser()

  return await fetchList<Project>(
    supabase,
    'projects',
    '*, clients(name), tasks(status)',
    { user_id: user.id },
    { column: 'created_at', ascending: false },
    5 // limit to 5 projects
  )
}
