'use server'

import { deleteSubtask } from '@/features/subtask/delete/model/deleteSubtask'
import { projectPath } from '@/shared/lib/routes'
import { Result } from '@/shared/utils/result'
import { withAction } from '@/shared/utils/withAction'
import { revalidatePath } from 'next/cache'

export async function deleteSubtaskAction(subtaskId: string): Promise<Result<null>> {
  return withAction(async () => {
    const { projectId } = await deleteSubtask(subtaskId)
    revalidatePath(projectPath(projectId))
    return null
  })
}
