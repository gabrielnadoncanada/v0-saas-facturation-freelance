import { getSessionUser } from '@/shared/utils/getSessionUser'
import { ProjectFormData } from '@/features/project/shared/types/project.types'
import { Project } from '@/features/project/shared/types/project.types'
import { extractDataOrThrow } from '@/shared/utils/extractDataOrThrow'

export async function updateProject(projectId: string, formData: ProjectFormData): Promise<Project> {
  const { supabase, user } = await getSessionUser()

  const res = await supabase
    .from('projects')
    .update({
      name: formData.name,
      description: formData.description,
      client_id: formData.client_id,
      status: formData.status,
      start_date: formData.start_date,
      end_date: formData.end_date,
      updated_at: new Date().toISOString(),
    })
    .eq('id', projectId)
    .eq('user_id', user.id)
    .select('*')
    .single()

  return extractDataOrThrow<Project>(res)
}
