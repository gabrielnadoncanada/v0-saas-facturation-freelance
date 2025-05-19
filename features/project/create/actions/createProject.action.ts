'use server'

import { createProject } from '@/features/project/create/model/createProject'
import { Project, ProjectFormData } from '@/features/project/shared/types/project.types'
import { fail, Result } from '@/shared/utils/result'
import { success } from '@/shared/utils/result'

export async function createProjectAction(formData: ProjectFormData): Promise<Result<Project>> {
  try {
    const project = await createProject(formData)
    return success(project)
  } catch (error) {
    return fail((error as Error).message)
  }
}
