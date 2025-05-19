'use server'

import { updateProject } from "@/features/project/edit/model/updateProject"
import { ProjectFormData } from '@/features/project/shared/types/project.types'
import { fail, Result } from "@/shared/utils/result"
import { success } from "@/shared/utils/result"

export async function updateProjectAction(
  projectId: string,
  formData: ProjectFormData
): Promise<Result<null>> {
  try {
    await updateProject(projectId, formData)
    return success(null)
  } catch (error) {
    return fail((error as Error).message)
  }
}
