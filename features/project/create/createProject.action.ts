'use server'

import { createProjectInDb } from './createProjectInDb'
import { ProjectFormData, ProjectActionResult } from '@/shared/types/projects/project'

export async function createProjectAction(formData: ProjectFormData): Promise<ProjectActionResult> {
  try {
    const project = await createProjectInDb(formData)
    return { success: true, data: project }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}
