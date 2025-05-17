import { getSessionUser } from '@/shared/utils/getSessionUser'
import { ProjectFormData } from '@/shared/types/projects/project'

export async function updateProjectInDb(projectId: string, formData: ProjectFormData): Promise<void> {
  const { supabase, user } = await getSessionUser()

  const { error } = await supabase
    .from('projects')
    .update({
      name: formData.name,
      description: formData.description,
      client_id: formData.client_id,
      status: formData.status,
      start_date: formData.start_date,
      end_date: formData.end_date,
      budget: formData.budget,
      updated_at: new Date().toISOString(),
    })
    .eq('id', projectId)
    .eq('user_id', user.id)

  if (error) {
    throw new Error(error.message)
  }
}
