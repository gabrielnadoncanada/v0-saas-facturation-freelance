import { getSessionUser } from '@/shared/utils/getSessionUser'
import { ProjectFormData } from '@/features/project/shared/types/project.types'
import { Project } from '@/features/project/shared/types/project.types'
import { updateRecord } from '@/shared/services/supabase/crud'

export async function updateProject(projectId: string, formData: ProjectFormData): Promise<Project> {
  const { supabase, organization } = await getSessionUser()
  
  if (!organization) {
    throw new Error("Aucune organisation active")
  }

  const updateData = {
    name: formData.name,
    description: formData.description,
    client_id: formData.client_id,
    status: formData.status,
    start_date: formData.start_date,
    end_date: formData.end_date,
    updated_at: new Date().toISOString(),
  }

  return await updateRecord<Project>(
    supabase,
    'projects',
    projectId,
    updateData,
    '*',
    { organization_id: organization.id }
  )
}
