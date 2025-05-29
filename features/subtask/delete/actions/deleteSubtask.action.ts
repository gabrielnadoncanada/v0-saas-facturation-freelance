'use server'

import { deleteSubtask } from '@/features/subtask/delete/model/deleteSubtask'
import { TaskActionResult } from '@/features/task/shared/types/task.types'
import { revalidatePath } from 'next/cache'
import { projectPath } from '@/shared/lib/routes'

export async function deleteSubtaskAction(subtaskId: string): Promise<TaskActionResult> {
  try {
    const { projectId } = await deleteSubtask(subtaskId)
    revalidatePath(projectPath(projectId))
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}
