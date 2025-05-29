import { getSessionUser } from '@/shared/utils/getSessionUser'
import { Project, ProjectFormData } from '@/features/project/shared/types/project.types'
import { insertRecord } from '@/shared/services/supabase/crud'

export async function createProject(formData: ProjectFormData): Promise<Project> {
  const { supabase, user } = await getSessionUser()

  const projectData = {
    user_id: user.id,
    name: formData.name,
    description: formData.description,
    client_id: formData.client_id,
    status: formData.status,
    start_date: formData.start_date,
    end_date: formData.end_date,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  return await insertRecord<Project>(
    supabase,
    'projects',
    projectData
  )
}
