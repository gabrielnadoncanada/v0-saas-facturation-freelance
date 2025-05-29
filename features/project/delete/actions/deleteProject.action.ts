'use server'

import { deleteProject } from '@/features/project/delete/model/deleteProject'
import { fail, Result } from '@/shared/utils/result'
import { success } from '@/shared/utils/result'
import { revalidatePath } from 'next/cache'
import { PROJECTS_PATH } from '@/shared/lib/routes'

export async function deleteProjectAction(projectId: string): Promise<Result<null>> {
  try {
    await deleteProject(projectId)
    revalidatePath(PROJECTS_PATH)
    return success(null)
  } catch (error) {
    return fail((error as Error).message)
  }
}
