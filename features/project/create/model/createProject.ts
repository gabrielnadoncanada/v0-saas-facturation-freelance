import { ProjectFormSchema } from '@/features/project/shared/schema/project.schema';
import { Project } from '@/features/project/shared/types/project.types';
import { getSessionUser } from '@/shared/utils/getSessionUser'
import { insertRecord } from '@/shared/services/supabase/crud'

export async function createProject(formData: ProjectFormSchema): Promise<Project> {
  const { supabase, organization } = await getSessionUser()
  
  if (!organization) {
    throw new Error("Aucune organisation active")
  }

  const finalData = {
    ...formData,
    organization_id: organization.id,
    client_id: formData.client_id,
  }

  return await insertRecord<Project>(
    supabase, 
    'projects', 
    finalData
  )
}
