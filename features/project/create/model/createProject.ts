import { getSessionUser } from '@/shared/utils/getSessionUser'
import { Project, ProjectFormData } from '@/features/project/shared/types/project.types'
import { extractDataOrThrow } from '@/shared/utils/extractDataOrThrow'

export async function createProject(formData: ProjectFormData) {
  const { supabase, user } = await getSessionUser()

  const res = await supabase
    .from('projects')
    .insert({
      user_id: user.id,
      name: formData.name,
      description: formData.description,
      client_id: formData.client_id,
      status: formData.status,
      start_date: formData.start_date,
      end_date: formData.end_date,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()

  return extractDataOrThrow<Project>(res)
}
