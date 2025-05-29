'use server'

import { updateSubtask } from '@/features/subtask/edit/model/updateSubtask'
import { TaskFormData, TaskActionResult } from '@/features/task/shared/types/task.types'
import { revalidatePath } from 'next/cache'
import { projectPath } from '@/shared/lib/routes'

export async function updateSubtaskAction(subtaskId: string, formData: TaskFormData): Promise<TaskActionResult> {
  try {
    const { projectId } = await updateSubtask(subtaskId, formData)
    revalidatePath(projectPath(projectId))
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}
