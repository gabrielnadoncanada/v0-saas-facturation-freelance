'use server'

import { fetchProjectDetails } from '@/features/project/edit/model/fetchProjectDetails'
import { ProjectActionResult } from '@/shared/types/projects/project'

export async function getProjectAction(projectId: string): Promise<ProjectActionResult> {
  try {
    const data = await fetchProjectDetails(projectId)
    return { success: true, data }
  } catch (error) {
    return { success: false, error: (error as Error).message, data: null }
  }
}
