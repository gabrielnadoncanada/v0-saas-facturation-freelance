import { getSessionUser } from '@/shared/utils/getSessionUser'
import { ProjectFormData } from '@/shared/types/projects/project'

export async function createProjectInDb(formData: ProjectFormData) {
  const { supabase, user } = await getSessionUser()

  const { data, error } = await supabase
    .from('projects')
    .insert({
      user_id: user.id,
      name: formData.name,
      description: formData.description,
      client_id: formData.client_id,
      status: formData.status,
      start_date: formData.start_date,
      end_date: formData.end_date,
      budget: formData.budget,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()

  if (error) throw new Error(error.message)
  return data?.[0]
}
