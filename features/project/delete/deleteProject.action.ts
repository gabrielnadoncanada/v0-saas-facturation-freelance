'use server'

import { deleteProjectInDb } from './deleteProjectInDb'
import { ProjectActionResult } from '@/shared/types/projects/project'
import { revalidatePath } from 'next/cache'

export async function deleteProjectAction(projectId: string): Promise<ProjectActionResult> {
  try {
    await deleteProjectInDb(projectId)
    revalidatePath('/dashboard/projects')
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}
