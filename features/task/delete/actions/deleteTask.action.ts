
'use server'

import { deleteTask } from "@/features/task/delete/model/deleteTask"
import { Result } from '@/shared/utils/result'
import { revalidatePath } from 'next/cache'
import { withAction } from '@/shared/utils/withAction'
import { projectPath } from '@/shared/lib/routes'

export async function deleteTaskAction(taskId: string): Promise<Result<null>> {
  return withAction(async () => {
    const { projectId } = await deleteTask(taskId)
    revalidatePath(projectPath(projectId))
    return null
  })
}
