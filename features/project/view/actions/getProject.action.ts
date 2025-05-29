'use server'

import { getProjectDetails } from '@/features/project/view/model/getProjectDetails'
import { Project } from '@/features/project/shared/types/project.types'
import { fail, Result, success } from '@/shared/utils/result'

export async function getProjectAction(projectId: string): Promise<Result<Project>> {
  try {
    const project = await getProjectDetails(projectId)
    return success(project)
  } catch (error) {
    return fail((error as Error).message)
  }
} 