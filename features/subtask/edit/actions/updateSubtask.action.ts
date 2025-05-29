'use server'

import { updateSubtask } from '@/features/subtask/edit/model/updateSubtask'
import { TaskFormData } from '@/features/task/shared/types/task.types'
import { projectPath } from '@/shared/lib/routes'
import { revalidatePath } from 'next/cache'
import { Result } from '@/shared/utils/result'
import { withAction } from '@/shared/utils/withAction'

export async function updateSubtaskAction(subtaskId: string, formData: TaskFormData): Promise<Result<null>> {
  return withAction(async () => {
    const { projectId } = await updateSubtask(subtaskId, formData)
    revalidatePath(projectPath(projectId))
    return null
  })
}
