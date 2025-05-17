'use server'

import { updateProjectInDb } from '../model/updateProjectInDb'
import { ProjectFormData, ProjectActionResult } from '@/shared/types/projects/project'

export async function updateProjectAction(
  projectId: string,
  formData: ProjectFormData
): Promise<ProjectActionResult> {
  try {
    await updateProjectInDb(projectId, formData)
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}
